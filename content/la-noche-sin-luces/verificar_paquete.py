"""Local content validation; does not replace the application's npm checks.
Run: python3 content/la-noche-sin-luces/verificar_paquete.py
"""
from pathlib import Path
import json,re,struct,sys,unicodedata
ROOT=Path(__file__).resolve().parents[2]
CONTENT=Path(__file__).resolve().parent
B=json.loads((CONTENT/'presupuestos.json').read_text())
TEMPLATES=['book-1','four-up','slant-2','six-up','slant-3','book-2','burst-2',None,'manga-6','book-3','bolt-2','two-up','three-up','full']
COUNTS=[1,4,2,6,3,2,2,3,6,3,2,2,3,1]
QP=[2,5,6,8,10,12,14];QI=[0,2,1,1,0,2,1]
REF={'es':'Una luz, dos luces… ¿dónde están las luces?','en':'One light, two lights… where are the lights?'}
END={'es':'Una luz, dos luces… ¡aquí están las luces!','en':'One light, two lights… there are the lights!'}
REVIEW={'es':['luciérnaga','adivinanza','oscuridad'],'en':['adventure','courageous','illuminate']}
errors=[];notes=[];stats=[];budgets=[];skeletons=[]
def check(ok,where,description):
 if not ok:errors.append({'where':where,'issue':description})
files=sorted((ROOT/'packages/story-engine/stories').glob('*/la-noche-sin-luces-*.json'))
check(len(files)==6,'package','Expected exactly six variants')
for path in files:
 s=json.loads(path.read_text());sid=s['id'];lang=s['language'];level=s['level'];all_lines=[];sk=[];bidx=0
 check(set(s)=={'id','familyId','language','title','level','description','cover','heroFocus','reviewWords','pages','vocabulary'},sid,'Unexpected or missing root fields')
 check(sid==f'la-noche-sin-luces-{lang}-n{level}',sid,'Variant id')
 check(s['familyId']=='la-noche-sin-luces',sid,'Family id')
 check(len(s['title'])<=60 and len(s['description'])<=200,sid,'Title or description length')
 check(s['heroFocus']=={'x':25,'y':68},sid,'Cover focus')
 check(s['reviewWords']==REVIEW[lang],sid,'Review words')
 check(s['cover']['src']=='stories/la-noche-sin-luces/cover.webp',sid,'Final cover path')
 check(len(s['pages'])==14,sid,'Page count')
 for pi,p in enumerate(s['pages'],1):
  where=f'{sid}/{p["id"]}'
  expected={'id','illustration','blocks'}|({'template'} if pi!=8 else set())|({'checkpoint'} if pi in QP else set())
  check(set(p)==expected,where,'Page fields')
  check(p['id']==f'p{pi:02}' and p.get('template')==TEMPLATES[pi-1],where,'Page id or template')
  check(len(p['blocks'])==COUNTS[pi-1],where,'Block count')
  ill=p['illustration'];check(set(ill)=={'src','width','height','alt'},where,'Illustration fields')
  check(ill['src']==f'stories/la-noche-sin-luces/page-{pi:02}.webp',where,'Final illustration path')
  check((ill['width'],ill['height'])==(1536,1024) and bool(ill['alt']),where,'Size or alt text')
  for b in p['blocks']:
   bidx+=1;bw=f'{where}/{b["id"]}';lines=b['lines'];all_lines+=lines;chars=len(' '.join(lines))
   check(set(b)=={'id','title','voice','lines'},bw,'Block fields')
   check(b['id']==f'b{bidx:02}',bw,'Sequential block id')
   check(len(b['title'])<=28,bw,'Block title length')
   check(b['voice'] in ['narration','dialogue'],bw,'Voice')
   check(1<=len(lines)<=4,bw,'One to four lines')
   if bidx!=19 and pi!=8:check(({1:1,2:2,3:3}[level])<=len(lines)<=({1:2,2:3,3:4}[level]),bw,'Line count for reading level')
   for line in lines:
    check(0<len(line)<=(45 if level==1 else 120),bw,'Sentence length')
    check(all(any(c.isalpha() for c in token) for token in line.split()),bw,'Token without letters')
    check(not any(c.isdigit() for c in line),bw,'Written numbers only')
    check(line==unicodedata.normalize('NFC',line),bw,'Unicode NFC')
   if bidx==19:
    boom='¡Pum!' if lang=='es' else 'Boom!';check(lines==[' '.join([boom]*level)],bw,'Exact burst wording')
   if pi!=8:
    bb=B[b['id']];lo=bb['n3Min'] if level==3 else 0;hi=bb['n3Max'] if level==3 else bb[f'n{level}Max'];expected_exception=False
    if level==3 and bidx==1:
     cap=len(REF[lang])+3*120+3;expected_exception=(chars==cap)
     notes.append({'variant':sid,'block':'b01','type':'incompatible_minimum','requested_minimum':408,'maximum_possible':cap,'actual':chars,'reason':'Exact refrain plus at most three other lines of 120 characters and three joining spaces.'})
    check(lo<=chars<=hi or expected_exception,bw,'Character budget')
    budgets.append({'variant':sid,'page':p['id'],'block':b['id'],'characters':chars,'minimum':lo,'maximum':hi,'intentional_overload':level==3 and bidx in [10,13],'documented_exception':expected_exception})
   if bidx in [1,13,33]:check(REF[lang] in lines,bw,'Exact refrain')
   if bidx==40:check(END[lang] in lines,bw,'Exact final refrain')
  if pi==8:
   n=sum(len(b['lines']) for b in p['blocks']);want={1:3,2:4,3:6}[level];check(n==want,where,'Text-only sentence count')
   check(sum(b['lines'].count(REF[lang]) for b in p['blocks'])==1,where,'Refrain on text-only page')
   if level==1:notes.append({'variant':sid,'page':'p08','type':'incompatible_sentence_count','requested':2,'actual':3,'reason':'Three mandatory blocks must each contain at least one complete sentence.'})
  if pi in QP:
   q=p['checkpoint'];qi=QP.index(pi);check(q['id']==f'q{qi+1:02}',where,'Question id')
   check([v['audience'] for v in q['variants']]==['explorador','lector'],where,'Question audiences')
   for v in q['variants']:
    check(set(v)=={'audience','prompt','options','correctIndex','correctFeedback','retryFeedback'},where,'Question fields')
    check(len(v['options'])==(2 if pi==14 else 3),where,'Option count')
    check(v['correctIndex']==QI[qi],where,'Answer index')
    check(all(set(o)=={'text'} and o['text'] for o in v['options']),where,'Option structure')
    check(not re.search(r'\b(incorrecto|incorrect|wrong)\b',v['correctFeedback']+' '+v['retryFeedback'],re.I),where,'Warm feedback')
    if pi==6 and v['audience']=='lector':check(all(len(o['text'])>=60 for o in v['options']),where,'Long options at q03')
  sk.append((p['id'],p.get('template'),ill['src'],[b['id'] for b in p['blocks']],p.get('checkpoint',{}).get('id')))
 text=' '.join(all_lines);words=len(text.split());tokens=set(re.findall(r'[^\W\d_]+',text,re.UNICODE));normalized=text.lower().replace('’',"'")
 check(all_lines.count(REF[lang])==4 and all_lines.count(END[lang])==1,sid,'Four refrains and changed ending')
 check(bidx==40,sid,'Total blocks')
 low,high={1:(350,450),2:(700,950),3:(1150,1400)}[level];check(low<=words<=high,sid,'Total word count')
 if level==3:check(any(len(l)==120 for l in all_lines),sid,'Exact 120-character line')
 v=s['vocabulary'];check(len(v)>={1:12,2:20,3:30}[level],sid,'Vocabulary size');check(sum('synonym' in z for z in v.values())>=8,sid,'Vocabulary synonyms')
 check(any(len(z['syllables'])==1 for z in v.values()),sid,'One-syllable vocabulary entry')
 for k,z in v.items():
  check(k==k.lower() and k.isalpha() and k in tokens,sid+'/'+k,'Exact lowercase vocabulary occurrence')
  check(''.join(z['syllables'])==k and 1<=len(z['syllables'])<=8,sid+'/'+k,'Written syllables')
 for k in s['reviewWords']:check(k in v and len(v[k]['syllables'])>=3,sid,'Review syllable minimum')
 required=(['cigüeña','iluminadísimo','extraordinariamente','resplandeciente','niño','luciérnaga','adivinanza','oscuridad','parpadeó'] if lang=='es' else ['extraordinary','unbelievably','illuminated','adventure','courageous','illuminate',"don't","can't","it's","mila's","o'clock"])
 for word in required:check(word in normalized,sid,'Required word: '+word)
 check(all(re.search(r'\b'+w+r'\b',normalized) for w in (['y','a','o','e'] if lang=='es' else ['i','a'])),sid,'Single-letter words')
 if lang=='es':
  check(any(l.startswith(('É','Á','Í','Ó','Ú')) for l in all_lines),sid,'Accented initial capital')
 else:check("'" in text and '’' in text,sid,'Straight and curly apostrophes')
 stats.append({'id':sid,'words':words,'pages':14,'blocks':40,'questions':7,'vocabulary':len(v),'maxSentenceCharacters':max(map(len,all_lines))});skeletons.append(sk)
