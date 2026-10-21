#!/usr/bin/env python3
"""Convierte el arte de Arte y música recibido de Victor (PNG de GPT) a los WebP de la app y escribe el manifiesto.

Uso:  python3 -I scripts/arte-imagenes.py <carpeta con los PNG extraídos> [lote]
Nombres de entrada: cover_*.png, hero_*.png, bg_*.png, snd_*.png, prop_*.png y (Tanda 2) mat_*.png, cut_*.png, frame_*.png, folder_*.png.
Salida: apps/mobile/assets/arte/{covers,bg,snd,props,mats,cuts,museo}/*.webp  y  docs/design/artes/arte/manifest-<lote>.json
Tanda 2: `mat_*` son texturas que se repiten (opacas, 512×512); `cut_*` y `folder_*` objetos transparentes (512×512); `frame_*` marcos transparentes (1024×683) de los que se mide el HUECO interior (`hole`, en fracciones 0–1) para ajustar la obra sin estirar el marco.
Los PNG originales NO se guardan en el repo (pesan ~2 MB cada uno): el manifiesto lleva su SHA-256.
Objetos (snd_, prop_) conservan la transparencia y se reducen a 512×512 (se ven a menos de 100 px); portadas y fondos van sin alfa.
Una imagen dañada o cortada se omite y se avisa (hay que volver a generarla).
"""
import hashlib, json, os, sys
from PIL import Image

src = sys.argv[1]
lote = sys.argv[2] if len(sys.argv) > 2 else 'lote-a'
out = 'apps/mobile/assets/arte'
for d in ('covers', 'bg', 'snd', 'props', 'mats', 'cuts', 'museo'):
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

def frame_hole(im):
    """El hueco interior de un marco (la parte transparente rodeada por el marco), en fracciones 0–1 del ancho y del alto: [x, y, w, h]."""
    w, h = im.size
    a = im.getchannel('A')
    cx, cy = w // 2, h // 2
    if a.getpixel((cx, cy)) > 20:
        return None
    def edge(dx, dy):
        x, y = cx, cy
        while 0 < x < w - 1 and 0 < y < h - 1 and a.getpixel((x, y)) <= 20:
            x += dx
            y += dy
        return x, y
    left, right, top, bottom = edge(-1, 0)[0], edge(1, 0)[0], edge(0, -1)[1], edge(0, 1)[1]
    return [round(left / w, 4), round(top / h, 4), round((right - left) / w, 4), round((bottom - top) / h, 4)]

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
    elif name.startswith('mat_'):
        folder, quality, mode = 'mats', 80, 'RGB'
    elif name.startswith('cut_'):
        folder, quality, mode = 'cuts', 85, 'RGBA'
    elif name.startswith(('frame_', 'folder_')):
        folder, quality, mode = 'museo', 85, 'RGBA'
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
    extra = {}
    if name.startswith('mat_'):
        im = im.resize((512, 512), Image.LANCZOS)
    elif name.startswith('frame_'):
        im = clean_alpha(im)
        extra['hole'] = frame_hole(im)
        im = im.resize((1024, round(1024 * im.height / im.width)), Image.LANCZOS)
    elif mode == 'RGBA':
        im = clean_alpha(im).resize((512, 512), Image.LANCZOS)
    path = f'{out}/{folder}/{name}.webp'
    im.save(path, 'WEBP', quality=quality, method=6)
    manifest.append({'source': f, 'sha256': sha(orig), 'bytes': os.path.getsize(orig), 'output': path, 'outputBytes': os.path.getsize(path), 'width': im.width, 'height': im.height, **extra})
    print(f'{path}  {os.path.getsize(path) // 1024} KB')

json.dump(manifest, open(f'docs/design/artes/arte/manifest-{lote}.json', 'w'), indent=2, ensure_ascii=False)
print('total', sum(m['outputBytes'] for m in manifest) // 1024, 'KB en', len(manifest), 'imágenes')
