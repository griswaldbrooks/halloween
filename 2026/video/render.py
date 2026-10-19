from pathlib import Path
import json,math,random,subprocess,textwrap
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
R=Path(__file__).parent;W,H=1280,720;FPS=12
T=json.loads((R/'timeline.json').read_text())
SER='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf';SAN='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
fonts={k:ImageFont.truetype(SER if k in (48,36,28) else SAN,k) for k in [16,18,20,22,24,28,30,32,36,48]}
INK='#e5d6b4';GOLD='#bb945a';TEAL='#8ba6a1';DARK='#151311'
def txt(d,xy,t,size=24,fill=INK,anchor=None):d.text(xy,t,font=fonts[size],fill=fill,anchor=anchor)
def line(d,pts,c=GOLD,w=2):d.line(pts,fill=c,width=w)
def star(d,cx,cy,r,col=INK):
 pts=[(cx+math.cos(-math.pi/2+i*math.pi/5)*(r if i%2==0 else r*.43),cy+math.sin(-math.pi/2+i*math.pi/5)*(r if i%2==0 else r*.43)) for i in range(10)];d.polygon(pts,fill=col)
def person(d,x,y,scale=1,blind=False,col='#151a1a'):
 r=22*scale;d.ellipse((x-r,y-r,x+r,y+r),fill=col,outline='#6e6757',width=2)
 d.polygon([(x-r*.8,y+r),(x-r*2.1,y+130*scale),(x+r*2.1,y+130*scale),(x+r*.8,y+r)],fill=col,outline='#6e6757')
 if blind:d.rectangle((x-r,y-3*scale,x+r,y+6*scale),fill='#d6c6a5')
def candle(d,x,y):
 d.ellipse((x-22,y+43,x+22,y+52),fill='#9e7c48');d.rectangle((x-6,y,x+6,y+46),fill='#c9b994');d.ellipse((x-4,y-22,x+4,y-2),fill='#ffe1a0')
def frame(d,box):d.rectangle(box,outline=GOLD,width=2)
def card(d,x,y,w=110,h=148,label='',symbol=None):
 d.rounded_rectangle((x,y,x+w,y+h),radius=8,fill='#d5c49f',outline='#f5e5bd',width=3)
 d.rectangle((x+8,y+8,x+w-8,y+h-8),outline='#6b563b',width=1)
 if symbol=='eye':
  d.ellipse((x+24,y+45,x+w-24,y+77),outline='#3b3730',width=3);d.ellipse((x+w/2-9,y+50,x+w/2+9,y+72),fill='#3b3730');line(d,[(x+20,y+82),(x+w-20,y+40)],'#3b3730',4)
 elif symbol=='star':star(d,x+w/2,y+64,26,'#3b3730')
 elif symbol:txt(d,(x+w/2,y+66),symbol,36,'#3b3730','mm')
 if label:txt(d,(x+w/2,y+h-28),label,16,'#3b3730','mm')
