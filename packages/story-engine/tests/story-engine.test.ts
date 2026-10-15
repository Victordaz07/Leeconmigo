import { describe, expect, it } from 'vitest';
import type { Story } from '@lee-conmigo/contracts';
import { FakeReadingEngine, ManualScheduler, ReadingProgressTracker, normalizeText } from '@lee-conmigo/reading-engine';
import { InMemoryStoryRepository, PAGE_TEMPLATES, emptyLayoutFile, expandStory, normalizeLayoutFile, validateLayoutFile, TEMPLATE_NAMES, blocksBeforePage, expandPage, templateLayouts, buildRepository, devStory, lookupVocabulary, pageText, parseStory, pickVariants, pilotStory, reviewWords, reviewWordsFromKeys, toCatalogEntry, tokenizePage, validateStory } from '../src/index.ts';

const page = pilotStory.pages[0];

describe('historia piloto "La luna y la puerta azul"', () => {
  it('cumple el esquema y las reglas (arte/texto separados, feedback sin "Incorrecto", sílabas coherentes)', () => {
    expect(validateStory(pilotStory)).toEqual([]);
  });

  it('tiene 10 cuadros y 144 palabras (el doc 04 dice "~46": esa cifra es un error del doc)', () => {
    expect(page.blocks).toHaveLength(10);
    expect(tokenizePage(page)).toHaveLength(144);
  });

  it('cada palabra de pantalla queda alineada con las del comparador (mismos índices)', () => {
    const words = tokenizePage(page);
    expect(normalizeText(pageText(page))).toEqual(words.map((w) => w.normalized));
  });

  it('cada palabra recuerda su bloque y su línea (para resaltar en el globo correcto)', () => {
    const words = tokenizePage(page);
    expect(words[0]).toMatchObject({ text: 'El', blockIndex: 0, lineIndex: 0, blockId: 'b01', index: 0 });
    const puerta = words.find((w) => w.normalized === 'puerta')!;
    expect(puerta.blockIndex).toBe(4); // "La puerta azul"
  });

  it('vocabulario: sílabas, definición y sinónimo se buscan por la palabra tal como aparece', () => {
    expect(lookupVocabulary(pilotStory, 'Puerta,')?.syllables).toEqual(['puer', 'ta']);
    expect(lookupVocabulary(pilotStory, 'enorme.')?.synonym).toBe('gigante');
    expect(lookupVocabulary(pilotStory, 'zzz')).toBeUndefined();
  });

  it('repaso final: primero las palabras que costaron (con más de una sílaba), luego las base; sin repetidos, máx. 3', () => {
    const words = tokenizePage(page);
    const idx = (w: string) => words.findIndex((x) => x.normalized === w);
    expect(reviewWords(pilotStory, words, [idx('extrano'), idx('puerta')])).toEqual(['extraño', 'puerta', 'montañas']);
    expect(reviewWords(pilotStory, words, [])).toEqual(['montañas', 'descubrir', 'puerta']);
  });

  it('comprensión: dos variantes por audiencia, con pista y sin "Incorrecto"', () => {
    const cp = page.checkpoint!;
    expect(cp.variants.map((v) => v.audience)).toEqual(['explorador', 'lector']);
    expect(cp.variants.every((v) => v.correctIndex === 1)).toBe(true);
  });
});

describe('validateStory detecta contenido roto', () => {
  const clone = (): Story => JSON.parse(JSON.stringify(pilotStory));

  it('bloque sin texto, idioma no soportado, ilustración ausente', () => {
    const s = clone();
    s.language = 'fr' as never;
    s.pages[0].blocks[0].lines = [];
    s.pages[0].illustration.src = '';
    const p = validateStory(s).join('\n');
    expect(p).toMatch(/idioma no soportado/);
    expect(p).toMatch(/sin texto/);
    expect(p).toMatch(/sin ilustración/);
  });

  it('una "palabra" sin letras desalinearía el comparador', () => {
    const s = clone();
    s.pages[0].blocks[0].lines = ['El — conejo'];
    expect(validateStory(s).join('\n')).toMatch(/no tiene letras/);
  });

  it('sílabas que no reconstruyen la palabra y feedback "Incorrecto"', () => {
    const s = clone();
    s.vocabulary['puerta'].syllables = ['pue', 'rta', 'x'];
    s.pages[0].checkpoint!.variants[0].retryFeedback = 'Incorrecto';
    const p = validateStory(s).join('\n');
    expect(p).toMatch(/no reconstruyen/);
    expect(p).toMatch(/nunca debe decir "Incorrecto"/);
  });
});

