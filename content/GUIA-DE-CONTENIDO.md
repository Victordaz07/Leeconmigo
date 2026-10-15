# Contrato de contenido — cómo debe venir una historia para Lee Conmigo

**El formato lo pone el motor, no el generador.** Este documento es la lista completa de parámetros. Si el paquete los cumple, la
historia entra sin tocar nada; si no, `npm run stories:check` dice exactamente qué línea corregir.
Regla de oro (docs/05): **el texto nunca va dentro de la imagen** — la imagen es arte y globos vacíos; el texto lo pone la app.

---

## 0. Resumen en una pantalla

| Parámetro | Valor exigido |
|---|---|
| Unidad de trabajo | **Una historia = una familia**; cada **idioma × nivel** es un archivo JSON (variante) |
| Ilustración de página | **1536 × 1024 px**, PNG/JPG/WebP, **sin texto**, con los **globos vacíos en los rectángulos de la plantilla** (sección 3) |
| Portada | Cualquier tamaño 3:2 (idealmente 1536 × 1024), **sin título dibujado** |
| Plantillas de página | `full` (1) · `two-up` (2) · `three-up` (3) · `four-up` (4) · `six-up` (6) · `book-1` (1) · `book-2` (2) · `book-3` (3) · **dinámicas:** `slant-2` (2) · `slant-3` (3) · `bolt-2` (2) · `manga-6` (6) · `burst-2` (2). **El JSON no lleva coordenadas.** |
| Cuadro (`block`) | 1–4 líneas; **cada línea = una frase completa**, ≤ 120 caracteres |
| Ids | `id` único por variante: **`<familia>-<idioma>-n<nivel>`**. `familyId` = `<familia>` |
| Mismo esqueleto | Todas las variantes de una familia comparten `template`, ids de página/cuadro/pregunta y rutas de imagen |
| Pregunta | **1 por página**, con variante `explorador` y `lector`, 3 opciones, sin la palabra "incorrecto" |
| Vocabulario | Clave en minúsculas con acentos; **las sílabas unidas = la clave** |
| `reviewWords` | 3 claves del vocabulario, **cada una con ≥ 2 sílabas** |
| Verificación | `npm run stories:check` |

---

## 1. Archivos y carpetas

```
packages/story-engine/stories/<idioma>/<familia>-<idioma>-n<nivel>.json     ← una por variante (el nombre ES el id)
apps/reader/public/stories/<familia>/page-01.webp   page-02.webp …          ← el arte, COMPARTIDO por todas las variantes
apps/reader/public/stories/<familia>/cover.webp                             ← portada
content/<familia>/                                                          ← (opcional) hoja de personajes, prompts, textos
```

- `<idioma>` es `es` o `en` y la carpeta debe coincidir con `language`. Ejemplo: `es/mi-mochila-hace-achis-es-n2.json`.
- Las rutas `src` de las imágenes son relativas a `apps/reader/public/`: `"stories/<familia>/page-01.webp"`.
- Si entregas PNG, yo los convierto a WebP (2,3 MB → ~220 KB). Los `width`/`height` del JSON deben ser los reales.

## 2. Una historia = una familia de variantes

El arte se reutiliza entre idiomas y niveles (docs/01); solo cambia el texto. Por eso:

- **Idéntico en todas las variantes**: `familyId`, `template` de cada página, ids de página (`p01…`), de cuadro (`b01…`) y de
  pregunta (`q01…`), rutas de imagen y número de cuadros por página. El validador lo comprueba.
- **Distinto por variante**: `id`, `language`, `level`, `title`, `description`, los textos, las preguntas, el vocabulario.
- Cada idioma se escribe de forma natural, **no como traducción literal** (docs/01). Los niveles cambian la longitud y la
  complejidad, **no el argumento**: mismo problema, misma pista, mismo final.
- Los cuadros no se agregan ni se quitan entre niveles (el arte es el mismo): el nivel 3 escribe **más frases por cuadro**, no más cuadros.

**Extensión orientativa por nivel** (docs/01): nivel 1 → 80–150 palabras · nivel 2 → 150–250 · nivel 3 → 300–500 · nivel 4 → 600–900
· nivel 5 → 900–1 300 · nivel 6 → 1 200–1 800+. Una historia de **3 páginas / 7 cuadros** ya prueba todo el flujo. El `level` es el
nivel **de la app** (1, 2, 3…), no el grado escolar.