def background(si):
 yy,xx=np.mgrid[0:H,0:W];v=np.maximum(0,1-np.sqrt(((xx-640)/900)**2+((yy-310)/600)**2))
 a=np.zeros((H,W,3),dtype=np.uint8)
 for c,base in enumerate([17,19,19]):a[:,:,c]=base+v*[29,21,12][c]
 im=Image.fromarray(a);d=ImageDraw.Draw(im)
 # Wall paneling and floor perspective; drawn scenery, not a room plan.
 for x in range(70,1280,142):
  d.rectangle((x,120,x+126,447),outline='#4a4032',width=2);d.rectangle((x+8,129,x+118,437),outline='#292823')
 line(d,[(0,450),(1280,450)],'#756044',3)
 for x in range(-500,2000,125):line(d,[(640+(x-640)*.55,450),(x,550)],'#3f3528')
 # Moonlit colonial sash window, drapery.
 d.rectangle((75,148,265,386),fill='#15282c',outline='#887957',width=5)
 d.ellipse((176,171,224,219),fill='#bbbca4')
 for x in [138,202]:line(d,[(x,150),(x,385)],'#9b8b68',5)
 for y in [228,307]:line(d,[(77,y),(263,y)],'#9b8b68',5)
 d.polygon([(50,125),(93,125),(95,360),(50,397)],fill='#25282b');d.polygon([(253,125),(288,125),(294,390),(248,341)],fill='#25282b')
 # Warm empty chairs and table.
 for x in [420,570,720,870]:
  d.rounded_rectangle((x-29,277,x+29,391),radius=20,fill='#221c18',outline='#71563a',width=3)
  line(d,[(x-24,355),(x-38,490)],'#71563a',5);line(d,[(x+24,355),(x+38,490)],'#71563a',5)
 d.ellipse((294,337,1005,463),fill='#503b28',outline='#ac8450',width=3)
 d.polygon([(325,404),(975,404),(952,449),(347,449)],fill='#443226')
 # Table runners and wood grain.
 d.polygon([(560,341),(684,341),(739,454),(542,454)],fill='#5e5143')
 random.seed(400+si)
 for _ in range(25):
  x=random.randint(350,900);y=random.randint(370,432);line(d,[(x,y),(x+random.randint(12,65),y+1)],'#674b30',1)
 candle(d,355,309);candle(d,940,309)
 # Hearth on right.
 d.rectangle((1050,218,1230,453),fill='#322e27',outline='#645741',width=2)
 d.rectangle((1073,287,1207,453),fill='#101616');d.rectangle((1027,260,1250,280),fill='#847051')
 for y in [240,300,333,366,400,434]:line(d,[(1053,y),(1072,y)],'#79674e');line(d,[(1208,y),(1227,y)],'#79674e')
 return im