describe('integración: historia piloto + FakeReadingEngine + comparador', () => {
  it('leer la página entera con la lectura automática la completa; el temporizador suma lectura real', () => {
    const sched = new ManualScheduler();
    const engine = new FakeReadingEngine({ scheduler: sched });
    const words = tokenizePage(page);
    engine.startSession(words);
    engine.simulate.correct();
    engine.simulate.autoRead(true);
    sched.advance(520 * 150);
    expect(engine.getState().status).toBe('complete');
    expect(engine.getState().wordCount).toBe(144);
    expect(engine.getTimerSnapshot().validSeconds).toBeGreaterThan(60);
  });

  it('el comparador sigue la posición en la historia real: una frase leída cae en el cuadro correcto', () => {
    const tracker = new ReadingProgressTracker(pageText(page));
    const words = tokenizePage(page);
    const m = tracker.match('Respiró hondo y tomó el pomo con cuidado');
    expect(m.score).toBeGreaterThan(0.9);
    expect(words[m.endIdx].blockId).toBe('b07'); // "Abre la puerta"
  });
});

describe('historia de prueba de tres páginas', () => {
  it('es válida y tiene 3 páginas, 8 cuadros, una página de solo texto y una pregunta por página', () => {
    expect(validateStory(devStory)).toEqual([]);
    expect(devStory.dev).toBe(true);
    expect(devStory.pages.map((p) => p.blocks.length)).toEqual([3, 3, 2]);
    expect(devStory.pages.map((p) => p.blocks.every((b) => b.layout))).toEqual([true, false, true]); // p02 = texto
    expect(devStory.pages.every((p) => p.checkpoint?.variants.length === 2)).toBe(true);
  });

  it('cada página se tokeniza aparte y sus índices arrancan en 0 (el motor carga una página a la vez)', () => {
    for (const pg of devStory.pages) {
      const words = tokenizePage(pg);
      expect(words[0].index).toBe(0);
      expect(normalizeText(pageText(pg))).toEqual(words.map((w) => w.normalized));
      expect(new Set(words.map((w) => w.id)).size).toBe(words.length);
    }
  });
});

describe('catálogo y repositorio', () => {
  it('la ficha se deriva de la historia: páginas, cuadros y palabras', () => {
    expect(toCatalogEntry(pilotStory)).toMatchObject({ id: 'la-luna-y-la-puerta-azul', pageCount: 1, blockCount: 10, wordCount: 144, level: 1 });
    const dev = toCatalogEntry(devStory);
    expect(dev).toMatchObject({ pageCount: 3, blockCount: 8, dev: true });
    expect(dev.wordCount).toBe(devStory.pages.reduce((n, p) => n + tokenizePage(p).length, 0));
  });

  it('blocksBeforePage cuenta los cuadros de las páginas anteriores', () => {
    expect([0, 1, 2, 3, 9].map((i) => blocksBeforePage(devStory, i))).toEqual([0, 3, 6, 8, 8]);
    expect(blocksBeforePage(devStory, -1)).toBe(0);
  });

  it('InMemoryStoryRepository lista en orden de registro y busca por id', () => {
    const repo = new InMemoryStoryRepository([pilotStory, devStory]);
    expect(repo.list().map((e) => e.id)).toEqual(['la-luna-y-la-puerta-azul', 'dev-tres-paginas']);
    expect(repo.get('dev-tres-paginas')?.pages).toHaveLength(3);
    expect(repo.get('no-existe')).toBeUndefined();
  });

  it('buildRepository NO carga historias inválidas y las reporta', () => {
    const broken = JSON.parse(JSON.stringify(devStory));
    broken.id = 'rota';
    broken.pages[0].blocks[0].lines = [];
    const reported: Array<[string, string[]]> = [];
    const repo = buildRepository([pilotStory, broken, { nada: true }], (id, problems) => reported.push([id, problems]));
    expect(repo.list().map((e) => e.id)).toEqual(['la-luna-y-la-puerta-azul']);
    expect(reported.map(([id]) => id)).toEqual(['rota', '(sin id)']);
    expect(reported[0][1].join(' ')).toMatch(/sin texto/);
  });

  it('parseStory rechaza datos que no tienen forma de historia', () => {
    expect(parseStory(null).story).toBeNull();
    expect(parseStory({ id: 'x' }).story).toBeNull();
    expect(parseStory(pilotStory).problems).toEqual([]);
  });
});

