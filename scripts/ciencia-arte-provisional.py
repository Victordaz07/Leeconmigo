#!/usr/bin/env python3
"""Arte PROVISIONAL de la Tanda 2 (formas sencillas dibujadas con código) para poder probar una unidad antes de que lleguen
las imágenes de Victor. Usa los MISMOS nombres de archivo que el pedido (docs/design/ciencia/PEDIDO-IMAGENES.md), así que
`scripts/ciencia-arte.py` los sobrescribe cuando lleguen las reales.

Uso:  python3 scripts/ciencia-arte-provisional.py <lote>   (A, B, F, H, I)
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

def square_piece(name, base, accent, pattern):
    im, d = canvas()
    d.rounded_rectangle((170, 170, 854, 854), 18, fill=base, outline=accent, width=10)
    if pattern == 'grid':
        for i in range(230, 840, 70):
            d.line((i, 180, i, 844), fill=accent, width=3)
            d.line((180, i, 844, i), fill=accent, width=3)
    elif pattern == 'weave':
        for i in range(200, 840, 36):
            d.line((i, 180, i, 844), fill=accent, width=6)
            d.line((180, i, 844, i), fill=accent, width=6)
    elif pattern == 'ridges':
        for i in range(210, 840, 56):
            d.line((180, i, 844, i), fill=accent, width=10)
    elif pattern == 'shine':
        d.polygon([(220, 700), (520, 200), (600, 200), (300, 700)], fill=(255, 255, 255, 150))
    save_prop(im, name)

def lote_b():
    square_piece('prop_papel_absorbente', (252, 252, 248, 255), (200, 200, 190, 255), 'grid')
    square_piece('prop_tela', (120, 170, 220, 255), (70, 110, 170, 255), 'weave')
    square_piece('prop_plastico', (205, 232, 245, 200), (120, 170, 200, 255), 'shine')
    square_piece('prop_carton', (196, 152, 98, 255), (140, 100, 58, 255), 'ridges')
    # muñeco de madera
    im, d = canvas()
    wood, dark = (214, 170, 110), (120, 80, 40)
    d.ellipse((372, 100, 652, 380), fill=wood, outline=dark, width=10)
    d.rounded_rectangle((332, 380, 692, 800), 60, fill=(196, 150, 96), outline=dark, width=10)
    d.rectangle((372, 780, 480, 940), fill=wood, outline=dark, width=8)
    d.rectangle((544, 780, 652, 940), fill=wood, outline=dark, width=8)
    d.ellipse((440, 210, 480, 250), fill=dark)
    d.ellipse((544, 210, 584, 250), fill=dark)
    d.arc((440, 250, 584, 340), 20, 160, fill=dark, width=8)
    save_prop(im, 'prop_muneco')
    # bandeja con agua
    im, d = canvas()
    d.rounded_rectangle((100, 360, 924, 760), 40, fill=(190, 196, 206), outline=(110, 116, 130), width=10)
    d.rounded_rectangle((160, 420, 864, 700), 30, fill=(150, 200, 235), outline=(100, 150, 190), width=6)
    d.rectangle((420, 330, 604, 380), fill=(190, 196, 206), outline=(110, 116, 130), width=8)
    save_prop(im, 'prop_bandeja_agua')
    # vaso con agua
    im, d = canvas()
    d.polygon([(300, 180), (724, 180), (670, 880), (354, 880)], fill=(225, 240, 250, 160), outline=(120, 150, 180, 255))
    d.polygon([(318, 480), (706, 480), (670, 880), (354, 880)], fill=(130, 190, 235, 230))
    save_prop(im, 'prop_vaso_agua')
    for name, folder in (('cover_c2_u02', 'covers'), ('scene_c2_u02', 'bg')):
        size = (1152, 768) if folder == 'covers' else (1536, 1024)
        bg = gradient(size[0], size[1], (150, 160, 170), (110, 120, 112)).convert('RGBA')
        d = ImageDraw.Draw(bg)
        w, h = size
        d.rectangle((0, int(h * 0.72), w, h), fill=(130, 98, 66))
        d.ellipse((int(w * 0.3), int(h * 0.46), int(w * 0.4), int(h * 0.74)), fill=(214, 170, 110), outline=(120, 80, 40), width=5)
        d.polygon([(int(w * 0.24), int(h * 0.42)), (int(w * 0.46), int(h * 0.34)), (int(w * 0.46), int(h * 0.4)), (int(w * 0.24), int(h * 0.48))], fill=(252, 252, 248))
        for i in range(30):
            x = int(w * (0.05 + 0.03 * i)); d.line((x, 30, x - 20, 120), fill=(190, 210, 230), width=3)
        bg.convert('RGB').save(f'{OUT}/{folder}/{name}.webp', 'WEBP', quality=80, method=6)

def lote_i():
    # rampa de madera inclinada con un tope arriba; sin marcas
    im, d = canvas()
    wood, dark = (214, 170, 110), (120, 80, 40)
    d.polygon([(110, 760), (910, 760), (910, 640), (210, 300)], fill=wood, outline=dark)
    d.line([(110, 760), (910, 760), (910, 640), (210, 300), (110, 760)], fill=dark, width=10)
    d.rectangle((150, 270, 240, 330), fill=(196, 150, 96), outline=dark, width=8)
    save_prop(im, 'prop_rampa')
    # bloque de madera
    im, d = canvas()
    d.rounded_rectangle((200, 330, 824, 760), 24, fill=(222, 184, 128), outline=dark, width=10)
    for y in (420, 520, 620):
        d.line((230, y, 794, y + 10), fill=(186, 146, 92), width=5)
    save_prop(im, 'prop_bloque_madera')
    for name, folder in (('cover_c4_u02', 'covers'), ('scene_c4_u02', 'bg')):
        size = (1152, 768) if folder == 'covers' else (1536, 1024)
        bg = gradient(size[0], size[1], (214, 226, 232), (196, 170, 130)).convert('RGBA')
        d = ImageDraw.Draw(bg)
        w, h = size
        d.rectangle((0, int(h * 0.68), w, h), fill=(176, 134, 90))
        if folder == 'covers':
            d.polygon([(int(w * 0.12), int(h * 0.7)), (int(w * 0.62), int(h * 0.7)), (int(w * 0.62), int(h * 0.62)), (int(w * 0.18), int(h * 0.3))], fill=(214, 170, 110), outline=(120, 80, 40))
            d.ellipse((int(w * 0.3), int(h * 0.36), int(w * 0.38), int(h * 0.46)), fill=(214, 60, 60), outline=(150, 40, 40), width=4)
            d.rounded_rectangle((int(w * 0.68), int(h * 0.56), int(w * 0.8), int(h * 0.7)), 10, fill=(222, 184, 128), outline=(120, 80, 40), width=4)
        else:
            d.rectangle((int(w * 0.62), int(h * 0.1), int(w * 0.9), int(h * 0.5)), fill=(240, 236, 220))
        bg.convert('RGB').save(f'{OUT}/{folder}/{name}.webp', 'WEBP', quality=80, method=6)

def lote_h():
    # carrito rojo de cuatro ruedas, vacío
    im, d = canvas()
    d.rounded_rectangle((150, 380, 874, 640), 36, fill=(214, 70, 60), outline=(120, 30, 30), width=10)
    d.rectangle((150, 380, 874, 440), fill=(190, 56, 48), outline=(120, 30, 30), width=8)
    for cx in (290, 734):
        d.ellipse((cx - 90, 580, cx + 90, 760), fill=(50, 56, 70), outline=(20, 24, 34), width=8)
        d.ellipse((cx - 30, 640, cx + 30, 700), fill=(180, 186, 196))
    save_prop(im, 'prop_carrito')
    # péndulo: bola azul colgada de un hilo (sin barra: la app la dibuja)
    im, d = canvas()
    d.line((512, 40, 512, 640), fill=(90, 80, 70), width=8)
    d.ellipse((372, 600, 652, 880), fill=(70, 120, 190), outline=(30, 60, 110), width=10)
    d.ellipse((430, 650, 500, 720), fill=(150, 190, 235))
    save_prop(im, 'prop_pendulo')
    for name, folder in (('cover_c3_u05', 'covers'), ('scene_c3_u05', 'bg')):
        size = (1152, 768) if folder == 'covers' else (1536, 1024)
        bg = gradient(size[0], size[1], (170, 210, 235), (200, 215, 190)).convert('RGBA')
        d = ImageDraw.Draw(bg)
        w, h = size
        d.rectangle((0, int(h * 0.66), w, h), fill=(196, 196, 190))
        if folder == 'covers':
            d.rounded_rectangle((int(w * 0.34), int(h * 0.5), int(w * 0.62), int(h * 0.66)), 18, fill=(214, 70, 60), outline=(120, 30, 30), width=5)
            for cx in (0.4, 0.56):
                d.ellipse((int(w * cx) - 30, int(h * 0.62), int(w * cx) + 30, int(h * 0.7)), fill=(50, 56, 70))
            d.ellipse((int(w * 0.18), int(h * 0.58), int(w * 0.26), int(h * 0.68)), fill=(240, 190, 60), outline=(150, 110, 20), width=4)
        else:
            d.rectangle((int(w * 0.1), int(h * 0.3), int(w * 0.14), int(h * 0.66)), fill=(150, 110, 70))
            d.rectangle((int(w * 0.3), int(h * 0.3), int(w * 0.34), int(h * 0.66)), fill=(150, 110, 70))
            d.rectangle((int(w * 0.08), int(h * 0.28), int(w * 0.36), int(h * 0.31)), fill=(150, 110, 70))
            d.rectangle((int(w * 0.2), int(h * 0.31), int(w * 0.22), int(h * 0.5)), fill=(90, 80, 70))
            d.rectangle((int(w * 0.17), int(h * 0.5), int(w * 0.25), int(h * 0.52)), fill=(150, 110, 70))
        bg.convert('RGB').save(f'{OUT}/{folder}/{name}.webp', 'WEBP', quality=80, method=6)

def marco(name, panel):
    im, d = canvas()
    sage, dark = (150, 190, 150), (80, 110, 80)
    d.rounded_rectangle((200, 120, 824, 800), 30, fill=sage, outline=dark, width=10)
    d.rounded_rectangle((270, 190, 754, 730), 12, fill=panel, outline=dark, width=6)
    d.rectangle((420, 800, 604, 880), fill=(120, 150, 120), outline=dark, width=8)
    save_prop(im, name)

def lote_f():
    marco('prop_marco_transparente', (225, 240, 250, 90))
    marco('prop_marco_calco', (246, 246, 240, 225))
    marco('prop_marco_cartulina', (236, 140, 60, 255))
    marco('prop_marco_aluminio', (200, 206, 214, 255))
    for name, folder in (('cover_c1_u03', 'covers'), ('scene_c1_u03', 'bg')):
        size = (1152, 768) if folder == 'covers' else (1536, 1024)
        bg = gradient(size[0], size[1], (232, 226, 210), (190, 170, 140)).convert('RGBA')
        d = ImageDraw.Draw(bg)
        w, h = size
        d.rectangle((0, int(h * 0.7), w, h), fill=(150, 112, 80))
        d.rounded_rectangle((int(w * 0.14), int(h * 0.56), int(w * 0.3), int(h * 0.64)), 14, fill=(244, 196, 48), outline=(150, 110, 20), width=4)
        d.rounded_rectangle((int(w * 0.44), int(h * 0.3), int(w * 0.56), int(h * 0.68)), 14, fill=(150, 190, 150), outline=(80, 110, 80), width=4)
        d.rectangle((int(w * 0.46), int(h * 0.34), int(w * 0.54), int(h * 0.62)), fill=(225, 240, 250))
        if folder == 'bg':
            d.rectangle((int(w * 0.64), int(h * 0.1), int(w * 0.92), int(h * 0.5)), fill=(244, 240, 228))
        bg.convert('RGB').save(f'{OUT}/{folder}/{name}.webp', 'WEBP', quality=80, method=6)

LOTES = {'A': lote_a, 'B': lote_b, 'F': lote_f, 'H': lote_h, 'I': lote_i}
LOTES[sys.argv[1] if len(sys.argv) > 1 else 'A']()
print('arte provisional listo (reemplaza con las imágenes reales y scripts/ciencia-arte.py)')
