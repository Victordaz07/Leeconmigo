"""Verifica este paquete contra las reglas publicadas en GUIA-DE-CONTENIDO.md.

No reemplaza npm run stories:check del repositorio de la aplicación.
Ejecutar con Python 3; Pillow es opcional para comprobar las imágenes.
"""
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
try:
    from PIL import Image
except ImportError:
    Image = None

errors = []
metrics = []
families = {}
seen_ids = set()

def check(condition, context, message):
    if not condition:
        errors.append(f'{context}: {message}')

def count_words(text):
    return len(re.findall(r"[^\W\d_]+(?:[’'][^\W\d_]+)*", text, re.UNICODE))

def image_check(obj, context, page=False):
    check(set(obj) == {'src','width','height','alt'}, context, 'campos de imagen no válidos')
    path=ROOT/'apps/reader/public'/obj['src']
    check(path.is_file(), context, 'no existe la imagen')
    check(bool(obj['alt'].strip()),context,'falta alt')
    if Image and path.is_file():
        with Image.open(path) as im:
            check(im.size == (obj['width'],obj['height']),context,'dimensiones declaradas distintas de las reales')
            if page:
                check(im.size == (1536,1024),context,'la página debe medir 1536×1024')
            else:
                check(im.width*2 == im.height*3,context,'la portada debe ser 3:2')

