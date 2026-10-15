# Prompts para GPT — *Mila, Pipo y la noche en que se apagaron las luciérnagas*

Todo lo de aquí está sacado de [`ESPECIFICACION-HISTORIA-LARGA-PRUEBA-DE-ESTRES.md`](ESPECIFICACION-HISTORIA-LARGA-PRUEBA-DE-ESTRES.md) (la explicación de por qué cada cosa).
Si algo cambia en una, cambia en la otra.

## Cómo usarlo

1. **Texto: 6 conversaciones nuevas** (es n1, es n2, es n3, en n1, en n2, en n3). En cada una pega el **Prompt de TEXTO** (sección 1) cambiando solo las dos líneas de `VARIANTE`.
   Pídele que **cuente los caracteres** antes de responder (ya lo dice el prompt). Guarda cada respuesta como `la-noche-sin-luces-<idioma>-n<nivel>.json`.
2. **Imágenes: 15 generaciones** (14 páginas + portada). Adjunta siempre la hoja de personajes y, en las páginas con plantilla, **la imagen guía de esa plantilla**
   (`content/plantillas/<plantilla>.png`, **la que NO dice «numerada»**). Pega el **Prompt de IMAGEN** (sección 2) y la fila de la página.
3. Entrégame los 6 JSON y las 15 imágenes en PNG (`page-01.png` … `page-14.png`, `cover.png`). Yo convierto, mido y monto.

> **Las plantillas de ejemplo no se tocan.** Las imágenes guía son la plantilla: el generador debe **copiarlas tal cual** (mismas viñetas, mismas diagonales, mismos globos vacíos en el mismo sitio),
> no reinterpretarlas ni «mejorarlas». Si en alguna página las deforma, no la retoques: mándamela y ajusto los globos con el modo editor.

---

## 1. Prompt de TEXTO (una conversación por variante)

