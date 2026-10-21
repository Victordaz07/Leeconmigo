#!/usr/bin/env python3
"""Convierte el arte del NÚCLEO de Kitewise (estrellas, sello, papalote, logros, Mi cuaderno; PNG de GPT) a los WebP de la app y escribe el manifiesto.

Uso:  python3 -I scripts/kitewise-imagenes.py <carpeta con los PNG extraídos> [lote]
Nombres de entrada: star_*, stamp_*, kite_*, badge_*, empty_* (objetos con fondo transparente) y mat_notebook_page (textura opaca).
Salida: apps/mobile/assets/kitewise/{stars,stamps,kites,badges,empty,mats}/*.webp  y  docs/design/kitewise/arte/manifest-<lote>.json
Los PNG originales NO se guardan en el repo: el manifiesto lleva su SHA-256. Las portadas de las unidades de Arte (`cover_*`) van por `scripts/arte-imagenes.py`.
Tamaños: estrellas 384 (se ven grandes en el cierre), logros 256, sello 256, papalote 512, vacíos 512, papel de cuaderno 1024. Una imagen dañada se omite y se avisa.
"""
import hashlib, json, os, sys
from PIL import Image

src = sys.argv[1]
lote = sys.argv[2] if len(sys.argv) > 2 else 'k8'
out = 'apps/mobile/assets/kitewise'
RULES = [  # prefijo, carpeta, lado, calidad, modo
    ('star_', 'stars', 384, 88, 'RGBA'),
    ('stamp_', 'stamps', 256, 88, 'RGBA'),
    ('kite_', 'kites', 512, 85, 'RGBA'),
    ('badge_', 'badges', 256, 88, 'RGBA'),
    ('empty_', 'empty', 512, 85, 'RGBA'),
    ('mat_notebook', 'mats', 1024, 85, 'RGB'),  # renglones finos: a 512 se verían borrosos al estirarlos
    ('mat_', 'mats', 512, 82, 'RGB'),
]
os.makedirs('docs/design/kitewise/arte', exist_ok=True)
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
    name = f[:-4]
    rule = next((r for r in RULES if name.startswith(r[0])), None)
    if rule is None:
        print('se ignora', f)
        continue
    _, folder, side, quality, mode = rule
    orig = f'{src}/{f}'
    try:
        im = Image.open(orig)
        im.load()
    except Exception as e:
        print(f'SE OMITE {f}: archivo dañado o cortado ({e}); hay que volver a generarla')
        continue
    im = im.convert(mode)
    if mode == 'RGBA':
        im = clean_alpha(im)
    im = im.resize((side, side), Image.LANCZOS)
    os.makedirs(f'{out}/{folder}', exist_ok=True)
    path = f'{out}/{folder}/{name}.webp'
    im.save(path, 'WEBP', quality=quality, method=6)
    manifest.append({'source': f, 'sha256': sha(orig), 'bytes': os.path.getsize(orig), 'output': path, 'outputBytes': os.path.getsize(path), 'width': im.width, 'height': im.height})
    print(f'{path}  {os.path.getsize(path) // 1024} KB')

json.dump(manifest, open(f'docs/design/kitewise/arte/manifest-{lote}.json', 'w'), indent=2, ensure_ascii=False)
print('total', sum(m['outputBytes'] for m in manifest) // 1024, 'KB en', len(manifest), 'imágenes')