describe('validateStory en historias de varias páginas', () => {
  const clone = (): Story => JSON.parse(JSON.stringify(devStory));

  it('ids de bloque y de pregunta repetidos entre páginas', () => {
    const s = clone();
    s.pages[1].blocks[0].id = s.pages[0].blocks[0].id;
    s.pages[1].checkpoint!.id = s.pages[0].checkpoint!.id;
    const p = validateStory(s).join(' ');
    expect(p).toMatch(/id de bloque repetido/);
    expect(p).toMatch(/id de pregunta repetido/);
  });

  it('una página no puede mezclar bloques con globo y sin globo', () => {
    const s = clone();
    delete s.pages[0].blocks[1].layout;
    expect(validateStory(s).join(' ')).toMatch(/mezcla bloques con y sin globo/);
  });

  it('variante de audiencia repetida, pregunta sin variantes y palabras de repaso sin sílabas', () => {
    const s = clone();
    s.pages[0].checkpoint!.variants[1].audience = 'explorador';
    s.pages[1].checkpoint!.variants = [];
    s.reviewWords = ['zzz'];
    const p = validateStory(s).join(' ');
    expect(p).toMatch(/variante repetida/);
    expect(p).toMatch(/no tiene variantes/);
    expect(p).toMatch(/reviewWords: "zzz"/);
  });

  it('nivel inválido y título vacío', () => {
    const s = clone();
    s.level = 0;
    s.title = '';
    const p = validateStory(s).join(' ');
    expect(p).toMatch(/nivel inválido/);
    expect(p).toMatch(/sin título/);
  });
});

describe('familias de variantes (idioma × nivel con el mismo arte)', () => {
  const variant = (familyId: string | undefined, language: 'es' | 'en', level: number): Story => {
    const s: Story = JSON.parse(JSON.stringify(pilotStory));
    s.id = `${familyId ?? 'solo'}-${language}-n${level}`;
    s.familyId = familyId;
    s.language = language;
    s.level = level;
    return s;
  };
  const entries = [variant('luna', 'es', 1), variant('luna', 'es', 2), variant('luna', 'es', 3), variant('luna', 'en', 1), variant('luna', 'en', 3), variant(undefined, 'es', 1)].map(toCatalogEntry);
  const ids = (l: Array<{ id: string }>) => l.map((e) => e.id);

  it('la ficha usa el id como familia cuando no hay familyId', () => {
    expect(entries[0].familyId).toBe('luna');
    expect(entries[5].familyId).toBe('solo-es-n1');
  });

  it('una tarjeta por familia: la variante del idioma del perfil y del nivel exacto', () => {
    expect(ids(pickVariants(entries, { language: 'es', level: 2 }))).toEqual(['luna-es-n2', 'solo-es-n1']);
    expect(ids(pickVariants(entries, { language: 'es', level: 3 }))).toEqual(['luna-es-n3', 'solo-es-n1']);
  });

  it('sin nivel exacto elige el más cercano; a igual distancia, el más fácil', () => {
    expect(ids(pickVariants(entries, { language: 'en', level: 2 }))).toEqual(['luna-en-n1']); // 1 y 3 empatan → el 1
    expect(ids(pickVariants(entries, { language: 'en', level: 6 }))).toEqual(['luna-en-n3']);
    expect(ids(pickVariants(entries, { language: 'es', level: 9 }))).toEqual(['luna-es-n3', 'solo-es-n1']);
  });

  it('no mezcla idiomas: en inglés no aparecen las historias que solo existen en español', () => {
    expect(ids(pickVariants(entries, { language: 'en', level: 1 }))).toEqual(['luna-en-n1']);
  });

  it('si no hay NINGUNA historia en el idioma del perfil, se muestran todas (nunca una pantalla vacía)', () => {
    const onlyEs = entries.filter((e) => e.language === 'es');
    expect(pickVariants(onlyEs, { language: 'en', level: 1 }).length).toBe(2);
    expect(pickVariants([], { language: 'es', level: 1 })).toEqual([]);
  });

  it('familyId inválido y ids repetidos entre variantes se rechazan', () => {
    const bad = variant('Luna Nueva', 'es', 1);
    expect(validateStory(bad).join(' ')).toMatch(/familyId inválido/);
    const reported: string[] = [];
    const repo = buildRepository([variant('luna', 'es', 1), variant('luna', 'es', 1), variant('luna', 'es', 2)], (id, p) => reported.push(`${id}: ${p.join()}`));
    expect(ids(repo.list())).toEqual(['luna-es-n1', 'luna-es-n2']);
    expect(reported).toHaveLength(1);
    expect(reported[0]).toMatch(/id repetido/);
  });
});

