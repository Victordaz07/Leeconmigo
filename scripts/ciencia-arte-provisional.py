#!/usr/bin/env python3
"""Arte PROVISIONAL de la Tanda 2 (formas sencillas dibujadas con código) para poder probar una unidad antes de que lleguen
las imágenes de Victor. Usa los MISMOS nombres de archivo que el pedido (docs/design/ciencia/PEDIDO-IMAGENES.md), así que
`scripts/ciencia-arte.py` los sobrescribe cuando lleguen las reales.

Uso:  python3 scripts/ciencia-arte-provisional.py <lote>   (hoy: A)
Una unidad con arte provisional NO está lista para el niño: `UNIT_ART_READY` queda en false y solo se ve en un build de demo.
"""
import os, sys
from PIL import Image, ImageDraw

OUT = 'apps/mobile/assets/ciencia'
for d in ('bg', 'covers', 'props'):
    os.makedirs(f'{OUT}/{d}', exist_ok=True)

def canvas(size=1024):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)

def save_prop(im, name):
    im.resize((384, 384), Image.LANCZOS).save(f'{OUT}/props/{name}.webp', 'WEBP', quality=88, method=6)

def gradient(w, h, top, bottom):
    im = Image.new('RGB', (w, h))
    px = im.load()
    for y in range(h):
        t = y / (h - 1)
        c = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = c
    return im

def lote_a():
    # caja: cartón abierto por el frente con el interior liso beige medio
    im, d = canvas()
    d.rounded_rectangle((120, 160, 904, 860), 36, fill=(186, 138, 84), outline=(120, 84, 48), width=10)
    d.rounded_rectangle((200, 240, 824, 780), 20, fill=(214, 190, 150), outline=(150, 120, 80), width=8)
    save_prop(im, 'prop_caja_observacion')
    # linterna
    im, d = canvas()
    d.rounded_rectangle((250, 420, 700, 600), 40, fill=(244, 196, 48), outline=(150, 110, 20), width=10)
    d.rounded_rectangle((680, 380, 800, 640), 28, fill=(120, 130, 150), outline=(70, 80, 100), width=8)
    d.ellipse((740, 430, 830, 590), fill=(230, 240, 250))
    save_prop(im, 'prop_linterna')
    # osito
    im, d = canvas()
    brown, dark = (160, 106, 60), (96, 60, 30)
    for cx in (330, 694):
        d.ellipse((cx - 90, 160, cx + 90, 340), fill=brown, outline=dark, width=8)
    d.ellipse((512 - 190, 220, 512 + 190, 560), fill=brown, outline=dark, width=8)
    d.ellipse((512 - 230, 520, 512 + 230, 940), fill=brown, outline=dark, width=8)
    d.ellipse((440, 360, 584, 470), fill=(214, 170, 120), outline=dark, width=6)
    d.ellipse((410, 330, 450, 370), fill=dark)
    d.ellipse((574, 330, 614, 370), fill=dark)
    save_prop(im, 'prop_objeto_osito')
    # pelota de rayas
    im, d = canvas()
    d.ellipse((130, 130, 894, 894), fill=(255, 255, 255), outline=(150, 40, 40), width=10)
    for x0 in (250, 420, 590):
        d.rectangle((x0, 140, x0 + 90, 884), fill=(214, 60, 60))
    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).ellipse((130, 130, 894, 894), fill=255)
    im.putalpha(Image.composite(im.getchannel('A'), Image.new('L', im.size, 0), mask))
    save_prop(im, 'prop_objeto_pelota')
    # taza
    im, d = canvas()
    d.rounded_rectangle((230, 250, 700, 800), 60, fill=(70, 120, 190), outline=(30, 60, 110), width=10)
    d.ellipse((230, 220, 700, 330), fill=(40, 80, 150), outline=(30, 60, 110), width=8)
    d.arc((620, 380, 900, 660), -90, 90, fill=(30, 60, 110), width=60)
    save_prop(im, 'prop_objeto_taza')
    # portada y escena: cuarto al atardecer, forma de caja y linterna
    for name, folder in (('cover_c1_u02', 'covers'), ('scene_c1_u02', 'bg')):
        size = (1152, 768) if folder == 'covers' else (1536, 1024)
        bg = gradient(size[0], size[1], (70, 66, 110), (150, 120, 120)).convert('RGBA')
        d = ImageDraw.Draw(bg)
        w, h = size
        d.rectangle((0, int(h * 0.7), w, h), fill=(120, 86, 60))
        d.rounded_rectangle((int(w * 0.2), int(h * 0.42), int(w * 0.46), int(h * 0.74)), 20, fill=(186, 138, 84), outline=(120, 84, 48), width=6)
        d.rounded_rectangle((int(w * 0.23), int(h * 0.47), int(w * 0.43), int(h * 0.7)), 12, fill=(60, 52, 70))
        d.rounded_rectangle((int(w * 0.5), int(h * 0.62), int(w * 0.6), int(h * 0.68)), 14, fill=(244, 196, 48))
        d.rectangle((int(w * 0.62), int(h * 0.12), int(w * 0.9), int(h * 0.5)), fill=(240, 190, 120)) if folder == 'bg' else None
        rgb = bg.convert('RGB')
        if folder == 'covers':
            rgb.save(f'{OUT}/covers/{name}.webp', 'WEBP', quality=82, method=6)
        else:
            rgb.save(f'{OUT}/bg/{name}.webp', 'WEBP', quality=80, method=6)

LOTES = {'A': lote_a}
LOTES[sys.argv[1] if len(sys.argv) > 1 else 'A']()
print('arte provisional listo (reemplaza con las imágenes reales y scripts/ciencia-arte.py)')