**Niveles 4-5 (banda "Illustrated Reader", docs/05): usa `book-1`/`book-2`/`book-3`, no plantillas de cómic.** Docs/01 pide 3–4
ilustraciones para nivel 4 y 2–3 para nivel 5 (bastante menos apoyo visual que 1-3) y texto ya dominante, no diálogo de globo. Las
plantillas `book-*` (sección 3) ya están pensadas exactamente para esto: ilustración arriba + una tarjeta de texto grande debajo, sin
cola de globo — la letra sale mucho más grande que en un globo de cómic, y **no hace falta medir zona en blanco en el arte** (a
diferencia del formato "cuento largo" de nivel 6, que sí exige medir la zona crema página por página porque el texto va encima de la
ilustración: ver `content/ESPECIFICACION-HISTORIA-LARGA-PRUEBA-DE-ESTRES.md`). Recomendado: 3–4 páginas con `book-1` (una
ilustración por página) para cubrir el número de ilustraciones de docs/01 con margen para texto largo por página; si se prefieren
menos páginas, `book-2`/`book-3` agrupan 2-3 ilustraciones en una sola página. Igual que con 1-3: **mismo esqueleto (mismas
plantillas, mismas imágenes) en las variantes de nivel 4 y 5 de una misma familia** — el nivel 5 escribe más frases por cuadro que
el nivel 4, no más páginas ni más imágenes.

---

## 3. Imágenes y plantillas de página

Cada página elige **una plantilla**; la ilustración se dibuja con los globos **vacíos** en los rectángulos de abajo (píxeles sobre
1536 × 1024, `[x0, y0, x1, y1]`, borde incluido). Los globos: fondo crema, borde oscuro fino, esquinas redondeadas, **sin cola ni
texto**. El motor pone el texto dentro con un margen de ~20 px.

### `three-up` — 3 cuadros (dos viñetas arriba, una ancha abajo)
| Cuadro | Viñeta (enfoque de la cámara) | Globo vacío que debe traer el arte |
|---|---|---|
| 1 · arriba-izquierda | [0, 0, 763, 518] | **[27, 13, 747, 155]** |
| 2 · arriba-derecha | [774, 0, 1536, 518] | **[793, 11, 1511, 153]** |
| 3 · abajo (ancha) | [0, 529, 1536, 1024] | **[25, 533, 1511, 645]** |

### `two-up` — 2 cuadros (dos viñetas altas)
| Cuadro | Viñeta | Globo vacío |
|---|---|---|
| 1 · izquierda | [0, 0, 765, 1024] | **[25, 13, 749, 173]** |
| 2 · derecha | [774, 0, 1536, 1024] | **[787, 13, 1511, 173]** |

### `full` — 1 cuadro (escena a página completa)
| Cuadro | Viñeta | Globo vacío |
|---|---|---|
| 1 | [0, 0, 1536, 1024] | **[25, 13, 1511, 195]** |

### `four-up` — 4 cuadros (cuadrícula de 2 × 2, orden: fila de arriba y luego la de abajo)
| Cuadro | Viñeta | Globo vacío |
|---|---|---|
| 1 · arriba-izquierda | [0, 0, 763, 507] | **[22, 14, 741, 164]** |
| 2 · arriba-derecha | [773, 0, 1536, 507] | **[795, 14, 1514, 164]** |
| 3 · abajo-izquierda | [0, 517, 763, 1024] | **[22, 531, 741, 681]** |
| 4 · abajo-derecha | [773, 517, 1536, 1024] | **[795, 531, 1514, 681]** |

### `six-up` — 6 cuadros (3 columnas × 2 filas; globos pequeños: frases muy cortas, diálogos rápidos, onomatopeyas)
| Cuadro | Viñeta | Globo vacío |
|---|---|---|
| 1 · fila 1, col. 1 | [0, 0, 505, 507] | **[20, 14, 485, 164]** |
| 2 · fila 1, col. 2 | [515, 0, 1020, 507] | **[535, 14, 1000, 164]** |
| 3 · fila 1, col. 3 | [1030, 0, 1536, 507] | **[1050, 14, 1516, 164]** |
| 4 · fila 2, col. 1 | [0, 517, 505, 1024] | **[20, 531, 485, 681]** |
| 5 · fila 2, col. 2 | [515, 517, 1020, 1024] | **[535, 531, 1000, 681]** |
| 6 · fila 2, col. 3 | [1030, 517, 1536, 1024] | **[1050, 531, 1516, 681]** |

### Páginas de LIBRO (`book-1`, `book-2`, `book-3`): la ilustración arriba y una banda de texto grande DEBAJO
El texto no tapa el dibujo: cada ilustración lleva debajo su "tarjeta" crema (mismo estilo que un globo: fondo crema, borde oscuro fino,
esquinas redondeadas, SIN cola y SIN texto). Es la opción para los niveles altos o para pasajes largos: la letra sale mucho más grande.