describe('repaso a partir de claves acumuladas', () => {
  it('reviewWordsFromKeys prioriza las que costaron, luego las base, sin repetidos', () => {
    expect(reviewWordsFromKeys(devStory, ['puente', 'zzz', 'puente'])).toEqual(['puente', 'sendero', 'estrella']);
    expect(reviewWordsFromKeys(devStory, [])).toEqual(['sendero', 'puente', 'estrella']);
    expect(reviewWordsFromKeys(devStory, ['sendero', 'puente', 'estrella', 'cruzar'], 2)).toEqual(['sendero', 'puente']);
  });
});

describe('plantillas de página (el contenido no escribe coordenadas)', () => {
  const rawPage = (template: string | undefined, blocks: number) => ({
    id: 'p1',
    ...(template ? { template } : {}),
    illustration: { src: 'x.webp', width: 1536, height: 1024 },
    blocks: Array.from({ length: blocks }, (_, i) => ({ id: `b${i + 1}`, title: `Cuadro ${i + 1}`, lines: ['Hola mundo.'] })),
  });
  const story = (page: unknown): Story => ({ ...JSON.parse(JSON.stringify(devStory)), id: 'con-plantilla', pages: [page], reviewWords: [] });

  it('templateLayouts convierte el globo a % de la ilustración', () => {
    const [first] = templateLayouts('three-up');
    expect(first.balloon).toEqual({ x: 27, y: 13, width: 720, height: 142 });
    expect(first.text).toEqual({ x: 48, y: 28, width: 678, height: 112 });
    expect(first.bubble).toEqual({ leftPct: 3.13, topPct: 2.73, widthPct: 44.14 });
    expect(first.align).toBe('left');
    expect(first.valign).toBe('middle');
    expect(first.panel).toEqual({ x0: 0, y0: 0, x1: 763, y1: 518 });
    expect(templateLayouts('full')).toHaveLength(1);
  });

  it('parseStory expande la plantilla: cada cuadro recibe su layout y la historia es válida', () => {
    const { story: s, problems } = parseStory(story(rawPage('two-up', 2)));
    expect(problems).toEqual([]);
    expect(s!.pages[0].blocks.map((b) => b.layout?.panel.x0)).toEqual([0, 774]);
    expect(s!.pages[0]).not.toHaveProperty('template');
    expect(tokenizePage(s!.pages[0])).toHaveLength(4);
  });

  it('expandPage no toca una página sin plantilla ni la que tiene un problema (no se adivina)', () => {
    const plain = rawPage(undefined, 2) as never;
    expect(expandPage(plain)).toBe(plain);
    const wrongCount = rawPage('three-up', 2) as never;
    expect(expandPage(wrongCount)).toBe(wrongCount);
  });

  it('validateStory rechaza plantilla desconocida, número de cuadros que no cuadra y layout escrito a mano junto con la plantilla', () => {
    expect(validateStory(story(rawPage('cuatro-en-raya', 2))).join(' ')).toContain(`plantilla desconocida "cuatro-en-raya" (las hay: ${TEMPLATE_NAMES.join(', ')})`);
    expect(validateStory(story(rawPage('three-up', 2))).join(' ')).toMatch(/lleva 3 cuadro\(s\) y la página tiene 2/);
    const withLayout = rawPage('two-up', 2) as { blocks: Array<Record<string, unknown>> };
    withLayout.blocks[0].layout = { bubble: { leftPct: 1, topPct: 1, widthPct: 10 }, panel: { x0: 0, y0: 0, x1: 10, y1: 10 } };
    expect(validateStory(story(withLayout)).join(' ')).toMatch(/los cuadros no llevan "layout"/);
  });

  it('una página con plantilla se lee como cualquier página de cómic: sus globos coinciden con los del arte dibujado', () => {
    const { story: s } = parseStory(story(rawPage('three-up', 3)));
    const layouts = s!.pages[0].blocks.map((b) => b.layout!.bubble);
    expect(layouts.map((l) => l.widthPct)).toEqual([44.14, 44.01, 94.01]);
  });
});

