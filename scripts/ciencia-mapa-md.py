#!/usr/bin/env python3
"""Regenera docs/design/ciencia/MAPA-UNIDADES.md desde packages/science-content/content/mapa.json."""
import json
d = json.load(open('packages/science-content/content/mapa.json'))
AREA = {'vida': 'Vida', 'materia': 'Materia y energía', 'tierra': 'Tierra y espacio', 'ingenieria': 'Ingeniería'}
GR = {1: 'Descubro y comparo', 2: 'Pruebo y clasifico', 3: 'Encuentro patrones y explico', 4: 'Conecto estructuras y procesos', 5: 'Explico sistemas y lo que no veo', 6: 'Investigo mecanismos y evalúo modelos'}
out = ["""# Mapa de las 48 unidades de Ciencia

> **GENERADO** desde `packages/science-content/content/mapa.json` (la fuente de verdad, con pruebas). No se edita a mano:
> se cambia el JSON y se regenera (`python3 scripts/ciencia-mapa-md.py`). Diseño original de Kitewise sobre California NGSS,
> **BORRADOR sin validar por un docente**; citar un código no acredita cumplimiento (hace falta una tarea que exija la
> práctica). ⭐ = unidad de la primera tanda (piloto). Ingeniería de banda por grado: ver el JSON (`engineeringBands`).
"""]
for g in range(1, 7):
    out.append(f"\n## {g}.º · {GR[g]}\n")
    out.append("| ID | Área | Unidad / pregunta (ES) | Unit / question (EN) | Expectativas | Laboratorios | |")
    out.append("|---|---|---|---|---|---|---|")
    for u in [x for x in d['units'] if x['grade'] == g]:
        out.append(f"| {u['id']} | {AREA[u['area']]} | **{u['title']['es']}** — {u['question']['es']} | **{u['title']['en']}** — {u['question']['en']} | {', '.join(u['standards'])} | {', '.join(u['labs']) or '—'} | {'⭐' if u['pilot'] else ''} |")
    cs = [(u['id'], u['caution']) for u in d['units'] if u['grade'] == g and u.get('caution')]
    if cs:
        out.append("\n**Cuidado al escribir:**")
        for i, c in cs:
            out.append(f"- **{i}:** {c}")
open('docs/design/ciencia/MAPA-UNIDADES.md', 'w').write("\n".join(out) + "\n")

# ---- Estándares de las unidades piloto (lista de validación para un docente; archivo propio de Ciencia)
rows = ["""# Estándares de Ciencia — lista de validación (unidades piloto)

> **GENERADO** por `scripts/ciencia-mapa-md.py` desde `mapa.json`. **BORRADOR: ningún docente ha validado esto.** Es la
> parte de Ciencia de `docs/design/kitewise/STANDARDS-REVIEW.md` (se mantiene aparte para que dos cuentas no editen el
> mismo archivo). No presentar a las familias como «alineado» hasta que cada fila esté en «Validado».
> Fuente normativa: California NGSS (CDE). 6.º: modelo integrado preferido de California (banda 6–8).

| Unidad | Grado | Pregunta | Códigos candidatos | Confianza | Estado | Revisor / fecha |
|---|---|---|---|---|---|---|"""]
for u in [x for x in d['units'] if x['pilot']]:
    rows.append(f"| {u['id']} {u['title']['es']} | {u['grade']}.º | {u['question']['es']} | {', '.join(u['standards'])} | {'Alta (código conocido)' if u['grade'] <= 5 else 'Media (selección del modelo integrado)'} | Por validar | |")
rows.append("""
## Antes de publicar, el docente debe confirmar (por cada unidad)
1. Que cada código y su redacción corresponden al grado.
2. Que **hay una tarea donde el niño realiza la práctica que el código exige** (no solo el tema).
3. Vocabulario, ejemplos y profundidad apropiados para el grado, en español **y** en inglés.
4. Que las respuestas y explicaciones son correctas y aceptan alternativas válidas.
5. Que el informe para padres cita el código correcto. El código se ve solo en la vista de padres, y mientras la unidad
   esté «Por validar» se marca «borrador» en lugar de mostrarlo.
""")
open('docs/design/ciencia/ESTANDARES.md', 'w').write("\n".join(rows) + "\n")
