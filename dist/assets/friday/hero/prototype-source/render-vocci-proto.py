from PIL import Image,ImageDraw,ImageFont
import math
from pathlib import Path
font='/System/Library/Fonts/Supplemental/Arial.ttf'; bold='/System/Library/Fonts/Supplemental/Arial Bold.ttf';mono='/System/Library/Fonts/Menlo.ttc'
def f(n,b=False):return ImageFont.truetype(bold if b else font,n)
orange='#F57546';dark='#242924'; gray='#667067'
for frame in range(300):
 t=frame/30; im=Image.new('RGB',(900,760),'#F3F4F1');d=ImageDraw.Draw(im)
 d.text((64,46),'VOCCI',font=f(25,True),fill=dark); d.text((660,50),'VOICE → AI',font=ImageFont.truetype(mono,16),fill=gray)
 d.line((64,98,836,98),fill='#DDE1D9',width=1)
 phase=0 if t<3 else 1 if t<6 else 2
 for j,txt in enumerate(['CAPTURE','TRANSCRIBE','ACT']):
  x=64+j*266;d.text((x,131),f'0{j+1}  /  {txt}',font=ImageFont.truetype(mono,17),fill=orange if phase==j else gray)
  d.rectangle((x,166,x+222,168),fill=orange if phase==j else '#DDE1D9')
 if phase==0:
  d.text((64,225),'Your voice. Captured.',font=f(44,True),fill=dark)
  d.text((64,291),'A small gesture starts the recording.',font=f(25),fill=gray)
  for j in range(58):
   h=12+94*abs(math.sin(j*.48))* (.3+.7*abs(math.sin(t*5-j*.24)))
   x=64+j*13;d.rounded_rectangle((x,425-h,x+5,425+h),radius=2,fill=orange)
  d.ellipse((64,588,76,600),fill=orange);d.text((90,580),f'Recording   00:0{int(t)+1}',font=ImageFont.truetype(mono,20),fill=gray)
 elif phase==1:
  d.text((64,225),'Words, made clear.',font=f(44,True),fill=dark)
  lines=['“Let’s send the revised','proposal to Maya','by Friday.”'];count=int(min(1,(t-3)/2.25)*sum(map(len,lines)))
  for j,line in enumerate(lines):
   piece=line[:max(0,count)];count-=len(line);d.text((64,330+j*58),piece,font=f(40),fill=dark)
  d.text((64,586),'02 / TRANSCRIPT',font=ImageFont.truetype(mono,19),fill=gray)
 else:
  d.text((64,225),'A clear next step.',font=f(44,True),fill=dark)
  d.text((64,313),'03 / AI ACTION ITEM',font=ImageFont.truetype(mono,19),fill=gray)
  d.text((64,372),'Send the revised',font=f(45,True),fill=dark);d.text((64,426),'proposal',font=f(45,True),fill=dark)
  for x,txt in [(64,'To Maya'),(256,'By Friday')]:
   d.rounded_rectangle((x,511,x+167,558),radius=6,fill='#FBE6DD',outline='#F5754670');d.text((x+20,521),txt,font=f(23),fill=dark)
  d.text((64,595),'Ready for your review',font=f(22),fill=gray)
 d.line((64,689,836,689),fill='#DBDFD7',width=3); d.line((64,689,64+772*t/10,689),fill=orange,width=3)
 d.text((64,712),'ILLUSTRATIVE PROTOTYPE',font=ImageFont.truetype(mono,14),fill=gray)
 im.save(f'/tmp/vocci-proto-frames/{frame:03}.png')
 if frame==240:im.save('/Users/jia/Desktop/Vocci/vocci-option-b-workspace/option-b/assets/friday/hero/prototype-poster.png')