describe('archivo de ajustes del editor (layouts/<familia>.layout.json)', () => {
  const templated = (): Story => {
    const s: Story = JSON.parse(JSON.stringify(devStory));
    s.id = 'fam-es-n1';
    s.familyId = 'fam';
    s.reviewWords = [];
    s.pages = [
      {
        id: 'p1',
        template: 'two-up',
        illustration: { src: 'x.webp', width: 1536, height: 1024 },
        blocks: [
          { id: 'b1', title: 'Uno', lines: ['Hola mundo.'] },
          { id: 'b2', title: 'Dos', lines: ['Adiós mundo.'] },
        ],
      },
    ];
    return s;
  };
  const file = (over: Record<string, unknown> = {}) => ({ familyId: 'fam', version: 1, pages: { p1: { blocks: { b1: { text: { x: 100, y: 40, width: 500, height: 120 }, align: 'center', maxFontPx: 40, fontPx: 30, fontPxByVariant: { 'fam-es-n1': 26 } }, ...over } } } });

  it('un archivo válido pasa; sin ajustes es válido', () => {
    expect(validateLayoutFile(file())).toEqual([]);
    expect(validateLayoutFile(emptyLayoutFile('fam'))).toEqual([]);
  });

  it('rechaza cajas fuera de la ilustración o diminutas, tamaños absurdos, enums y campos desconocidos', () => {
    const bad = validateLayoutFile(file({ b2: { text: { x: 1400, y: 10, width: 300, height: 50 }, balloon: { x: 0, y: 0, width: 4, height: 4 }, fontPx: 500, align: 'justify', valign: 'x', mystery: 1, fontPxByVariant: { 'a b': 10 } } })).join(' | ');
    expect(bad).toMatch(/se sale de la ilustración/);
    expect(bad).toMatch(/demasiado pequeña/);
    expect(bad).toMatch(/fontPx: entre 8 y 200/);
    expect(bad).toMatch(/align inválido/);
    expect(bad).toMatch(/valign inválido/);
    expect(bad).toMatch(/campo desconocido "mystery"/);
    expect(bad).toMatch(/fontPxByVariant\["a b"\] inválido/);
    expect(validateLayoutFile({ ...file(), familyId: 'Mala Familia', version: 2 }).join()).toMatch(/familyId inválido.*version debe ser 1/);
    expect(validateLayoutFile(null)).toEqual(['el archivo no es un objeto']);
    expect(validateLayoutFile({ familyId: 'fam', version: 1, pages: [] })).toEqual(['pages debe ser un objeto']);
  });

  it('applyLayoutFile: los ajustes ganan a la plantilla; lo no ajustado se queda como estaba', () => {
    const base = expandStory(templated());
    const s = expandStory(templated(), file() as never);
    const [b1, b2] = s.pages[0].blocks;
    expect(b1.layout!.text).toEqual({ x: 100, y: 40, width: 500, height: 120 });
    expect(b1.layout!.bubble).toEqual({ leftPct: 6.51, topPct: 3.91, widthPct: 32.55 }); // derivado de la caja
    expect(b1.layout).toMatchObject({ align: 'center', maxFontPx: 40, fontPx: 26 }); // fontPxByVariant gana a fontPx
    expect(b2.layout).toEqual(base.pages[0].blocks[1].layout); // sin ajustes: igual que la plantilla
    expect(b1.layout!.balloon).toEqual(base.pages[0].blocks[0].layout!.balloon); // el globo no se tocó
  });

  it('la letra fija de una variante solo afecta a esa variante; fontPx común afecta a todas', () => {
    const other = { ...templated(), id: 'fam-en-n3' };
    const f = file() as never;
    expect(expandStory(other, f).pages[0].blocks[0].layout!.fontPx).toBe(30);
    expect(expandStory(templated(), f).pages[0].blocks[0].layout!.fontPx).toBe(26);
  });

  it('un archivo de otra familia, o ajustes de un bloque que no existe, no cambian nada', () => {
    const base = expandStory(templated());
    expect(expandStory(templated(), { ...file(), familyId: 'otra' } as never)).toEqual(base);
    expect(expandStory(templated(), file({ zzz: { align: 'right' } }) as never).pages[0].blocks[1]).toEqual(base.pages[0].blocks[1]);
  });

  it('los ajustes no se aplican a páginas sin globo dibujado (p. ej. la piloto)', () => {
    const pilotLike: Story = JSON.parse(JSON.stringify(pilotStory));
    const f = { familyId: pilotLike.id, version: 1, pages: { p01: { blocks: { b01: { align: 'center' } } } } } as never;
    expect(expandStory(pilotLike, f).pages[0].blocks[0].layout).toEqual(pilotLike.pages[0].blocks[0].layout);
  });

  it('buildRepository aplica los ajustes por familia y reporta (sin cargar) los inválidos', () => {
    const reported: string[] = [];
    const repo = buildRepository([templated()], (id) => reported.push(id), [file(), { familyId: 'mala', version: 9, pages: {} }]);
    expect(repo.get('fam-es-n1')!.pages[0].blocks[0].layout!.align).toBe('center');
    expect(reported).toEqual(['layout:mala']);
  });

  it('normalizeLayoutFile deja solo lo que hay, con claves en orden y valores a 0,1 px', () => {
    const n = normalizeLayoutFile({ familyId: 'fam', version: 1, pages: { p2: { blocks: { b9: {} } }, p1: { blocks: { b2: { align: 'right' }, b1: { text: { x: 10.04, y: 20.06, width: 300.55, height: 80 }, fontPxByVariant: {} } } } } });
    expect(Object.keys(n.pages)).toEqual(['p1']); // p2 sin ajustes desaparece
    expect(Object.keys(n.pages.p1.blocks)).toEqual(['b1', 'b2']);
    expect(n.pages.p1.blocks.b1).toEqual({ text: { x: 10, y: 20.1, width: 300.6, height: 80 } });
    expect(validateLayoutFile(n)).toEqual([]);
  });
});