**`book-1` — 1 cuadro** (una ilustración ancha y una banda debajo)
| Cuadro | Ilustración | Tarjeta de texto vacía |
|---|---|---|
| 1 | [0, 0, 1536, 700] | **[20, 712, 1516, 1004]** |

**`book-2` — 2 cuadros** (dos ilustraciones lado a lado, cada una con su tarjeta debajo)
| Cuadro | Ilustración | Tarjeta de texto vacía |
|---|---|---|
| 1 · izquierda | [0, 0, 763, 700] | **[20, 712, 743, 1004]** |
| 2 · derecha | [773, 0, 1536, 700] | **[793, 712, 1516, 1004]** |

**`book-3` — 3 cuadros** (tres columnas altas, cada una con su tarjeta debajo)
| Cuadro | Ilustración | Tarjeta de texto vacía |
|---|---|---|
| 1 · izquierda | [0, 0, 505, 660] | **[16, 672, 489, 1008]** |
| 2 · centro | [515, 0, 1020, 660] | **[531, 672, 1004, 1008]** |
| 3 · derecha | [1030, 0, 1536, 660] | **[1046, 672, 1520, 1008]** |

### Plantillas DINÁMICAS (viñetas inclinadas, rayo, explosión: estilo cómic / manga)
Las viñetas ya no son rectángulos, pero **al texto le da igual**: los globos siguen siendo rectángulos redondeados y solo importa dónde van. La forma de las
viñetas (las diagonales, el rayo) se dibuja **en la ilustración**; los vértices de cada viñeta están abajo y en las imágenes guía. Las viñetas se separan con un
canal blanco de ~18 px y los globos quedan **dentro** de su viñeta.

**`slant-2` — 2 cuadros** (dos viñetas separadas por una diagonal casi vertical)
| Cuadro | Forma de la viñeta (vértices x,y) | Globo vacío |
|---|---|---|
| 1 · izquierda | (0,0) (806,0) (730,1024) (0,1024) | **[20, 14, 740, 164]** |
| 2 · derecha | (824,0) (1536,0) (1536,1024) (748,1024) | **[850, 14, 1516, 164]** |

**`slant-3` — 3 cuadros** (una viñeta ancha arriba y dos abajo, divisiones inclinadas)
| Cuadro | Forma de la viñeta | Globo vacío |
|---|---|---|
| 1 · arriba | (0,0) (1536,0) (1536,462) (0,552) | **[22, 14, 1514, 164]** |
| 2 · abajo-izquierda | (0,570) (756,526) (700,1024) (0,1024) | **[20, 596, 690, 746]** |
| 3 · abajo-derecha | (774,525) (1536,480) (1536,1024) (718,1024) | **[800, 572, 1516, 722]** |

**`bolt-2` — 2 cuadros** (dos escenas separadas por un divisor en forma de RAYO: una arriba a la izquierda y otra abajo a la derecha)
| Cuadro | Forma de la viñeta | Globo vacío |
|---|---|---|
| 1 · arriba | (0,0) (1536,0) (1536,388) (720,638) (620,548) (0,688) | **[22, 14, 740, 164]** |
| 2 · abajo | (0,712) (620,572) (720,662) (1536,412) (1536,1024) (0,1024) | **[800, 856, 1514, 1004]** |

**`manga-6` — 6 cuadros** (tres filas de dos viñetas con las divisiones inclinadas; orden: fila por fila)
| Cuadro | Forma de la viñeta | Globo vacío |
|---|---|---|
| 1 · fila 1, izquierda | (0,0) (716,0) (646,340) (0,340) | **[20, 14, 660, 164]** |
| 2 · fila 1, derecha | (736,0) (1536,0) (1536,340) (666,340) | **[770, 14, 1516, 164]** |
| 3 · fila 2, izquierda | (0,356) (516,356) (556,690) (0,690) | **[20, 372, 470, 522]** |
| 4 · fila 2, derecha | (536,356) (1536,356) (1536,690) (576,690) | **[610, 372, 1516, 522]** |
| 5 · fila 3, izquierda | (0,706) (896,706) (836,1024) (0,1024) | **[20, 722, 820, 872]** |
| 6 · fila 3, derecha | (916,706) (1536,706) (1536,1024) (856,1024) | **[930, 722, 1516, 872]** |

