#!/usr/bin/env python3
"""Genera la ficha legible de una unidad de Ciencia a partir de su JSON (la fuente de verdad, con pruebas).

Uso:  python3 scripts/ciencia-unidad-md.py C1-U02     →  docs/design/ciencia/unidades/C1-U02.md
No se edita a mano: se cambia el JSON (packages/science-content/content/<id>.json), se corren las pruebas y se regenera.
"""
import json, sys

uid = sys.argv[1]
path = f'packages/science-content/content/{uid.lower()}.json'
u = json.load(open(path))
E = lambda t: t['es']
N = lambda t: t['en']
out = []
w = out.append
w(f"# {u['id']} · {E(u['title'])} / {N(u['title'])}")
w('')
w('> **GENERADO** desde `' + path + '` (fuente de verdad, con pruebas). No se edita a mano. Borrador **sin validar por un docente**; ')
w('> los códigos son candidatos y solo los ven los padres.')
w('')
w(f"- **Grado:** {u['grade']}.º · **Área:** {u['area']} · **Expectativas candidatas:** {', '.join(u['standards'])}")
w(f"- **Pregunta:** {E(u['question'])} / {N(u['question'])}")
w(f"- **Estado editorial:** {u['review']['status']}")
w('')
w('## Ideas (lo que el niño debe poder explicar)')
w('| id | Idea | Error frecuente | Casos |')
w('|---|---|---|---|')
for i in u['ideas']:
    w(f"| `{i['id']}` | {E(i['text'])} | {E(i['misconception'])} | {', '.join(i['contexts'])} |")
w('')
w('## Glosario')
for g in u['glossary']:
    w(f"- **{g['es']} / {g['en']}** — {E(g['note'])}")
w('')
w('## Sesiones')
for s in u['sessions']:
    w(f"### {s['id'].upper()} · {E(s['title'])} / {N(s['title'])}")
    w(f"_{E(s['objective'])}_")
    w('')
    for st in s['steps']:
        extra = []
        for k in ('scene', 'light', 'material', 'thermal', 'magnet', 'matter', 'ramp', 'forces', 'path', 'sort', 'cycle', 'particle', 'climate', 'earth', 'vibration', 'energy', 'lab', 'map', 'zones', 'choice', 'glossary'):
            if k in st:
                extra.append(k)
        t = f" · tarea **{st['taskId']}**" if 'taskId' in st else ''
        w(f"- `{st['id']}` ({st['phase']}, {st['kind']}{t}) {E(st['text'])} / _{N(st['text'])}_" + (f" — usa: {', '.join(extra)}" if extra else ''))
    w('')
w('## Tareas (banco de 8)')
for t in u['tasks']:
    w(f"### {t['id']} · {t['kind']} · idea(s): {', '.join(t['ideaIds']) or '—'} · caso: `{t['contextId']}` · sesión {t['sessionId']}")
    w(f"**Criterio:** {E(t['criterion'])}")
    w('')
    for p in t['parts']:
        w(f"- **{E(p['prompt'])}** (elige {p['min']}{', sin rigor: toda opción vale' if not p['strict'] else ''})")
        for o in p['options']:
            if o['valid']:
                w(f"  - ✅ {E(o['text'])}")
            else:
                w(f"  - ➖ {E(o['text'])} → _{E(o['whyNot'])}_")
    w(f"- Pistas: 1) {E(t['hints'][0])} 2) {E(t['hints'][1])} 3) {E(t['hints'][2])}")
    w('')
sf = u['safety']
w('## Ficha de seguridad (actividad fuera de pantalla, con un adulto)')
w(f"**{E(sf['title'])}** — la enciende el padre; revisión: {sf['review']}.")
for k, name in (('supervision', 'Supervisión'), ('materials', 'Materiales'), ('place', 'Lugar'), ('hygiene', 'Higiene'), ('closing', 'Cierre'), ('excluded', 'Se excluye'), ('data', 'Datos'), ('digitalAlternative', 'Alternativa digital')):
    w(f"- **{name}:** {E(sf[k])}")
w('- **Detenerse si:** ' + '; '.join(E(x) for x in sf['stopIf']))
open(f"docs/design/ciencia/unidades/{uid}.md", 'w').write('\n'.join(out) + '\n')
print('escrito', f"docs/design/ciencia/unidades/{uid}.md")