def art(si):
 s=T['scenes'][si];im=background(si);d=ImageDraw.Draw(im);typ=s['art']
 if typ=='parlor':
  for i,x in enumerate([423,565,716,861]):person(d,x,405,.65);txt(d,(x,516),['ADA','BEN','CORA','DAX'][i],16)
  txt(d,(650,218),'THE INHERITANCE',28,INK,'mm');txt(d,(650,255),'Four living witnesses',20,GOLD,'mm')
  for i in range(4):d.ellipse((599+i*31,379,617+i*31,397),fill='#c9a665')
 elif typ=='cards':
  for i,(lab,sym) in enumerate([('ADA','eye'),('BEN','o'),('CORA','+'),('DAX','star')]):card(d,350+i*151,192,label=lab,symbol=sym)
  txt(d,(640,397),'ONE VEILED CARD. AN HONEST SHUFFLE.',20,INK,'mm')
  txt(d,(640,441),'5 symbols  ×  5 correct guesses  =  1 in 3,125',20,GOLD,'mm')
 elif typ=='letter':
  d.polygon([(348,157),(904,173),(923,441),(361,429)],fill='#c4b08a',outline='#ebd4a5')
  for y in range(199,401,23):
   for x in range(388,850,26):line(d,[(x,y),(x+random.randint(10,22),y-2)],'#776248',1)
  d.rectangle((424,240,862,319),fill='#3d3930',outline='#dfc998',width=3)
  for i,c in enumerate('BELL'):
   d.rectangle((446+i*102,251,513+i*102,307),fill='#dbc79e');txt(d,(478+i*102,279),c,36,'#342d24','mm')
  txt(d,(648,380),'Smoke took her sight.',28,'#453525','mm')
 elif typ=='hearth':
  d.rectangle((350,173,930,444),fill='#3d3b32',outline='#897657',width=4)
  d.rectangle((421,251,859,440),fill='#0e191b');d.rectangle((323,225,957,250),fill='#9a815b')
  for i,v in enumerate(['3','1','4']):txt(d,(486+i*155,328),v,48,TEAL,'mm')
  txt(d,(640,398),'A voice in the cold hearth',24,INK,'mm')
  d.ellipse((546,447,734,479),fill='#99784d');d.rectangle((547,461,733,505),fill='#745735');d.ellipse((546,488,734,519),outline=GOLD,width=3)
  for x in range(556,726,26):line(d,[(x,460),(x+15,501)],'#c6ad7c',2)
 elif typ=='touch':
  d.polygon([(376,253),(823,234),(920,337),(434,372)],fill='#785b3c',outline=GOLD)
  d.polygon([(434,372),(920,337),(912,456),(433,493)],fill='#382c23',outline=GOLD)
  d.polygon([(376,253),(434,372),(433,493),(377,378)],fill='#4c3828',outline=GOLD)
  d.ellipse((465,275,825,353),fill='#121d1f',outline='#a78c61',width=4)
  star(d,575,317,31);d.ellipse((638,298,678,338),fill='#b6b5a5');d.rectangle((731,297,763,330),fill='#b4b6a9')
  # A stylized reaching hand emerges from the dark, with no gore.
  d.polygon([(680,366),(682,330),(668,303),(674,296),(691,316),(693,281),(702,279),(706,312),(714,281),(723,284),(720,317),(734,293),(742,297),(731,331),(724,365)],fill='#bdc7b6',outline='#e8e2ca')
 elif typ=='tiles':
  for i,word in enumerate(['OPEN','THE','HOUSE','AGAIN']):
   x=340+i*155;d.rounded_rectangle((x,235,x+134,374),radius=8,fill='#baa582',outline='#e2cc9d',width=3)
   for j in range(i+1):d.ellipse((x+18+j*26,258,x+28+j*26,268),fill='#4c4436')
   txt(d,(x+67,327),word,20,'#302e29','mm')
  txt(d,(640,440),'Sight. Hearing. Voice. Hands.',28,INK,'mm')
 elif typ in ('register','chest','family'):
  if typ=='chest':
   d.polygon([(345,307),(909,307),(954,485),(372,493)],fill='#36291f',outline=GOLD)
   d.polygon([(345,307),(370,185),(923,181),(909,307)],fill='#584129',outline=GOLD)
   for x in [406,834]:line(d,[(x,189),(x-17,304)],'#bfa060',11)
  d.polygon([(439,223),(640,238),(640,472),(430,450)],fill='#cfbf9b',outline='#8e7654')
  d.polygon([(640,238),(841,223),(850,450),(640,472)],fill='#c3b18b',outline='#8e7654')
  txt(d,(537,265),'THE FAMILY',18,'#55462f','mm');txt(d,(744,265),'REGISTER',18,'#55462f','mm')
  for i,(name,x,y) in enumerate([('ADA',528,320),('BEN',742,320),('CORA',528,397),('DAX',742,397)]):
   txt(d,(x,y),name,24,'#372f25','mm');txt(d,(x,y+28),'HERS' if typ!='register' or name in ['BEN','DAX'] else '—',18,'#7d342b','mm')
  if typ=='family':
   for i,x in enumerate([350,540,730,920]):
    person(d,x,385,.88,blind=i==0,col='#172324')
   txt(d,(640,205),'“The rest of you are mine.”',28,INK,'mm')
 # Film header/footer with stable text, independent from moving atmosphere.
 d.rectangle((0,0,W,104),fill=DARK);line(d,[(40,103),(1240,103)],'#705739')
 txt(d,(44,20),s['label'],18,GOLD);txt(d,(42,48),s['title'],36)
 txt(d,(1238,32),'HALLOWEEN 2026',16,GOLD,'ra')
 txt(d,(1238,64),'AN ILLUSTRATED PROPOSAL',16,TEAL,'ra')
 d.rectangle((0,530,W,H),fill=DARK);line(d,[(40,530),(1240,530)],'#705739')
 txt(d,(40,674),'SCENE OUTCOME',16,TEAL)
 txt(d,(40,696),s['state'],16,GOLD)
 txt(d,(1238,696),'STORYBOARD 06 · ENDING A UNDECIDED',16,TEAL,'ra')
 return im