```text
Eres autor de cuentos para niños que aprenden a leer en voz alta (el lector es un niño de 9 años con dificultad de lectura). Escribe UNA variante de una historia larga para la app "Lee Conmigo".

SALIDA: SOLO un objeto JSON válido. Sin markdown, sin comentarios, sin texto antes ni después. No inventes campos. No escribas coordenadas ni "layout".

VARIANTE A ESCRIBIR (cámbiala en cada conversación)
- Idioma: <es | en>
- Nivel: <1 | 2 | 3>
Las 6 variantes (es/en × niveles 1, 2, 3) comparten argumento, páginas, cuadros e ids. Cada idioma se escribe de forma NATURAL, no como traducción literal.

HISTORIA
- familyId: la-noche-sin-luces
- id de esta variante: la-noche-sin-luces-<idioma>-n<nivel>
- Título ES: "Mila, Pipo y la noche en que se apagaron las luciérnagas". Título EN: "Mila, Pipo, and the Night the Fireflies Went Dark".
- Personajes: Mila (niña de unos 8 años, curiosa y valiente, overol amarillo), Pipo (dragoncito verde menta, su amigo; estornuda cuando se pone nervioso), Tito (erizo café, tímido; ya salió en otra historia), Dora (cigüeña sabia que guarda "el libro de las luces"; en inglés es una stork).
- Argumento: al atardecer, Mila y Pipo salen al jardín con un frasco vacío para ver a las luciérnagas, pero no hay ninguna. Tito llora: "¡Se apagaron!". Una nube gorda tapó la luna y las luciérnagas se escondieron porque les dio miedo la oscuridad (cuando tienen miedo, apagan su luz). Cruzan el puente de corteza hasta la colina, donde Dora guarda el libro de las luces y les propone una adivinanza (la respuesta es "un libro"). Aprenden la solución: respirar hondo, contar hasta tres y cantar bajito para darles valor. Las luciérnagas se encienden una por una y luego todas; la nube se va. Vuelven a casa por el puente, iluminados.
- Mensaje: tener miedo no apaga la luz, solo la esconde; ayudar a otros a ser valientes también es ser valiente.
- ESTRIBILLO (una sola frase, una sola línea de "lines", sin cambiar ni una letra en sus 4 primeras apariciones):
  ES: "Una luz, dos luces… ¿dónde están las luces?"   EN: "One light, two lights… where are the lights?"
  Aparece 5 veces: en b01, en b13, en UNO de los cuadros b21–b23, en b33 y en b40. En b40 (la 5.ª vez) cambia el final: ES "Una luz, dos luces… ¡aquí están las luces!"   EN: "One light, two lights… there are the lights!"

PLAN DE PÁGINAS (14 páginas, 40 cuadros; ids EXACTOS; los cuadros son b01…b40 corridos, no se reinician por página)
| Pág. | template | Cuadros | Escena | Pregunta |
| p01 | book-1 | b01 | Atardecer en el jardín; Mila y Pipo salen con un frasco vacío. Estribillo. | — |
| p02 | four-up | b02, b03, b04, b05 | (1) jardín en penumbra, sin luces; (2) Mila mira el frasco vacío; (3) Pipo olfatea un rastro; (4) aparece Tito llorando: "¡Se apagaron!" | q01 |
| p03 | slant-2 | b06, b07 | (1) Tito explica: una nube gorda tapó la luna y las luciérnagas se escondieron; (2) Mila decide ir a buscarlas. Diálogo entre los tres (mínimo 3 turnos seguidos). | — |
| p04 | six-up | b08…b13 | Seis escenas rápidas del camino: (1) ¡Crac! (ramita); (2) ¡Splash! (charco); (3) ¡Uuuh! (búho); (4) ¡Pum, pum! (el corazón de Tito); (5) ¡Achís! (Pipo); (6) llegan al arroyo + ESTRIBILLO (b13). | — |
| p05 | slant-3 | b14, b15, b16 | Cruzan el puente de corteza de uno en uno: (1) el puente y el arroyo; (2) primero Tito; (3) después Pipo… y al final Mila. Cuentan: uno, dos, tres (con letras). | q02 |
| p06 | book-2 | b17, b18 | (1) Llegan al árbol hueco de la colina; baja Dora con un libro; (2) Dora dice la ADIVINANZA (la respuesta es "un libro"). | q03 |
| p07 | burst-2 | b19, b20 | Trueno. (1) La explosión central: SOLO "¡Pum!" repetido según el nivel (ver tabla); (2) Tito se esconde detrás de Mila. | — |
| p08 | (SIN template: página de solo texto) | b21, b22, b23 | Mila piensa en la adivinanza y descubre la respuesta (un libro). ESTRIBILLO en uno de los tres. | q04 |
| p09 | manga-6 | b24…b29 | Dora enseña en seis viñetas: (1) el libro abierto; (2) respirar hondo; (3) uno; (4) dos; (5) tres; (6) cantar bajito. | — |
| p10 | book-3 | b30, b31, b32 | Tres luciérnagas se encienden una tras otra: una, dos, tres. | q05 |
| p11 | bolt-2 | b33, b34 | Estalla la luz contando de cuatro a nueve (con letras): (1) cuatro, cinco, seis + ESTRIBILLO (b33); (2) siete, ocho, nueve. | — |
| p12 | two-up | b35, b36 | (1) Salen todas las luciérnagas y la nube se va; (2) Tito se ríe; ya no llora. Diálogo (mínimo 3 turnos seguidos entre personajes distintos). | q06 |
| p13 | three-up | b37, b38, b39 | Vuelven por el puente iluminados: (1) Pipo lleva el frasco lleno de luz; (2) cruzan de nuevo; (3) Mila entiende el mensaje. | — (sin pregunta) |
| p14 | full | b40 | Cierre: la casa y el jardín llenos de luces. ESTRIBILLO final (con el final cambiado). | q07 |

ESTRUCTURA DEL JSON (exacta)
{
  "id": "la-noche-sin-luces-<idioma>-n<nivel>",
  "familyId": "la-noche-sin-luces",
  "language": "<es|en>",
  "title": "<título en ese idioma, ≤ 60 caracteres>",
  "level": <1|2|3>,
  "description": "<1 frase, ≤ 200 caracteres>",
  "cover": { "src": "stories/la-noche-sin-luces/cover.webp", "width": 1536, "height": 1024, "alt": "<escena de la portada>" },
  "heroFocus": { "x": 25, "y": 68 },
  "reviewWords": ["<3 claves de vocabulary, cada una con 3 o más sílabas>"],
  "pages": [
    {
      "id": "p01",
      "illustration": { "src": "stories/la-noche-sin-luces/page-01.webp", "width": 1536, "height": 1024, "alt": "<la escena descrita>" },
      "template": "book-1",
      "blocks": [ { "id": "b01", "title": "<≤ 28 caracteres>", "voice": "narration" | "dialogue", "lines": ["<frase 1>", "<frase 2>"] } ],
      "checkpoint": { "id": "q01", "variants": [
        { "audience": "explorador", "prompt": "…", "options": [ { "text": "…" }, { "text": "…" }, { "text": "…" } ], "correctIndex": 0, "correctFeedback": "…", "retryFeedback": "…" },
        { "audience": "lector", "prompt": "…", "options": [ … ], "correctIndex": 0, "correctFeedback": "…", "retryFeedback": "…" }
      ] }
    }
  ],
  "vocabulary": { "<palabra en minúsculas, con acentos, sin puntuación>": { "syllables": ["…"], "definition": "<1 frase corta>", "synonym": "<opcional>" } }
}
- Las 14 páginas van con illustration.src "stories/la-noche-sin-luces/page-NN.webp" (NN = 01…14, la p08 también). La p08 NO lleva "template"; las demás llevan el de la tabla.
- "checkpoint" solo en p02, p05, p06, p08, p10, p12 y p14 (ids q01…q07 en ese orden). p01, p03, p04, p07, p09, p11 y p13 NO llevan "checkpoint".
- Las 6 variantes tienen exactamente el mismo esqueleto (mismos ids, template y rutas). Solo cambian id, language, level, title, description, textos, preguntas y vocabulario.

TABLA DE CARACTERES POR CUADRO (obligatoria)
Cuenta los caracteres CON espacios de todas las frases del cuadro juntas. Nunca pases del máximo; en N3 no bajes del mínimo.
Cada elemento de "lines" es UNA frase completa de ≤ 120 caracteres. Un cuadro admite de 1 a 4 frases.
Frases por cuadro: N1 = 1–2 (cortas, ≤ 45 caracteres cada una) · N2 = 2–3 · N3 = 3–4 (algunas largas).
| Cuadro | N1 máx. | N2 máx. | N3 (mín.–máx.) |
| b01 | 90 | 384 | 350–406 (lleva el estribillo: máximo posible 406 en ES / 407 en EN) |
| b02, b03, b04, b05 | 78 | 140 | 148–175 |
| b06 | 79 | 140 | 149–176 |
| b07 | 72 | 129 | 137–162 |
| b08, b09, b11, b12 | 49 | 87 | 92–109 |
| b10, b13 | 49 | 88 | 125–135 (SOBRECARGA A PROPÓSITO, solo en N3) |
| b14 | 90 | 300 | 319–376 |
| b15 | 73 | 130 | 138–163 |
| b16 | 78 | 140 | 148–175 |
| b17, b18 | 90 | 308 | 328–386 |
| b19 | 7 | 13 | 14–17 |
| b20 | 75 | 133 | 141–167 |
| b21, b22, b23 | página de solo texto: N1 = 3 frases en total (una por cuadro) · N2 = 4 frases en total · N3 = 6 frases en total (entre los tres cuadros; cada frase ≤ 120 caracteres; mínimo 1 frase por cuadro) |
| b24 | 69 | 124 | 131–155 |
| b25 | 81 | 145 | 154–182 |
| b26 | 47 | 84 | 89–105 |
| b27 | 90 | 179 | 190–224 |
| b28 | 88 | 156 | 166–196 |
| b29 | 63 | 112 | 119–141 |
| b30, b31, b32 | 90 | 228 | 242–285 |
| b33 | 78 | 140 | 148–175 |
| b34 | 76 | 136 | 145–171 |
| b35, b36 | 85 | 152 | 162–191 |
| b37 | 73 | 131 | 139–164 |
| b38 | 73 | 130 | 138–163 |
| b39 | 90 | 204 | 217–256 |
| b40 | 90 | 380 | 403–475 |
- b19 (la explosión): N1 = "¡Pum!" · N2 = "¡Pum! ¡Pum!" · N3 = "¡Pum! ¡Pum! ¡Pum!" (inglés: "Boom!", "Boom! Boom!", "Boom! Boom! Boom!"). Una sola línea de "lines".
- El estribillo mide 43–44 caracteres: en b13 de N1 es TODO el cuadro; en N2 y N3 va acompañado de frases cortas.
- Extensión total aproximada: N1 350–450 palabras · N2 700–950 · N3 1150–1400. Lo que manda es la tabla de caracteres.

PALABRAS Y FRASES "INCÓMODAS" (obligatorias en TODAS las variantes; naturales, sin forzar)
- Letras especiales (español): ü (cigüeña), ñ (niño, pequeño, otoño), vocales acentuadas, mayúscula acentuada al empezar frase (Él, Éramos, Ánimo), signos ¿ ¡ y rayas de diálogo PEGADAS a la palabra: "—¡Ánimo! —dijo Dora."
- Palabras muy largas (12+ letras): ES iluminadísimo, extraordinariamente, resplandeciente · EN extraordinary, unbelievably, illuminated.
- Palabras de una sola letra: ES y, a, o, e · EN I, a. Repeticiones dentro de un cuadro ("Pum, pum, pum", "más y más y más").
- Onomatopeyas cortas: ¡Crac! ¡Splash! ¡Uuuh! ¡Achís! ¡Pum! (EN: Crack! Splash! Whoo! Achoo! Boom!).
- Inglés: contracciones y apóstrofos (don't, can't, it's, Mila's, o'clock), mezclando apóstrofo recto (') y curvo (’).
- Números con LETRAS (nunca cifras), incluidos ordinales (primero, segundo, tercero) y de cuatro a nueve en p11.
- Diálogo con al menos 3 turnos seguidos entre personajes distintos en p03 y en p12, con raya de apertura y de cierre.
- Solo en N3: una frase de EXACTAMENTE 120 caracteres y un cuadro de 4 frases.

REGLAS DE FORMATO DEL TEXTO
1. Cada elemento de "lines" es UNA frase completa que se lee de una vez, ≤ 120 caracteres.
2. Ninguna "palabra" (lo que queda entre espacios) puede carecer de letras: nada de guiones o signos sueltos. Diálogo: —¿Tienes sed? —dijo Mila. / “Are you thirsty?” Mila asked.
3. Sin emojis ni símbolos; números con letras.
4. Vocabulario del nivel: N1 frases muy simples; N2 más desarrolladas; N3 más ricas, pero siempre fáciles de leer en voz alta sin trabarse.
5. "title" de cada cuadro ≤ 28 caracteres (es el rótulo de la miniatura).
6. "voice": "narration" o "dialogue" (informativo).

PREGUNTAS (7; una por página con pregunta; cada una con variante "explorador" y "lector")
| id | Página | Tipo | Nº de opciones | correctIndex (desde 0) | Notas |
| q01 | p02 | literal: quién lloraba | 3 | 0 | |
| q02 | p05 | secuencia: quién cruzó primero / al final | 3 | 2 | |
| q03 | p06 | literal: qué guarda Dora | 3 | 1 | en "lector" las opciones son LARGAS (≥ 60 caracteres cada una) |
| q04 | p08 | inferencia: cómo supo Mila la respuesta | 3 | 1 | "explorador": opciones muy cortas · "lector": razonamiento |
| q05 | p10 | secuencia: orden en que se encendieron las luciérnagas | 3 | 0 | |
| q06 | p12 | causa y efecto: por qué se encendieron | 3 | 2 | |
| q07 | p14 | tema / mensaje | 2 | 1 | la única con solo 2 opciones |
- "explorador" (6–8 años): pregunta literal cuya respuesta se ve en el dibujo; opciones cortas. "lector" (9–12): inferencia o causa/efecto.
- El correctIndex de la tabla vale para las dos variantes de esa pregunta: coloca la opción correcta en ese lugar.
- correctFeedback: confirma con calidez. retryFeedback: una PISTA amable y concreta que mande a releer un cuadro o página. NUNCA uses la palabra "incorrecto" / "incorrect" / "wrong". Sin tono de examen.

VOCABULARIO
- Cantidad mínima: N1 = 12 · N2 = 20 · N3 = 30 palabras. Cada clave debe aparecer escrita EXACTAMENTE igual (en minúsculas) al menos una vez en el texto de esa misma variante (si la clave es "luciérnaga", debe aparecer "luciérnaga" en singular en algún cuadro).
- La clave va en minúsculas, CON acentos y sin puntuación. Las sílabas unidas deben formar EXACTAMENTE la clave. Entre 2 y 8 sílabas (incluye iluminadísimo y extraordinariamente); incluye también alguna palabra de UNA sílaba (esa no puede ir en reviewWords).
- ES incluye, con sus sílabas: cigüeña (ci-güe-ña), niño, luciérnaga, adivinanza (a-di-vi-nan-za), oscuridad, parpadeó. EN incluye palabras equivalentes de dificultad.
- Al menos 8 con "synonym". "definition": una frase corta, del nivel de la variante y en su idioma.
- reviewWords (3, con 3 o más sílabas cada una): ES ["luciérnaga", "adivinanza", "oscuridad"] · EN ["adventure", "courageous", "illuminate"].

ANTES DE RESPONDER, COMPRUEBA (y corrige si algo falla)
1. Son 14 páginas y 40 cuadros (b01…b40) con los ids y templates de la tabla; p08 sin template; checkpoints solo en las 7 páginas indicadas.
2. Cada cuadro cumple su rango de caracteres de esta variante (cuenta uno por uno; solo b10 y b13 de N3 pueden pasar de su capacidad normal, hasta 135).
3. Ninguna frase pasa de 120 caracteres; ningún cuadro tiene más de 4 frases.
4. El estribillo está exacto 4 veces y la 5.ª con el final cambiado; b19 es solo "¡Pum!" según el nivel.
5. Están todas las palabras y frases "incómodas" y las 7 preguntas con su tipo, número de opciones y correctIndex.
6. El vocabulario cumple la cantidad y cada palabra aparece en el texto; reviewWords son 3 con 3 o más sílabas.
7. El JSON es válido: comillas dobles, sin comas finales, sin comentarios.
Devuelve únicamente el JSON.
```

