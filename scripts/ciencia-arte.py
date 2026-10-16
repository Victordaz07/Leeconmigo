#!/usr/bin/env python3
"""Convierte el arte de Ciencia recibido de Victor (PNG de GPT) a los WebP de la app y escribe el manifiesto.

Uso:  python3 -I scripts/ciencia-arte.py <carpeta con los PNG extraídos> [tanda]
Nombres de entrada: bg_ciencia_*.png en landscape/ y portrait/, scene_*.png, cover_*.png, prop_*.png, char_maya_*.png.
Salida: apps/mobile/assets/ciencia/{bg,covers,props,chars}/*.webp  y  docs/design/ciencia/arte/manifest-<tanda>.json
Los PNG originales NO se guardan en el repo (pesan ~30 MB): el manifiesto lleva su SHA-256.
"""
import hashlib, json, os, sys
from PIL import Image

src = sys.argv[1]
tanda = sys.argv[2] if len(sys.argv) > 2 else 'tanda-1'
out = 'apps/mobile/assets/ciencia'
for d in ('bg', 'covers', 'props', 'chars'):
    os.makedirs(f'{out}/{d}', exist_ok=True)
os.makedirs('docs/design/ciencia/arte', exist_ok=True)
manifest = []

def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()

def clean_alpha(im):
    """El 'opaco' de GPT llega como alfa 253 y hay ruido casi invisible: se normaliza."""
    a = im.getchannel('A').point(lambda v: 255 if v >= 240 else (0 if v < 20 else v))
    im.putalpha(a)
    return im

def save(im, rel, quality, **kw):
    path = f'{out}/{rel}'
    im.save(path, 'WEBP', quality=quality, method=6, **kw)
    return path

def record(orig, path, im):
    manifest.append({'source': os.path.relpath(orig, src), 'sha256': sha(orig), 'bytes': os.path.getsize(orig), 'output': path, 'outputBytes': os.path.getsize(path), 'width': im.width, 'height': im.height})

for orient in ('landscape', 'portrait'):
    d = f'{src}/{orient}'
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png'):
            continue
        orig = f'{d}/{f}'
        im = Image.open(orig).convert('RGB')
        path = save(im, f'bg/{f[:-4]}_{"horizontal" if orient == "landscape" else "vertical"}.webp', 80)
        record(orig, path, im)

for f in sorted(os.listdir(src)):
    if not f.endswith('.png'):
        continue
    orig = f'{src}/{f}'
    im = Image.open(orig)
    if f.startswith('scene_'):
        im = im.convert('RGB')
        path = save(im, f'bg/{f[:-4]}.webp', 80)
    elif f.startswith('cover_'):
        im = im.convert('RGB').resize((1152, 768), Image.LANCZOS)
        path = save(im, f'covers/{f[:-4]}.webp', 82)
    elif f.startswith('prop_'):
        im = clean_alpha(im.convert('RGBA'))
        box = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
        im = im.crop(box)
        side = max(im.size)
        sq = Image.new('RGBA', (side, side), (0, 0, 0, 0))
        sq.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
        im = sq.resize((384, 384), Image.LANCZOS)
        path = save(im, f'props/{f[:-4]}.webp', 88)
    elif f.startswith('char_'):
        im = clean_alpha(im.convert('RGBA'))
        box = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).getbbox()
        im = im.crop(box)
        h = 576
        im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
        path = save(im, f'chars/{f[:-4]}.webp', 88)
    else:
        continue
    record(orig, path, im)

json.dump({'project': 'Kitewise', 'subject': 'ciencia', 'batch': tanda, 'count': len(manifest), 'format': 'PNG original de GPT, sin recortar; se convierte a WebP (props y poses recortados a su silueta)', 'assets': manifest}, open(f'docs/design/ciencia/arte/manifest-{tanda}.json', 'w'), ensure_ascii=False, indent=1)
print(len(manifest), 'imágenes;', sum(m['outputBytes'] for m in manifest) // 1024, 'KB en total')
for m in manifest:
    print(f"{m['output'].replace(out + '/', ''):44s} {m['width']}x{m['height']:<5} {m['outputBytes']//1024:>4} KB")