bases=[art(i).convert('RGB') for i in range(len(T['scenes']))]
for i,b in enumerate(bases):b.save(R/'assets'/f'scene-{i+1:02}.png')
# Build fog sprites once: animated horizontally at different speeds.
fog=Image.new('RGBA',(1700,420));fd=ImageDraw.Draw(fog)
random.seed(26)
for _ in range(24):
 x=random.randrange(1700);y=random.randrange(60,330);r=random.randrange(45,150)
 fd.ellipse((x-r,y-r*.3,x+r,y+r*.3),fill=(158,190,185,random.randrange(3,15)))
fog=fog.filter(ImageFilter.GaussianBlur(24))
# Captions split into <=2 readable lines, time allocated proportionally to words.
cap=[]
for u in T['lines']:
 words=u['text'].split();groups=[];cur=[]
 for word in words:
  trial=' '.join(cur+[word])
  if len(trial)>100 and cur:groups.append(' '.join(cur));cur=[word]
  else:cur.append(word)
 if cur:groups.append(' '.join(cur))
 pos=u['start'];total=sum(len(g.split()) for g in groups)
 for g in groups:
  end=pos+(u['end']-u['start'])*len(g.split())/total
  cap.append(dict(start=pos,end=end,text=g,speaker=u['speaker']));pos=end
(R/'captions.json').write_text(json.dumps(cap,ensure_ascii=False,indent=2))
def stamp(sec):
 ms=round(sec*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000);return f'{h:02}:{m:02}:{s:02}.{ms:03}'
(R/'captions.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(c["start"])} --> {stamp(c["end"])}\n{c["speaker"]}: {c["text"]}' for c in cap))
if __import__('sys').argv[-1]=='--stills':raise SystemExit
cmd=['/usr/bin/ffmpeg','-hide_banner','-loglevel','warning','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-i',str(R/'audio'/'mix.wav'),'-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-ar','48000','-movflags','+faststart','-shortest',str(R/'walkthrough.mp4')]
p=subprocess.Popen(cmd,stdin=subprocess.PIPE);ci=0;si=0
for n in range(math.ceil(T['duration']*FPS)):
 t=n/FPS
 while si+1<len(T['scenes']) and t>=T['scenes'][si]['end']:si+=1
 while ci+1<len(cap) and t>=cap[ci]['end']:ci+=1
 im=bases[si].copy().convert('RGBA')
 # Continuous slow fog; no strobing. Keep it away from all text.
 shift=int((t*11)%400);im.alpha_composite(fog.crop((shift,0,shift+W,420)),(0,110))
 glow=Image.new('RGBA',(W,H));gd=ImageDraw.Draw(glow)
 for x in [355,940]:
  a=int(19+5*math.sin(t*3.1)+3*math.sin(t*7.2));gd.ellipse((x-40,250,x+40,353),fill=(255,178,62,a))
 glow=glow.filter(ImageFilter.GaussianBlur(19));im=Image.alpha_composite(im,glow)
 d=ImageDraw.Draw(im);c=cap[ci]
 if c['start']<=t<c['end']:
  col={'Narrator':TEAL,'Ghost':'#d7b682','Medium':'#e5d6b4','Echo':'#a8c2be'}[c['speaker']]
  txt(d,(44,548),c['speaker'].upper(),18,col)
  rows=textwrap.wrap(c['text'],width=70)
  for j,row in enumerate(rows):txt(d,(44,578+j*40),row,30,INK)
 # Playback position and subtle scene fades.
 d.rectangle((0,716,int(W*t/T['duration']),719),fill=GOLD)
 local=t-T['scenes'][si]['start'];remain=T['scenes'][si]['end']-t
 fade=min(1,local/.55,remain/.55)
 if fade<1:im=Image.blend(Image.new('RGBA',(W,H),DARK),im,max(0,fade))
 if n in [int(12*FPS),int((T['scenes'][4]['start']+10)*FPS),int((T['scenes'][8]['start']+10)*FPS)]:im.convert('RGB').save(R/'assets'/f'frame-{n}.jpg',quality=92)
 p.stdin.write(im.convert('RGB').tobytes())
 if n%(FPS*30)==0:print(f'render {t:.0f}/{T["duration"]:.0f}s',flush=True)
p.stdin.close();code=p.wait();assert code==0,code
print('VIDEO COMPLETE',flush=True)