**`burst-2` — 2 cuadros** (dos viñetas apiladas y, en el centro, una **EXPLOSIÓN** que es el globo del primer cuadro: para un ¡Pum! o un ¡Zas!, texto de 1–3 palabras)
| Cuadro | Viñeta | Globo vacío |
|---|---|---|
| 1 · explosión central (cruza el canal entre las dos viñetas) | arriba: (0,0)–(1536,470) | **[598, 318, 938, 658]** (estrella de 14 puntas, crema con borde oscuro; el texto, centrado y de 1–3 palabras, ocupa solo su círculo interior) |
| 2 · abajo a la derecha | abajo: (0,506)–(1536,1024) | **[816, 856, 1514, 1004]** |

**Imágenes guía de cada plantilla:** `content/plantillas/<plantilla>.png` (1536 × 1024, sin texto): viñetas en gris claro con los globos o
tarjetas vacíos EXACTAMENTE donde deben quedar. Adjúntala al generador de imágenes como referencia de composición ("dibuja la escena
respetando esta distribución"); se regeneran con `npm run templates:guides`.

**Cómo se ve el texto:** va DIRECTO dentro del globo dibujado (sin caja encima), con la letra lo más grande que quepa. El globo se mide
como el rectángulo **con su borde** (unos 5 px de borde oscuro); el texto ocupa su interior menos un pequeño margen. Si un globo sale unos
píxeles distinto, no hace falta regenerar la imagen: en **el modo editor** (panel DEV → ✎ Editar texto en los globos) se mueve y se
redimensiona la caja de cada cuadro y se **guarda definitivo** (`layouts/<familia>.layout.json`).

Reglas para el arte:
- **Nada importante debajo de los globos** (caras, manos, la acción): quedan cubiertos por el texto. Deja aire.
- **Los globos NO llevan texto, letras, onomatopeyas ni rótulos**; tampoco el resto de la imagen.
- Las viñetas de una página se separan con un filete blanco/oscuro de ~10 px (como en `mi-mochila-hace-achis`); no se pisan.
- **Personajes consistentes**: primero una **hoja de personajes** (frente, ¾, perfil, felices/sorprendidos/preocupados,
  sentados/caminando) y se usa como referencia en todas las escenas (docs/05). DALL·E 3 solo no acepta imágenes de referencia
  (docs/09 #12): usa una herramienta que sí las acepte (p. ej. `gpt-image` en modo edición) o verifica cada escena.
- **Portada**: escena completa sin globos ni título; `heroFocus` indica dónde está lo importante (ver abajo).

Una página **sin** `template` es de **solo texto**: la ilustración va sola y el texto se lee únicamente en el panel lateral (no
necesita globos). Sirve para pruebas o para libros de más texto.

---

## 4. El JSON, campo por campo

`*` = obligatorio.

**Historia (raíz)**
| Campo | Tipo | Regla |
|---|---|---|
| `id`* | texto | `<familia>-<idioma>-n<nivel>`; único en toda la biblioteca; = nombre del archivo sin `.json` |
| `familyId`* (familias) | texto | minúsculas, números y guiones: `mi-mochila-hace-achis`. Igual en todas las variantes |
| `language`* | `"es"` \| `"en"` | = carpeta |
| `title`* | texto | Lo que ve el niño |
| `level`* | entero ≥ 1 | Nivel de la app |
| `description` | texto | 1 frase, la ve el padre/niño en la ficha |
| `cover` | imagen | `{src, width, height, alt}` |
| `heroFocus` | `{x, y}` en % | Punto de la portada que debe quedar visible en el banner panorámico de Inicio (0–100; 50,50 = centro). Requiere `cover` |
| `reviewWords`* | 3 claves | Palabras del repaso final; **cada una con ≥ 2 sílabas en `vocabulary`** |
| `pages`* | lista | ≥ 1 página |
| `vocabulary`* | objeto | Ver sección 6 |
| `dev` | booleano | Solo para contenido de prueba (no sale en la app compilada) |

**Página (`pages[]`)**
| Campo | Regla |
|---|---|
| `id`* | `p01`, `p02`… (único en la historia) |
| `illustration`* | `{src, width: 1536, height: 1024, alt}`. `alt`: descripción de la escena (accesibilidad) |
| `template` | Una de las 13: `full`(1) `two-up`(2) `three-up`(3) `four-up`(4) `six-up`(6) `book-1`(1) `book-2`(2) `book-3`(3) `slant-2`(2) `slant-3`(3) `bolt-2`(2) `manga-6`(6) `burst-2`(2). **El número de cuadros debe coincidir**. Sin `template`, **ningún** cuadro lleva `layout` |
| `blocks`* | cuadros, **en orden de lectura** (el de la plantilla: 1.º, 2.º, 3.º) |
| `checkpoint` | La pregunta de la página (sección 5). Sin ella, se sigue directo a la página siguiente |

**Cuadro (`blocks[]`)**
| Campo | Regla |
|---|---|
| `id`* | `b01`, `b02`… **únicos en toda la historia** (no se reinician por página) |
| `title`* | Nombre corto de la escena (≤ 28 caracteres): sale como rótulo en la miniatura del panel |
| `voice` | `"narration"` \| `"dialogue"` (informativo) |
| `lines`* | 1–4 frases. Ver reglas de texto |
| `layout` | **NO se escribe** con `template` (lo pone el motor) |

**Reglas de texto** (lo que el validador rechaza y lo que conviene cuidar):
1. **Cada `line` es una frase completa** que se lee de una vez, ≤ 120 caracteres. Es la unidad que el panel muestra cuando el cuadro
   es largo: el motor nunca recorta ni achica la letra; si un cuadro no cabe a tamaño cómodo, muestra **una frase cada vez**.
2. **Cada palabra (lo que queda entre espacios) debe tener al menos una letra.** Un guion suelto (`—`) o un signo solo rompe el
   seguimiento de la lectura. Diálogo: la raya va **pegada**: `—¿Tienes sed?`, `—dijo Mila.`, `“Are you thirsty?”`.
3. Escribe los **números con letras**. Evita símbolos y emojis.
4. **Presupuesto por globo**: cada caja tiene una capacidad en caracteres con letra cómoda (unos 20 px en pantalla). **`npm run stories:budget`** la
   calcula por cuadro y avisa de los que se pasan (ejemplos: `six-up` ≈ 109, `four-up` ≈ 175, `two-up` ≈ 191, `full` ≈ 475, `book-1` ≈ 824; un cuadro admite como máximo
   4 frases × 120 caracteres = 480). Si un texto pasa, **la lectura no se corta** (el panel lo divide en frases); solo la letra del globo se ve más chica.
5. Vocabulario apropiado al nivel: frases cortas y claras que se puedan leer en voz alta sin trabarse.

---

## 5. Pregunta de comprensión (`checkpoint`)

```text
"checkpoint": { "id": "q01", "variants": [ { "audience": "explorador", … }, { "audience": "lector", … } ] }
```
- **Una por página**, id `q01`, `q02`… único en la historia. Las dos variantes son obligatorias en todas las páginas con pregunta.
- `explorador` (6–8 años): pregunta literal cuya respuesta se pueda **señalar en el dibujo**; opciones cortas.
- `lector` (9–12): inferencia o causa/efecto (por qué, qué decidió, qué pista…).
- `options`: **2–3** de `{ "text": "…" }` (la imagen de las opciones la saca el motor de la ilustración; no se pide arte extra).
  `correctIndex` cuenta desde **0**.
- `correctFeedback`: confirma con calidez. `retryFeedback`: **una pista amable** que manda a mirar/releer algo concreto.
  **Nunca la palabra "incorrecto"** (docs/06): el validador la rechaza. Sin tono de examen.
- Las preguntas no cuentan como lectura ni penalizan: se puede reintentar hasta acertar.

---

## 6. Vocabulario y repaso

```text
"vocabulary": { "mochila": { "syllables": ["mo","chi","la"], "definition": "Bolsa que puedes llevar en la espalda.", "synonym": "morral" } }
```
- **Clave**: la palabra en **minúsculas, con acentos, sin puntuación** (`"dragón"`, no `"Dragón,"`).
- **`syllables`**: al unirlas dan **exactamente** la clave (`["dra","gón"]` → `dragón`). El validador lo comprueba. En inglés son
  apoyo de lectura, no fonética.
- `definition`: 1 frase corta, en el idioma de la historia, para el nivel. `synonym` (opcional; se muestra a los lectores mayores).
- Pon las palabras que un niño con dificultad puede trabarse (largas, con grupos de letras difíciles): ~ 6–15 por historia.
- **`reviewWords`** (3): palabras del vocabulario que sirvan para el juego de armar palabras por sílabas → **≥ 2 sílabas cada una**
  (una palabra de una sola sílaba como `spheres` no sirve).

---

## 7. Ejemplo completo mínimo (válido)

Página de cómic con plantilla `two-up`, portada y vocabulario:

```json
{
  "id": "el-faro-de-mateo-es-n1",
  "familyId": "el-faro-de-mateo",
  "language": "es",
  "title": "El faro de Mateo",
  "level": 1,
  "description": "Mateo descubre por qué el faro se apagó.",
  "cover": { "src": "stories/el-faro-de-mateo/cover.webp", "width": 1536, "height": 1024, "alt": "Mateo frente al faro" },
  "heroFocus": { "x": 50, "y": 45 },
  "reviewWords": ["faro", "marinero", "tormenta"],
  "pages": [
    {
      "id": "p01",
      "illustration": { "src": "stories/el-faro-de-mateo/page-01.webp", "width": 1536, "height": 1024, "alt": "Mateo mira el faro apagado" },
      "template": "two-up",
      "blocks": [
        { "id": "b01", "title": "El faro apagado", "voice": "narration", "lines": ["Mateo miró el faro.", "Esa noche estaba apagado."] },
        { "id": "b02", "title": "Una idea", "voice": "dialogue", "lines": ["—¡Yo lo arreglo! —dijo Mateo."] }
      ],
      "checkpoint": {
        "id": "q01",
        "variants": [
          {
            "audience": "explorador",
            "prompt": "¿Cómo estaba el faro esa noche?",
            "options": [ { "text": "Apagado" }, { "text": "Muy brillante" }, { "text": "Roto en el mar" } ],
            "correctIndex": 0,
            "correctFeedback": "¡Sí! Estaba apagado.",
            "retryFeedback": "Casi. Lee otra vez el primer cuadro."
          },
          {
            "audience": "lector",
            "prompt": "¿Qué decide hacer Mateo al ver el faro?",
            "options": [ { "text": "Irse a dormir" }, { "text": "Arreglarlo él mismo" }, { "text": "Llamar al marinero" } ],
            "correctIndex": 1,
            "correctFeedback": "Así es: quiere arreglarlo.",
            "retryFeedback": "Relee el último cuadro y piénsalo otra vez."
          }
        ]
      }
    }
  ],
  "vocabulary": {
    "faro":     { "syllables": ["fa", "ro"], "definition": "Una torre con una luz grande que guía a los barcos." },
    "marinero": { "syllables": ["ma", "ri", "ne", "ro"], "definition": "Una persona que trabaja en un barco.", "synonym": "navegante" },
    "tormenta": { "syllables": ["tor", "men", "ta"], "definition": "Lluvia y viento muy fuertes." }
  }
}
```

---

## 8. Prompt para el generador de TEXTO (pégalo tal cual, rellenando `<>`)

```text
Eres autor de cuentos para niños que aprenden a leer en voz alta. Te entrego un ESQUELETO de historia y debes devolver los
JSON de todas las variantes que te pida, SOLO JSON válido (sin comentarios ni texto alrededor), exactamente con el contrato
"Lee Conmigo". No inventes campos. No escribas coordenadas ni "layout".

ESQUELETO
- familyId: <mi-historia>            (minúsculas y guiones)
- Personajes: <nombre y una línea de cada uno>
- Argumento (igual en todas las variantes): <problema, pista y desenlace>
- Páginas y plantillas: p01=<three-up|two-up|full>, p02=<…>, p03=<…>   (cuadros: three-up=3, two-up=2, full=1)
- Cuadros con ids b01, b02… CORRIDOS en toda la historia (no se reinician por página); preguntas q01, q02… una por página.
- Variantes a escribir: <es nivel 1, es nivel 2, es nivel 3, en nivel 1, en nivel 2, en nivel 3>
- Extensión: nivel 1 = 80–150 palabras, nivel 2 = 150–250, nivel 3 = 300–500. Mismos cuadros en todos los niveles: el nivel sube
  con MÁS FRASES POR CUADRO (máx. 4), no con más cuadros.
- Cada idioma escrito de forma natural, NO traducción literal.

POR VARIANTE devuelve un objeto con: id ("<familyId>-<idioma>-n<nivel>"), familyId, language, title, level, description, cover
{src:"stories/<familyId>/cover.webp",width:1536,height:1024,alt}, heroFocus{x,y}, reviewWords (3), pages[] {id,
illustration{src:"stories/<familyId>/page-01.webp",width:1536,height:1024,alt}, template, blocks[]{id,title(≤28 caracteres),
voice("narration"|"dialogue"),lines[]}, checkpoint{id,variants[]{audience("explorador"|"lector"),prompt,options[]{text},correctIndex,
correctFeedback,retryFeedback}}}, vocabulary{"<palabra minúscula con acentos>":{syllables[],definition,synonym?}}.

REGLAS OBLIGATORIAS
1. Cada elemento de lines[] es UNA frase completa, ≤ 120 caracteres, fácil de leer en voz alta.
2. Ninguna "palabra" (entre espacios) sin letras: pega la raya de diálogo a la palabra (—¿Tienes sed?, —dijo Mila.). Números con letras.
3. Las variantes de una misma historia comparten familyId, template, ids de página/cuadro/pregunta y rutas de imagen. Solo cambian
   id, language, level, title, description, textos, preguntas y vocabulario.
4. Una pregunta por página, con variante "explorador" (literal, respuesta que se ve en el dibujo) y "lector" (inferencia). 3 opciones,
   correctIndex desde 0. correctFeedback cálido; retryFeedback = pista amable concreta. NUNCA la palabra "incorrecto".
5. vocabulary: clave en minúsculas CON acentos y sin puntuación; las sílabas unidas deben formar EXACTAMENTE la clave.
   Incluye 6–15 palabras difíciles. reviewWords: 3 claves del vocabulario, CADA UNA con 2 o más sílabas.
6. Presupuesto por globo: three-up cuadros 1–2 ≤ 4 renglones (~80 caracteres cada uno); three-up cuadro 3 ≤ 3 renglones (~170
   caracteres); two-up ≤ 5 renglones; full ≤ 4. Una frase de más de ~80 caracteres cuenta como 2 renglones en globos de media página.
```

## 8b. Prompt para nivel 4-5 (banda "Illustrated Reader", plantillas `book-1`/`book-2`/`book-3`)

```text
Eres autor de cuentos para niños de 9-11 años que ya leen con soltura pero siguen leyendo en voz alta. Te entrego un ESQUELETO de
historia y debes devolver los JSON de todas las variantes que te pida, SOLO JSON válido (sin comentarios ni texto alrededor),
exactamente con el contrato "Lee Conmigo". No inventes campos. No escribas coordenadas ni "layout".

ESQUELETO
- familyId: <mi-historia>            (minúsculas y guiones)
- Personajes: <nombre y una línea de cada uno>
- Argumento (igual en todas las variantes): <problema, pista(s) y desenlace>
- Páginas y plantillas: p01=<book-1|book-2|book-3>, p02=<…>, p03=<…>   (cuadros: book-1=1, book-2=2, book-3=3 — cada cuadro es UNA
  ilustración con su tarjeta de texto debajo, NO un globo de cómic)
- 3-4 páginas en total, para sumar 3-4 ilustraciones en total en la historia (menos que en las historias de cómic: nivel 4-5 es
  banda "Illustrated reader/Literary reader", menos apoyo visual, más texto por página).
- Cuadros con ids b01, b02… CORRIDOS en toda la historia (no se reinician por página); preguntas q01, q02… una por página.
- Variantes a escribir: <es nivel 4, es nivel 5, en nivel 4, en nivel 5>
- Extensión: nivel 4 = 600-900 palabras en TOTAL, nivel 5 = 900-1 300. Mismas páginas/imágenes en los dos niveles: el nivel 5 escribe
  MÁS FRASES POR CUADRO que el nivel 4, no más páginas.
- Cada idioma escrito de forma natural, NO traducción literal. Vocabulario más rico que niveles 1-3, sin dejar de ser claro en voz alta.

POR VARIANTE devuelve un objeto con: id ("<familyId>-<idioma>-n<nivel>"), familyId, language, title, level, description, cover
{src:"stories/<familyId>/cover.webp",width:1536,height:1024,alt}, heroFocus{x,y}, reviewWords (3), pages[] {id,
illustration{src:"stories/<familyId>/page-01.webp",width:1536,height:1024,alt}, template, blocks[]{id,title(≤28 caracteres),
voice("narration"|"dialogue"),lines[]}, checkpoint{id,variants[]{audience("explorador"|"lector"),prompt,options[]{text},correctIndex,
correctFeedback,retryFeedback}}}, vocabulary{"<palabra minúscula con acentos>":{syllables[],definition,synonym?}}.

REGLAS OBLIGATORIAS
1. Cada elemento de lines[] es UNA frase completa, fácil de leer en voz alta. Un cuadro `book-*` admite varias frases (párrafo
   completo) — no hace falta cortar cada frase en un cuadro aparte como en cómic.
2. Ninguna "palabra" (entre espacios) sin letras: pega la raya de diálogo a la palabra (—¿Tienes sed?, —dijo Mila.). Números con letras.
3. Las variantes de una misma historia comparten familyId, template de cada página, ids de página/cuadro/pregunta y rutas de imagen.
   Solo cambian id, language, level, title, description, textos, preguntas y vocabulario.
4. Una pregunta por página, con variante "explorador" (literal) y "lector" (inferencia, causa/efecto, motivación del personaje —
   más exigente que en niveles 1-3). 2-3 opciones, correctIndex desde 0. correctFeedback cálido; retryFeedback = pista amable
   concreta. NUNCA la palabra "incorrecto".
5. vocabulary: clave en minúsculas CON acentos y sin puntuación; las sílabas unidas deben formar EXACTAMENTE la clave. Incluye
   8-15 palabras (más ricas que niveles 1-3). reviewWords: 3 claves del vocabulario, CADA UNA con 2 o más sílabas.
```

## 8c. Prompt para el generador de IMAGEN, plantillas `book-*`

```text
Ilustración de libro infantil, estilo editorial/storybook (menos exagerado que cómic, iluminación suave, personajes naturales,
docs/05 banda "Illustrated Reader"), 1536×1024 (3:2) pero SOLO la mitad superior es escena (hasta y≈700 px para `book-1`; ver
sección 3 para book-2/book-3), personajes IDÉNTICOS a la hoja de referencia adjunta. En la escena: <qué pasa>.
IMPORTANTE:
- La escena ocupa SOLO la zona de ilustración de la tabla de la plantilla (sección 3); el resto del lienzo, hacia abajo, es la
  TARJETA DE TEXTO: rectángulo vacío color crema, borde oscuro fino, esquinas redondeadas, SIN texto ni cola de globo, en las
  coordenadas exactas de la tabla.
- NINGÚN texto, letra, número, onomatopeya, rótulo ni marca de agua en toda la imagen, ni en la escena ni en la tarjeta.
- Mantén el mismo mundo, la misma ropa y la misma paleta que en las otras páginas de la historia.
```

## 9. Prompt para el generador de IMAGEN (una escena por página)

```text
Ilustración de cómic infantil, estilo <el mismo estilo de la hoja de personajes>, 1536×1024 (3:2), luz cálida, colores saturados,
personajes IDÉNTICOS a la hoja de referencia adjunta. Composición: <plantilla>. En la escena: <qué pasa en cada viñeta>.
IMPORTANTE:
- Dibuja los GLOBOS VACÍOS (fondo crema, borde oscuro fino, esquinas redondeadas, SIN cola y SIN NINGÚN texto) exactamente en estos
  rectángulos en píxeles [x0,y0,x1,y1]: <copiar de la tabla de la plantilla, sección 3>.
- NINGÚN texto, letra, número, onomatopeya, rótulo ni marca de agua en toda la imagen.
- Separa las viñetas con un filete fino; no pongas nada importante (caras, manos, la acción) dentro de los rectángulos de los globos.
- Encuadre de cada viñeta: <cámara/plano>. Mantén el mismo cuarto, la misma ropa y la misma paleta que en las otras páginas.
```

---

## 10. Cómo se comprueba y qué dice cada error

`npm run stories:check` revisa **todas** las historias. Mensajes típicos:

| Mensaje | Qué corregir |
|---|---|
| `id repetido` | Cada variante necesita su `id` (`<familia>-<idioma>-n<nivel>`) |
| `el nombre del archivo es el id` | Renombra el archivo o el `id` |
| `plantilla desconocida` / `lleva N cuadro(s) y la página tiene M` | Usa `three-up`/`two-up`/`full` y el número de cuadros que corresponde |
| `los cuadros no llevan "layout"` | Con `template` no se escriben coordenadas: bórralas |
| `la "palabra" N ("—") no tiene letras` | Pega la raya o el signo a la palabra vecina |
| `las sílabas de "x" no reconstruyen la palabra` | Corrige `syllables` para que unidas den la clave |
| `reviewWords: "x" no tiene sílabas (2 o más)` | Cambia por una palabra de ≥ 2 sílabas del vocabulario |
| `el feedback nunca debe decir "Incorrecto"` | Reescribe `retryFeedback` como pista amable |
| `no existe la imagen` / `mide W×H y el JSON declara …` | Sube el archivo o corrige `width`/`height` |
| `todas comparten páginas, cuadros, ilustraciones y globos` | Las variantes de una familia deben tener el mismo esqueleto |

Si pasa, la historia aparece sola en **Inicio → Mis historias** (una tarjeta por familia; el idioma y nivel lo elige el padre:
`?lang=en&level=2` mientras no exista el panel de padres) y se lee completa: varias páginas, pregunta por página, repaso y final.

**No recomiendo aún** (docs/08): producir muchas historias ni las 6 versiones × 2 idiomas de golpe. Una historia real bien hecha,
en el idioma en que el niño lee mejor (docs/09 #11), vale más que diez a medias.
