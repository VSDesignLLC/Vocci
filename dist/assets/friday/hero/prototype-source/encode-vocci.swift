import Foundation
import AVFoundation
import AppKit
let out=URL(fileURLWithPath:CommandLine.arguments[1])
try? FileManager.default.removeItem(at:out)
let writer=try AVAssetWriter(outputURL:out,fileType:.mp4)
let input=AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:900,AVVideoHeightKey:760,AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:2000000]])
let adaptor=AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:input,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32ARGB,kCVPixelBufferWidthKey as String:900,kCVPixelBufferHeightKey as String:760,kCVPixelBufferCGImageCompatibilityKey as String:true,kCVPixelBufferCGBitmapContextCompatibilityKey as String:true])
writer.add(input);writer.startWriting();writer.startSession(atSourceTime:.zero)
for n in 0..<300 {
 while !input.isReadyForMoreMediaData {Thread.sleep(forTimeInterval:0.002)}
 let url=URL(fileURLWithPath:String(format:"/tmp/vocci-proto-frames/%03d.png",n))
 let data=try Data(contentsOf:url);let source=CGImageSourceCreateWithData(data as CFData,nil)!;let img=CGImageSourceCreateImageAtIndex(source,0,nil)!
 var buf:CVPixelBuffer?;CVPixelBufferPoolCreatePixelBuffer(nil,adaptor.pixelBufferPool!,&buf)
 CVPixelBufferLockBaseAddress(buf!,[])
 let ctx=CGContext(data:CVPixelBufferGetBaseAddress(buf!),width:900,height:760,bitsPerComponent:8,bytesPerRow:CVPixelBufferGetBytesPerRow(buf!),space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.noneSkipFirst.rawValue)!
 ctx.draw(img,in:CGRect(x:0,y:0,width:900,height:760));CVPixelBufferUnlockBaseAddress(buf!,[])
 adaptor.append(buf!,withPresentationTime:CMTime(value:Int64(n),timescale:30))
}
input.markAsFinished();let sem=DispatchSemaphore(value:0);writer.finishWriting{sem.signal()};sem.wait()
print(writer.status.rawValue,writer.error?.localizedDescription ?? "encoded")