check(all(sk==skeletons[0] for sk in skeletons),'package','Shared structure across variants')
asset_dir=ROOT/'apps/reader/public/stories/la-noche-sin-luces'
images=[]
for name in [f'page-{n:02}.png' for n in range(1,15)]+['cover.png']:
 p=asset_dir/name
 check(p.is_file(),name,'PNG present')
 if p.exists():
  raw=p.read_bytes();size=struct.unpack('>II',raw[16:24]);check(size==(1536,1024),name,'PNG dimensions');images.append({'file':name,'width':size[0],'height':size[1]})
result={'status':'PASS_WITH_DOCUMENTED_SPEC_EXCEPTIONS' if not errors else 'FAIL','scope':'Local schema/content/dimensions checks. Not npm stories:check, stories:budget, app rendering or OCR.','errors':errors,'specExceptions':notes,'intentionalOverloadBlocks':['es-n3/b10','es-n3/b13','en-n3/b10','en-n3/b13'],'variants':stats,'images':images,'webpConversion':'PNG deliverables supplied; JSON paths use .webp as explicitly requested. Convert PNG to WebP before app validation.'}
(CONTENT/'VERIFICACION.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(CONTENT/'CONTEOS_POR_CUADRO.json').write_text(json.dumps(budgets,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':result['status'],'errors':errors,'variants':stats,'specExceptions':notes},ensure_ascii=False,indent=2))
sys.exit(bool(errors))
