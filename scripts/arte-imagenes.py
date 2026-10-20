#!/usr/bin/env python3
"""Convierte el arte de Arte y música recibido de Victor (PNG de GPT) a los WebP de la app y escribe el manifiesto.

Uso:  python3 -I scripts/arte-imagenes.py <carpeta con los PNG extraídos> [lote]
Nombres de entrada: cover_*.png, hero_*.png, bg_arte_*_(horizontal|vertical).png, snd_*.png, prop_*.png.
Salida: apps/mobile/assets/arte/{covers,bg,snd,props}/*.webp  y  docs/design/artes/arte/manifest-<lote>.json
Los PNG originales NO se guardan en el repo (pesan ~2 MB cada uno): el manifiesto lleva su SHA-256.
Objetos (snd_, prop_) conservan la transparencia y se reducen a 512×512 (se ven a menos de 100 px); portadas y fondos van sin alfa.
Una imagen dañada o cortada se omite y se avisa (hay que volver a generarla).
"""
import hashlib, json, os, sys
from PIL import Image

src = sys.argv[1]
lote = sys.argv[2] if len(sys.argv) > 2 else 'lote-a'
out = 'apps/mobile/assets/arte'
for d in ('covers', 'bg', 'snd', 'props'):
    os.makedirs(f'{out}/{d}', exist_ok=True)
os.makedirs('docs/design/artes/arte', exist_ok=True)
manifest = []

def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()

def clean_alpha(im):
    """El 'opaco' de GPT llega como alfa 253 y hay ruido casi invisible: se normaliza."""
    a = im.getchannel('A').point(lambda v: 255 if v >= 240 else (0 if v < 20 else v))
    im.putalpha(a)
    return im

for f in sorted(os.listdir(src)):
    if not f.endswith('.png'):
        continue
    orig = f'{src}/{f}'
    name = f[:-4]
    if name.startswith(('cover_', 'hero_')):
        folder, quality, mode = 'covers', 82, 'RGB'
    elif name.startswith('bg_'):
        folder, quality, mode = 'bg', 80, 'RGB'
    elif name.startswith('snd_'):
        folder, quality, mode = 'snd', 85, 'RGBA'
    elif name.startswith('prop_'):
        folder, quality, mode = 'props', 85, 'RGBA'
    else:
        print('se ignora', f)
        continue
    try:
        im = Image.open(orig)
        im.load()
    except Exception as e:
        print(f'SE OMITE {f}: archivo dañado o cortado ({e}); hay que volver a generarla')
        continue
    im = im.convert(mode)
    if mode == 'RGBA':
        im = clean_alpha(im).resize((512, 512), Image.LANCZOS)
    path = f'{out}/{folder}/{name}.webp'
    im.save(path, 'WEBP', quality=quality, method=6)
    manifest.append({'source': f, 'sha256': sha(orig), 'bytes': os.path.getsize(orig), 'output': path, 'outputBytes': os.path.getsize(path), 'width': im.width, 'height': im.height})
    print(f'{path}  {os.path.getsize(path) // 1024} KB')

json.dump(manifest, open(f'docs/design/artes/arte/manifest-{lote}.json', 'w'), indent=2, ensure_ascii=False)
print('total', sum(m['outputBytes'] for m in manifest) // 1024, 'KB en', len(manifest), 'imágenes')
