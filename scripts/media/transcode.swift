// Re-encode a video to a small H.264/AAC .mp4 (keeps orientation).
//   swift transcode.swift <in> <out.mp4> [maxSide=960] [videoKbps=1800]
// macOS only (AVFoundation) — no ffmpeg needed.
import AVFoundation
import Foundation

let a = CommandLine.arguments
guard a.count >= 3 else { print("usage: transcode <in> <out.mp4> [maxSide] [kbps]"); exit(1) }
let inURL = URL(fileURLWithPath: a[1]), outURL = URL(fileURLWithPath: a[2])
let maxSide = a.count > 3 ? Double(a[3])! : 960
let kbps = a.count > 4 ? Double(a[4])! : 1800
try? FileManager.default.removeItem(at: outURL)

let asset = AVURLAsset(url: inURL)
guard let vTrack = asset.tracks(withMediaType: .video).first else { print("no video track"); exit(1) }
let nat = vTrack.naturalSize, xf = vTrack.preferredTransform
// Size as the viewer sees it (after the phone's rotation flag).
let shown = CGRect(origin: .zero, size: nat).applying(xf)
let dispW = abs(shown.width), dispH = abs(shown.height)
let scale = min(1, maxSide / Double(max(dispW, dispH)))
func even(_ v: Double) -> Int { max(2, Int((v / 2).rounded()) * 2) }
let outW = even(Double(dispW) * scale), outH = even(Double(dispH) * scale)

// Maximum compatibility for desktop browsers (Edge/Chrome on Windows use hardware decoders that are strict):
//  - the rotation is baked into the pixels (no rotation flag), so the picture is stored upright
//  - at most 30 fps (60 fps at this size would exceed H.264 level 3.1)
//  - H.264 Main profile, no B-frames
//  - plain SDR BT.709 colour (iPhone clips can be HDR/HLG, which some browsers show as a black picture)
let srcFps = Double(vTrack.nominalFrameRate)
let fps = Int32(max(1, min(30, srcFps.rounded())))
var t = xf.concatenating(CGAffineTransform(translationX: -shown.minX, y: -shown.minY))
t = t.concatenating(CGAffineTransform(scaleX: CGFloat(outW) / dispW, y: CGFloat(outH) / dispH))

let comp = AVMutableVideoComposition()
comp.renderSize = CGSize(width: outW, height: outH)
comp.frameDuration = CMTime(value: 1, timescale: fps)
comp.colorPrimaries = AVVideoColorPrimaries_ITU_R_709_2
comp.colorTransferFunction = AVVideoTransferFunction_ITU_R_709_2
comp.colorYCbCrMatrix = AVVideoYCbCrMatrix_ITU_R_709_2
let step = AVMutableVideoCompositionInstruction()
step.timeRange = CMTimeRange(start: .zero, duration: asset.duration)
let layer = AVMutableVideoCompositionLayerInstruction(assetTrack: vTrack)
layer.setTransform(t, at: .zero)
step.layerInstructions = [layer]
comp.instructions = [step]

let reader = try AVAssetReader(asset: asset)
let vOut = AVAssetReaderVideoCompositionOutput(videoTracks: [vTrack], videoSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA])
vOut.videoComposition = comp
reader.add(vOut)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
let sdr709: [String: Any] = [
  AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
  AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
  AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
]
let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: outW, AVVideoHeightKey: outH,
  AVVideoColorPropertiesKey: sdr709,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: kbps * 1000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel,
    AVVideoAllowFrameReorderingKey: false,
    AVVideoExpectedSourceFrameRateKey: Int(fps),
    AVVideoMaxKeyFrameIntervalKey: Int(fps) * 2,
  ],
])
vIn.expectsMediaDataInRealTime = false
writer.add(vIn)

var aOut: AVAssetReaderTrackOutput?, aIn: AVAssetWriterInput?
if let aTrack = asset.tracks(withMediaType: .audio).first {
  let o = AVAssetReaderTrackOutput(track: aTrack, outputSettings: [AVFormatIDKey: kAudioFormatLinearPCM])
  reader.add(o); aOut = o
  let i = AVAssetWriterInput(mediaType: .audio, outputSettings: [AVFormatIDKey: kAudioFormatMPEG4AAC, AVNumberOfChannelsKey: 2, AVSampleRateKey: 44100, AVEncoderBitRateKey: 96000])
  writer.add(i); aIn = i
}
writer.shouldOptimizeForNetworkUse = true   // "faststart"
reader.startReading(); writer.startWriting(); writer.startSession(atSourceTime: .zero)

func pump(_ input: AVAssetWriterInput, _ output: AVAssetReaderOutput, _ q: String, _ g: DispatchGroup) {
  g.enter()
  input.requestMediaDataWhenReady(on: DispatchQueue(label: q)) {
    while input.isReadyForMoreMediaData {
      if let s = output.copyNextSampleBuffer() { input.append(s) } else { input.markAsFinished(); g.leave(); return }
    }
  }
}
let group = DispatchGroup()
pump(vIn, vOut, "v", group)
if let i = aIn, let o = aOut { pump(i, o, "a", group) }
group.wait()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
print(writer.status == .completed ? "ok \(outURL.lastPathComponent)" : "failed: \(String(describing: writer.error))")