---

## 2. Prompt de IMAGEN (una generación por página)

### 2.0 Antes: hoja de personajes
- Adjunta `content/el-puente-de-las-luciernagas/characters.webp` (Mila, Pipo, Tito). **Dora es nueva**: genera primero su hoja con este prompt y guárdala junto a las otras.

```text
Hoja de personaje, ilustración PLANA 2D estilo papel recortado, fondo crema liso. Dora, una cigüeña sabia y amable de una historia infantil: plumaje blanco, pico y patas naranja (#F29E4C),
gafitas redondas, una bufanda morada (#5B4B8A) y un libro grande de tapas azul noche (#1B2450) con una estrella amarilla en la portada. Vistas: frontal, 3/4, perfil, feliz, pensativa y sosteniendo el libro abierto.
Formas planas simples, contorno fino azul noche, sin texturas ni sombras volumétricas. SIN ningún texto ni letras.
```

### 2.1 Prompt base (pégalo en cada página, adjuntando la hoja de personajes y la guía de esa plantilla)

```text
Ilustración PLANA 2D estilo papel recortado, 1536×1024 (3:2), paleta fija: azul noche #1B2450, morado #5B4B8A, verde menta #8FD3B6, amarillo luz #FFD84D, naranja #F29E4C, crema #FDF6E6 y blanco.
Personajes IDÉNTICOS a las hojas adjuntas (Mila, Pipo, Tito, Dora), simplificados a formas planas. Fondo: un solo degradado de cielo y como máximo 3 elementos por viñeta (árbol, arbusto, piedra…).
Las luciérnagas son puntos amarillos con un halo suave.

COMPOSICIÓN: la imagen guía adjunta ES LA PLANTILLA. Cópiala EXACTAMENTE: las mismas viñetas (con sus diagonales, su rayo o su explosión si las tiene), del mismo tamaño y en el mismo lugar,
y los globos o tarjetas de texto en las mismas posiciones. NO muevas, NO deformes, NO agrandes, NO reduzcas y NO reinterpretes ninguna viñeta ni ningún globo. Los tonos grises de la guía son solo referencia: reemplázalos por la escena.
Separa las viñetas con canales blancos de ~18 px y un borde fino azul noche.
GLOBOS Y TARJETAS: rectángulos de esquinas redondeadas, fondo crema #FDF6E6 y borde azul noche #1B2450 de unos 5 px, SIN cola y completamente VACÍOS. (Si la guía trae una estrella de explosión, es una estrella de 14 puntas, crema con borde azul noche, vacía.)
No pongas caras, manos ni la acción principal dentro de los globos o tarjetas: los personajes van en la parte baja de su viñeta.

PROHIBIDO: cualquier texto, letra, número, onomatopeya, rótulo o marca de agua dibujados; texturas complejas; iluminación volumétrica; cambiar el diseño de los personajes.

ESCENA (viñeta por viñeta, en orden de lectura): <pega aquí la fila de la página>
```

