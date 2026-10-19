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
let rotated = abs(xf.b) == 1 && abs(xf.c) == 1
let dispW = rotated ? nat.height : nat.width, dispH = rotated ? nat.width : nat.height
let scale = min(1, maxSide / max(dispW, dispH))
func even(_ v: Double) -> Int { max(2, Int((v / 2).rounded()) * 2) }
// Encode in the track's *stored* orientation and keep the rotation as metadata.
let outW = even((rotated ? dispH : dispW) * scale), outH = even((rotated ? dispW : dispH) * scale)

let reader = try AVAssetReader(asset: asset)
// Always hand the encoder plain SDR BT.709 pixels. iPhone clips can be HDR (HLG, BT.2020, 10-bit); copying those tags onto an
// 8-bit H.264 file makes some desktop browsers (Chrome + hardware decoding) show a black picture with working sound.
let sdr709: [String: Any] = [
  AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
  AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
  AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
]
let vOut = AVAssetReaderTrackOutput(track: vTrack, outputSettings: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
  AVVideoColorPropertiesKey: sdr709,
])
reader.add(vOut)
let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
let vIn = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: outW, AVVideoHeightKey: outH,
  AVVideoColorPropertiesKey: sdr709,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: kbps * 1000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel, AVVideoMaxKeyFrameIntervalKey: 60],
])
vIn.transform = xf
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

func pump(_ input: AVAssetWriterInput, _ output: AVAssetReaderTrackOutput, _ q: String, _ g: DispatchGroup) {
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