def run():
    files=sorted((ROOT/'packages/story-engine/stories').glob('*/*.json'))
    check(len(files)==6,'paquete','se esperan seis variantes')
    for file in files:
        d=json.loads(file.read_text())
        ctx=file.name
        root_required={'id','familyId','language','title','level','reviewWords','pages','vocabulary'}
        root_allowed=root_required|{'description','cover','heroFocus','dev'}
        check(root_required<=set(d)<=root_allowed,ctx,'campos raíz no válidos')
        check(d['id']==file.stem,ctx,'el nombre debe coincidir con id')
        check(d['id'] not in seen_ids,ctx,'id repetido')
        seen_ids.add(d['id'])
        check(re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',d['familyId']) is not None,ctx,'familyId no válido')
        check(d['id']==f"{d['familyId']}-{d['language']}-n{d['level']}",ctx,'id de variante no válido')
        check(d['language']==file.parent.name and d['language'] in ('es','en'),ctx,'idioma o carpeta no válido')
        check(type(d['level']) is int and d['level']>=1,ctx,'nivel no válido')
        check('cover' in d,ctx,'falta portada')
        if 'cover' in d:image_check(d['cover'],ctx+'/cover')
        if 'heroFocus' in d:
            check(set(d['heroFocus'])=={'x','y'} and all(0<=x<=100 for x in d['heroFocus'].values()),ctx,'heroFocus no válido')
        check(len(d['pages'])==5,ctx,'se esperan cinco páginas')
        pids,bids,qids=set(),set(),set()
        skeleton=[]
        nwords=0
        max_chars=0
        max_rows=0
        all_reading=[]
        for pi,p in enumerate(d['pages'],1):
            pc=ctx+'/'+p['id']
            check(set(p)=={'id','illustration','template','blocks','checkpoint'},pc,'campos de página no válidos')
            check(p['id']==f'p{pi:02}' and p['id'] not in pids,pc,'id de página no válido')
            pids.add(p['id'])
            template=p['template']
            expected={'three-up':3,'two-up':2,'full':1}.get(template)
            check(expected is not None and len(p['blocks'])==expected,pc,'plantilla y número de cuadros incompatibles')
            image_check(p['illustration'],pc+'/illustration',page=True)
            check(p['illustration']['src']==f"stories/{d['familyId']}/page-{pi:02}.png",pc,'ruta inesperada')
            for bi,b in enumerate(p['blocks']):
                bc=pc+'/'+b['id']
                check(set(b)=={'id','title','voice','lines'},bc,'campos de cuadro no válidos o layout presente')
                check(b['id'] not in bids and b['id']==f'b{len(bids)+1:02}',bc,'id de cuadro no válido')
                bids.add(b['id'])
                check(0<len(b['title'])<=28,bc,'título debe tener como máximo 28 caracteres')
                check(b['voice'] in ('narration','dialogue'),bc,'voice no válido')
                check(1<=len(b['lines'])<=4,bc,'debe contener entre una y cuatro frases')
                width=170 if template=='full' or (template=='three-up' and bi==2) else 80
                row_limit=4 if template=='full' or (template=='three-up' and bi<2) else 3 if template=='three-up' else 5
                rows=sum(math.ceil(len(line)/width) for line in b['lines'])
                check(rows<=row_limit,bc,'supera el presupuesto orientativo del globo')
                max_rows=max(max_rows,rows)
                for line in b['lines']:
                    check(0<len(line)<=120,bc,'frase supera 120 caracteres o está vacía')
                    check(line.rstrip().endswith(('.', '!', '?', '”')),bc,'frase sin cierre')
                    check(not any(c.isdigit() for c in line),bc,'número escrito con cifras')
                    check(all(any(c.isalpha() for c in token) for token in line.split()),bc,'token sin letras')
                    max_chars=max(max_chars,len(line))
                    nwords+=count_words(line)
                    all_reading.append(line)
            q=p['checkpoint']
            check(set(q)=={'id','variants'},pc,'campos de pregunta no válidos')
            check(q['id']==f'q{pi:02}' and q['id'] not in qids,pc,'id de pregunta no válido')
            qids.add(q['id'])
            check([v['audience'] for v in q['variants']]==['explorador','lector'],pc,'faltan variantes de pregunta')
            for v in q['variants']:
                qc=pc+'/'+v['audience']
                check(set(v)=={'audience','prompt','options','correctIndex','correctFeedback','retryFeedback'},qc,'campos de variante no válidos')
                check(len(v['options'])==3 and all(set(o)=={'text'} and bool(o['text']) for o in v['options']),qc,'debe haber tres opciones de texto')
                check(type(v['correctIndex']) is int and 0<=v['correctIndex']<3,qc,'correctIndex no válido')
                check('incorrecto' not in (v['correctFeedback']+' '+v['retryFeedback']).lower(),qc,'feedback prohibido')
                check(bool(v['retryFeedback'].strip()),qc,'falta pista')
            skeleton.append((p['id'],template,p['illustration']['src'],tuple(b['id'] for b in p['blocks']),q['id']))
        range_words={1:(80,150),2:(150,250),3:(300,500)}.get(d['level'])
        check(range_words and range_words[0]<=nwords<=range_words[1],ctx,'extensión fuera del rango')
        vocab=d['vocabulary']
        check(6<=len(vocab)<=15,ctx,'vocabulario fuera de seis a quince entradas')
        read_tokens={x.lower() for x in re.findall(r'[^\W\d_]+',' '.join(all_reading),re.UNICODE)}
        for key,v in vocab.items():
            vc=ctx+'/vocabulary/'+key
            check(key==key.lower() and all(c.isalpha() for c in key),vc,'clave no válida')
            check({'syllables','definition'}<=set(v)<={'syllables','definition','synonym'},vc,'campos no válidos')
            check(''.join(v['syllables'])==key,vc,'sílabas no reconstruyen la clave')
            check(key in read_tokens,vc,'la palabra no aparece en la lectura')
            check(bool(v['definition'].strip()),vc,'falta definición')
        check(len(d['reviewWords'])==3 and len(set(d['reviewWords']))==3,ctx,'deben ser tres palabras de repaso distintas')
        for key in d['reviewWords']:
            check(key in vocab and len(vocab[key]['syllables'])>=2,ctx+'/reviewWords','palabra ausente o monosílaba')
        family_key=(tuple(skeleton),d['cover']['src'])
        if d['familyId'] in families:check(families[d['familyId']]==family_key,ctx,'esqueleto de familia distinto')
        else:families[d['familyId']]=family_key
        metrics.append({'id':d['id'],'words':nwords,'max_line_characters':max_chars,'max_estimated_bubble_rows':max_rows,'pages':len(pids),'blocks':len(bids),'checkpoints':len(qids),'vocabulary':len(vocab)})
    report={'status':'passed' if not errors else 'failed','scope':'Reglas documentadas del paquete; no es npm run stories:check.','image_dimensions_checked':Image is not None,'variants':metrics,'errors':errors}
    out=Path(__file__).with_name('VERIFICACION.json')
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if not errors else 1

if __name__=='__main__':
    sys.exit(run())