describe('catálogo de plantillas', () => {
  it('cuántos cuadros lleva cada una (1 a 6 por página; 13 plantillas)', () => {
    const counts = Object.fromEntries(TEMPLATE_NAMES.map((n) => [n, PAGE_TEMPLATES[n].slots.length]));
    expect(counts).toEqual({ full: 1, 'two-up': 2, 'three-up': 3, 'four-up': 4, 'six-up': 6, 'book-1': 1, 'book-2': 2, 'book-3': 3, 'slant-2': 2, 'slant-3': 3, 'bolt-2': 2, 'manga-6': 6, 'burst-2': 2 });
  });

  it('las páginas de libro dan una caja de texto MUY grande (no tapan el dibujo) y las de cuadrícula una de tamaño medio', () => {
    const area = (n: keyof typeof PAGE_TEMPLATES, i = 0) => {
      const t = templateLayouts(n)[i].text!;
      return t.width * t.height;
    };
    expect(area('book-1')).toBeGreaterThan(300_000);
    expect(area('book-2')).toBeGreaterThan(150_000);
    expect(area('book-3')).toBeGreaterThan(120_000);
    expect(area('four-up')).toBeGreaterThan(70_000);
    expect(area('six-up')).toBeGreaterThan(45_000);
    expect(area('book-1')).toBeGreaterThan(area('two-up') * 2);
  });

  it('en las páginas de libro la ilustración ocupa arriba y el texto abajo: la banda no se pisa con ninguna viñeta', () => {
    for (const n of ['book-1', 'book-2', 'book-3'] as const) {
      for (const s of PAGE_TEMPLATES[n].slots) expect(s.balloon[1]).toBeGreaterThanOrEqual(s.panel.y1);
    }
  });

  it('parseStory expande cada plantilla nueva con el número de cuadros que le toca', () => {
    for (const [name, blocks] of [['four-up', 4], ['six-up', 6], ['book-1', 1], ['book-2', 2], ['book-3', 3]] as const) {
      const page = { id: 'p1', template: name, illustration: { src: 'x.webp', width: 1536, height: 1024 }, blocks: Array.from({ length: blocks }, (_, i) => ({ id: `b${i + 1}`, title: `T${i + 1}`, lines: ['Hola mundo.'] })) };
      const { story: s, problems } = parseStory({ ...JSON.parse(JSON.stringify(devStory)), id: `plantilla-${name}`, pages: [page], reviewWords: [] });
      expect(problems, name).toEqual([]);
      expect(s!.pages[0].blocks.every((b) => b.layout?.balloon && b.layout.text), name).toBe(true);
    }
  });
});
