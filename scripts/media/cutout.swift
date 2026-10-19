import Vision
import AppKit
import CoreImage
let a = CommandLine.arguments
let inURL = URL(fileURLWithPath: a[1]); let outDir = a[2]
let handler = VNImageRequestHandler(url: inURL)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let res = req.results?.first else { print("no result"); exit(1) }
print("instances:", res.allInstances.map{$0})
let ctx = CIContext()
func save(_ idx: IndexSet, _ name: String) throws {
  let buf = try res.generateMaskedImage(ofInstances: idx, from: handler, croppedToInstancesExtent: true)
  let ci = CIImage(cvPixelBuffer: buf)
  let cs = CGColorSpace(name: CGColorSpace.sRGB)!
  try ctx.writePNGRepresentation(of: ci, to: URL(fileURLWithPath: "\(outDir)/\(name).png"), format: .RGBA8, colorSpace: cs)
}
for i in res.allInstances { try save(IndexSet(integer: i), "inst\(i)") }
try save(res.allInstances, "all")
