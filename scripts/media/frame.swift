import AVFoundation
import AppKit
let a = CommandLine.arguments
let url = URL(fileURLWithPath: a[1]); let out = a[2]; let t = Double(a[3]) ?? 1.0
let asset = AVURLAsset(url: url)
let dur = CMTimeGetSeconds(asset.duration)
let track = asset.tracks(withMediaType: .video).first
let sz = track?.naturalSize ?? .zero
print("\(url.lastPathComponent) dur=\(String(format:"%.1f",dur)) size=\(Int(sz.width))x\(Int(sz.height)) t=\(track?.preferredTransform.a ?? 0),\(track?.preferredTransform.b ?? 0)")
let g = AVAssetImageGenerator(asset: asset); g.appliesPreferredTrackTransform = true
g.maximumSize = CGSize(width: 1000, height: 1000)
let tt = CMTime(seconds: min(t, max(dur-0.1,0)), preferredTimescale: 600)
if let cg = try? g.copyCGImage(at: tt, actualTime: nil) {
  let rep = NSBitmapImageRep(cgImage: cg)
  try? rep.representation(using: .jpeg, properties: [.compressionFactor: 0.85])?.write(to: URL(fileURLWithPath: out))
}