### 2.2 Qué pegar en `ESCENA` y qué guía adjuntar, página por página

| Archivo | Adjuntar (además de las hojas) | ESCENA |
|---|---|---|
| `page-01.png` | `content/plantillas/book-1.png` | La ilustración ocupa toda la parte de arriba. Atardecer en el jardín (cielo naranja a morado), un árbol y un arbusto; Mila (con un frasco de cristal vacío) y Pipo salen por la puerta de la casa. La tarjeta crema de abajo, vacía. |
| `page-02.png` | `content/plantillas/four-up.png` | (1) Jardín en penumbra, sin ninguna luz, un arbusto y un árbol. (2) Mila mirando el frasco vacío, abajo. (3) Pipo olfateando el suelo, abajo. (4) Tito, el erizo, llorando, con lágrimas grandes, abajo. |
| `page-03.png` | `content/plantillas/slant-2.png` | Dos viñetas altas separadas por la diagonal. Izquierda: Tito abajo a la izquierda, señalando hacia arriba a una nube gorda y gris que tapa la luna (nube y luna a media altura). Derecha: Mila decidida con el puño cerrado, y Pipo a su lado, abajo a la derecha. |
| `page-04.png` | `content/plantillas/six-up.png` | Seis viñetas simples, UN personaje u objeto grande por viñeta y fondo de un solo color, nada en la franja de arriba. (1) Una ramita que se rompe bajo el pie de Mila. (2) Un charco con salpicaduras y Pipo cayendo. (3) Un búho grande de ojos amarillos en una rama. (4) Tito asustado con líneas de movimiento (su corazón late). (5) Pipo estornudando, con una nubecita. (6) La orilla del arroyo con un puente de corteza al fondo. |
| `page-05.png` | `content/plantillas/slant-3.png` | Arriba, viñeta ancha: vista del arroyo con el puente de corteza (dejando libre el globo de arriba a la izquierda). Abajo a la izquierda: Tito cruzando el puente, de frente. Abajo a la derecha: Pipo y Mila esperando su turno. |
| `page-06.png` | `content/plantillas/book-2.png` | Dos ilustraciones lado a lado, cada una con su tarjeta crema vacía debajo. Izquierda: el gran árbol hueco de la colina con Mila, Pipo y Tito frente a él. Derecha: Dora, la cigüeña, con su libro grande, saludando. |
| `page-07.png` | `content/plantillas/burst-2.png` | Dos viñetas apiladas. Arriba: cielo morado de tormenta con un relámpago amarillo. Abajo: Tito escondido detrás de Mila (Mila valiente al frente). La estrella central, vacía, cruza el canal entre las dos viñetas. |
| `page-08.png` | *(ninguna: sin plantilla)* | Una sola escena sencilla y sin globos ni tarjetas: Mila sentada pensando, con una bombilla amarilla sobre la cabeza y un libro cerrado a su lado, sobre un fondo liso de un solo color. |
| `page-09.png` | `content/plantillas/manga-6.png` | Seis viñetas de tamaños distintos con divisiones inclinadas. (1) Primer plano de un libro abierto con páginas brillantes, sin letras. (2) Mila respirando hondo, con las mejillas infladas. (3) Dora con UN dedo levantado. (4) Dora con DOS dedos. (5) Dora con TRES dedos. (6) Mila cantando bajito, con notas musicales dibujadas. |
| `page-10.png` | `content/plantillas/book-3.png` | Tres columnas altas, cada una con su tarjeta crema vacía debajo. En cada columna una luciérnaga que se enciende: la 1.ª con un brillo tenue, la 2.ª con brillo medio, la 3.ª con un halo grande y brillante. |
| `page-11.png` | `content/plantillas/bolt-2.png` | Dos escenas separadas por un divisor en forma de rayo. Arriba a la izquierda: seis luces amarillas que se encienden sobre un cielo azul noche. Abajo a la derecha: tres luces más, la nube alejándose y Mila y Pipo mirando el cielo. |
| `page-12.png` | `content/plantillas/two-up.png` | Dos viñetas altas. Izquierda: el cielo lleno de luces amarillas y la nube gris yéndose. Derecha: Tito riendo, con los ojos cerrados de alegría. |
| `page-13.png` | `content/plantillas/three-up.png` | Dos viñetas arriba y una ancha abajo. (1) Pipo lleva el frasco lleno de luz amarilla. (2) El puente de corteza iluminado y los personajes cruzándolo. (3) Ancha: Mila mirando un cielo lleno de luces. |
| `page-14.png` | `content/plantillas/full.png` | Una sola escena a página completa: la casa y el jardín llenos de puntos de luz amarilla bajo un cielo azul noche despejado. El globo ancho de arriba, vacío. |
| `cover.png` | *(ninguna)* | PORTADA sin globos ni tarjetas. Mila y Pipo abajo a la izquierda, mirando hacia arriba; el cielo azul noche con puntos de luz amarilla a la derecha y arriba. |

**Si una página sale mal** (viñetas movidas, globos deformados o con texto): vuelve a pedirla añadiendo *«La imagen guía es la plantilla exacta: copia sus viñetas y globos sin cambiar su forma ni su posición»*. Si aun así se desvía un poco, me la mandas igual: en el modo editor ajusto las cajas de texto a los globos que dibujó.
