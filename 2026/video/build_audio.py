from pathlib import Path
import json,urllib.request,subprocess,wave,re,math
import numpy as np
from scipy.signal import lfilter
R=Path(__file__).parent
scenes=json.loads((R/'scenes.json').read_text())
voices={'Narrator':('bm_george',1.08),'Ghost':('af_nicole',.98),'Medium':('bf_emma',1.04),'Echo':('af_sky',.92)}
sr=24000; cursor=0; chunks=[]; timeline=[]; rng=np.random.default_rng(2026)
for si,s in enumerate(scenes):
 start=cursor; chunks.append(np.zeros(int(sr*1.1)));cursor+=1.1
 for li,(who,line) in enumerate(s['lines']):
  p=R/'audio'/f'{si:02d}-{li:02d}.wav'
  if not p.exists():
   voice,speed=voices[who]
   req=urllib.request.Request('http://127.0.0.1:8880/v1/audio/speech',data=json.dumps(dict(model='kokoro',input=line,voice=voice,speed=speed,response_format='wav')).encode(),headers={'Content-Type':'application/json'})
   with urllib.request.urlopen(req,timeout=180) as res:p.write_bytes(res.read())
  raw=subprocess.check_output(['/usr/bin/ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','1','-ar',str(sr),'-'])
  a=np.frombuffer(raw,dtype=np.float32).copy()
  if who in ('Ghost','Echo'):
   dry=a.copy()
   for delay,gain in [(0.12,.11),(.27,.07),(.43,.035)]:
    k=int(delay*sr)
    if len(a)>k:a[k:]+=dry[:-k]*gain
  peak=np.max(np.abs(a));a*=.62/max(peak,.01)
  timeline.append(dict(scene=si,speaker=who,text=line,start=cursor,end=cursor+len(a)/sr))
  chunks.append(a);cursor+=len(a)/sr
  gap=.55 if who=='Ghost' else .32
  chunks.append(np.zeros(int(sr*gap)));cursor+=gap
 s['start']=start;s['end']=cursor+1.35;chunks.append(np.zeros(int(sr*1.35)));cursor+=1.35
 print(f'scene {si+1}: {cursor:.1f}s total',flush=True)
voice=np.concatenate(chunks); t=np.arange(len(voice))/sr
# Local wind, room resonance, glass-like partials. Quiet under intelligible speech.
noise=rng.standard_normal(len(t)).astype(np.float32)
wind=lfilter([.002],[1,-.998],noise)*.04
amb=wind+.009*np.sin(2*np.pi*73.4*t)+.004*np.sin(2*np.pi*110.1*t+.4*np.sin(t*.3))
amb+=.003*np.sin(2*np.pi*587.3*t)*(.5+.5*np.sin(t*.19))
for s in scenes:
 onset=s['start']+.15;k=int(onset*sr);n=min(int(3*sr),len(amb)-k);u=np.arange(n)/sr
 amb[k:k+n]+=.025*np.sin(2*np.pi*1174.6*u)*np.exp(-u*1.9)
# Hearth's three-one-four knock rhythm, after title but before the first voice.
for dt in [.05,.18,.31,.53,.74,.84,.94,1.04]:
 k=int((scenes[3]['start']+dt)*sr);n=int(.09*sr);u=np.arange(n)/sr
 amb[k:k+n]+=.055*np.sin(2*np.pi*170*u)*np.exp(-u*55)
env=np.minimum(1,t/2)*np.minimum(1,(len(t)/sr-t)/3)
mix=(voice+amb)*env
# Stereo room; speech stays central. Avoid any sudden loud effects.
stereo=np.stack([mix,voice*env+np.roll(amb,240)*env],axis=1)
stereo=np.clip(stereo,-.95,.95)
with wave.open(str(R/'audio'/'mix.wav'),'wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((stereo*32767).astype('<i2').tobytes())
(R/'timeline.json').write_text(json.dumps(dict(duration=len(t)/sr,scenes=scenes,lines=timeline),ensure_ascii=False,indent=2))
print('DONE',len(t)/sr,flush=True)
