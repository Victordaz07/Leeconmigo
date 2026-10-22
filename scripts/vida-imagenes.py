#!/usr/bin/env python3
"""Convierte el arte de «Para la vida» 02–08 recibido de Victor (PNG de GPT) a los WebP de la app y escribe el manifiesto.

Uso:  python3 -I scripts/vida-imagenes.py <carpeta con los PNG extraídos> [nombre-del-lote]
Nombres de entrada: banner_*.png, cover_<modulo>_cuaderno.png, bg_<modulo>_horizontal.png, scene_<modulo>_<n>.png, guide_<guia>_neutral.png.
Salida: apps/mobile/assets/vida/{banner,covers,bg,scenes,guides}/*.webp  y  docs/design/vida/arte/manifest-<lote>.json
Los PNG originales NO se guardan en el repo (pesan ~1 MB cada uno): el manifiesto lleva su SHA-256.
Las guías conservan la transparencia y se reducen a 512×512; portadas, fondos y escenas van sin alfa (1536×1024 → WebP). Una imagen dañada se omite y se avisa.
"""
import hashlib, json, os, sys
from PIL import Image

src = sys.argv[1]
lote = sys.argv[2] if len(sys.argv) > 2 else 'vida-1'
out = 'apps/mobile/assets/vida'
for d in ('banner', 'covers', 'bg', 'scenes', 'guides'):
    os.makedirs(f'{out}/{d}', exist_ok=True)
os.makedirs('docs/design/vida/arte', exist_ok=True)
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
    if name.startswith('banner_'):
        folder, quality, mode = 'banner', 80, 'RGB'
    elif name.startswith('cover_'):
        folder, quality, mode = 'covers', 82, 'RGB'
    elif name.startswith('bg_'):
        folder, quality, mode = 'bg', 80, 'RGB'
    elif name.startswith('scene_'):
        folder, quality, mode = 'scenes', 80, 'RGB'
    elif name.startswith('guide_'):
        folder, quality, mode = 'guides', 85, 'RGBA'
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
    dest = f'{out}/{folder}/{name}.webp'
    im.save(dest, 'WEBP', quality=quality, method=6)
    manifest.append({'source': f, 'sha256': sha(orig), 'bytes': os.path.getsize(orig), 'output': dest, 'outputBytes': os.path.getsize(dest), 'width': im.size[0], 'height': im.size[1]})
    print(f'{f} -> {dest} ({os.path.getsize(dest) // 1024} KB)')

with open(f'docs/design/vida/arte/manifest-{lote}.json', 'w') as fh:
    json.dump(manifest, fh, indent=2, ensure_ascii=False)
print(len(manifest), 'imágenes convertidas')
