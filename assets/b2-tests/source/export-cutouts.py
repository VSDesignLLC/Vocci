"""Re-export original screenshot pixels through the reviewed Bezier contours.
Run: uv run --with pillow python assets/b2-tests/source/export-cutouts.py
"""
from pathlib import Path
import json,re
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parents[1]
def points(path):
    tokens=re.findall(r'[MCZ]|-?\d+(?:\.\d+)?',path);out=[];i=0;current=(0,0)
    while i<len(tokens):
        cmd=tokens[i];i+=1
        if cmd=='M':current=(float(tokens[i]),float(tokens[i+1]));i+=2;out.append(current)
        elif cmd=='C':
            v=list(map(float,tokens[i:i+6]));i+=6;p0=current;p1=v[:2];p2=v[2:4];p3=v[4:]
            for n in range(1,161):
                t=n/160;u=1-t;out.append(tuple(u*u*u*p0[j]+3*u*u*t*p1[j]+3*u*t*t*p2[j]+t*t*t*p3[j] for j in range(2)))
            current=p3
        elif cmd=='Z':break
    return out
for name,spec in json.loads((root/'source/cutout-paths.json').read_text()).items():
    original=Image.open(root/f'source/ring-{name}.png').convert('RGBA');scale=4
    mask=Image.new('L',(original.width*scale,original.height*scale),0);draw=ImageDraw.Draw(mask)
    for key,fill in [('outer',255),('hole',0)]:draw.polygon([(x*scale,y*scale) for x,y in points(spec[key])],fill=fill)
    original.putalpha(mask.resize(original.size,Image.Resampling.LANCZOS))
    x,y,w,h=spec['crop'];original.crop((x,y,x+w,y+h)).save(root/f'ring-{name}.png')
    print(name,'RGBA cutout saved')
