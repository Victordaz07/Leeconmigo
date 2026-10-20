# Pedido de imágenes — Arte y música (prompts listos para pegar en GPT)

> **Estado (2026-10-20):** **Lote A recibido y conectado (7 de 7)** → convertido a WebP en `apps/mobile/assets/arte/` (535 KB en total) con
> `scripts/arte-imagenes.py`; manifiesto con el SHA-256 de los originales en `docs/design/artes/arte/manifest-lote-a.json`; conectado en
> `apps/mobile/src/subjects/arte/art.ts`: portada del cuaderno (estantería de Inicio), inicio del cuaderno (`hero_arte_inicio`, su mitad despejada
> es el crema `#FEF7EA` de la tarjeta), portada de A1-U04 y fondos de ritmo y pintura (horizontal y vertical). Revisadas: sin texto, centro despejado,
> espacio vacío a propósito en `cover_a1_u04`.
> **Lotes B y C recibidos (2026-10-20): 23 de 24 conectadas.** Lote C (8 objetos de pintura) completo; Lote B (instrumentos) **15 de 16: falta `snd_pisada`**
> (el PNG llegó cortado dentro del zip y no se puede leer: hay que **volver a generarla**; `scripts/arte-imagenes.py` avisa de las dañadas y la omite).
> Convertidas a 512×512 (se ven a menos de 100 px): 611 KB (B) + 198 KB (C). Manifiestos `manifest-lote-b.json` y `manifest-lote-c.json`.
> Conectadas en `subjects/arte/art.ts` (`SOUND_ART`, `PAINT_ART`): cada sonido tiene su dibujo en el botón de la fila y en el selector; los pinceles, la goma,
> la paleta, el bote y el vaso están en el taller de pintura. `prop_esponja` queda reservada para los sellos y estampas. **Sin dibujo de «Pisada»
> la interfaz muestra solo el nombre** (funciona igual). Para conectar la que falte: `python3 -I scripts/arte-imagenes.py <carpeta> lote-b2` y agregarla a `SOUND_ART`.
> **Para quién:** Victor genera las imágenes y las sube al chat; Claude las convierte a WebP, las nombra y las conecta (igual que en Ciencia).
> **Si solo se hace una parte, hacer primero el Lote A** (portada + inicio): es lo que se ve al abrir el cuaderno.

## Regla de oro (la misma de Matemáticas y Ciencia)
La imagen es **escena y adorno**, no interfaz. Los colores de la paleta, los pulsos, las casillas y todo texto los dibuja la app.
- **Cero texto, letras, números ni notas con letras** en ninguna imagen.
- **Sin personas ni personajes** en esta tanda (la guía de Artes está pendiente: DA-5). Instrumentos, pinturas y objetos sí.
- **En los fondos, el centro queda despejado** (ahí va la rejilla o el lienzo).
- **Cada objeto suelto es UNA sola pieza**, fondo transparente, centrada, que se entienda a 48 px.
- Nada que parezca una marca real ni un instrumento «de una cultura concreta» presentado como auténtico: instrumentos genéricos, amables.

## Estilo común (pégalo al inicio de CADA prompt)
> Ilustración de cuento para una app educativa infantil (6–12 años), acuarela digital cálida, **colores vivos y alegres** (coral #FF6B5E, naranja #FF9A3C, rosa #FF5F8A, violeta #9A7DDB, turquesa #35B8C6, amarillo #FFD23F) sobre crema #FFF8EC. Formas redondeadas, contornos suaves, luz cálida, un toque de salpicaduras de pintura y notas musicales sin letras. Divertida y llamativa desde el primer vistazo. Sin texto, sin letras, sin números, sin marcas de agua.

Formato: fondos y portadas **1536×1024** (horizontal) y fondos de taller también **1024×1536** (vertical); objetos **1024×1024** con fondo **transparente**.
Envíalos en un `.zip` con los nombres exactos de la primera columna.

---

## Lote A — portada e inicio (lo primero que se ve) · 6 imágenes

| Archivo | Prompt (después del estilo común) | Dónde se usa |
|---|---|---|
| `cover_arte_cuaderno` (1536×1024) | La portada del cuaderno de Arte y música para una estantería: un tambor redondo, un pincel grande y una paleta de pintura llena de colores vivos, con salpicaduras de pintura y 3 notas musicales flotando, composición centrada y simple, con margen alrededor, sobre un degradado suave coral→rosa. **Sin ningún texto.** Reconocible en una miniatura de 200×140. | Estantería de Inicio (hoy es un cuadro de color con una ♪) |
| `hero_arte_inicio` (1536×1024) | Un estudio de arte y música alegre visto de frente: una mesa larga con botes de pintura, pinceles, un tambor y una marimba pequeña, rayos de luz cálida y papelitos de colores en el aire. **La mitad derecha queda despejada** (superficie lisa crema) porque ahí la app pone los botones. | Inicio del cuaderno «Arte y música» |
| `bg_arte_ritmo_horizontal` y `bg_arte_ritmo_vertical` | Un escenario de música visto de frente con un telón de colores suaves a los lados, luces cálidas y notas musicales sin letras en los bordes. **El centro y la parte de abajo quedan despejados** (piso liso de madera clara) porque ahí va la rejilla del ritmo. Poco contraste. | Fondo del taller de ritmo y de la unidad |
| `bg_arte_pintura_horizontal` y `bg_arte_pintura_vertical` | Una mesa de pintura de madera clara vista desde arriba con salpicaduras de acuarela de colores en las esquinas y un cuadro de papel crema vacío. **El centro queda despejado** (papel liso crema, sin dibujos) porque ahí va el lienzo. Poco contraste. | Fondo del taller de pintura |
| `cover_a1_u04` (1536×1024) | Un grupo de instrumentos (un tambor, unas maracas, unas claves y una campanita) alineados como una banda, con un **espacio vacío a propósito** entre dos de ellos, rodeado de un aire tranquilo, con una nota musical flotando. Encuadre centrado, margen alrededor. Sin texto. Reconocible en miniatura de 200×140. | Portada de la unidad «Mi banda deja respirar al silencio» |

> (`bg_…` cuentan como 2 archivos cada uno: horizontal y vertical.)

## Lote B — los 16 instrumentos y sonidos (objetos 1024×1024, transparente, una sola pieza)

Son los mismos 16 sonidos del taller; así cada botón de sonido tiene su dibujo. Cada uno: **un solo objeto**, centrado, bien reconocible a 48 px, vista de frente, colores vivos.

| Archivo | Prompt (después del estilo común) |
|---|---|
| `snd_bombo` | Un bombo grande y redondo, vista de frente, con parche crema y aro de color coral y una maza de punta blanda al lado. |
| `snd_tom` | Un tambor medio redondo (tom), parche crema, cuerpo violeta, con dos baquetas cruzadas. |
| `snd_bongo` | Un par de bongós pequeños unidos, uno más alto que el otro, madera cálida y parche crema. |
| `snd_caja` | Una caja de tambor chata con un aro metálico brillante y dos baquetas encima. |
| `snd_palmas` | Dos manos de dibujo animado (tono de piel cálido neutro) aplaudiendo, con tres rayitas de energía alrededor. |
| `snd_chasquido` | Una mano de dibujo animado haciendo un chasquido de dedos (pulgar y dedo medio), con dos chispitas alrededor. |
| `snd_pisada` | Una zapatilla de dibujo animado pisando fuerte el suelo, con una nubecita de polvo y rayitas de impacto. |
| `snd_voz` | Una boca grande y feliz cantando, abierta en forma de «o», sin dientes marcados ni cara completa, con tres ondas de sonido saliendo y una nota musical. Sin letras. |
| `snd_claves` | Dos palitos de madera (claves), uno cruzado sobre el otro, madera cálida. |
| `snd_bloque` | Un bloque de madera hueco, rectangular, con una ranura, y una maza pequeña al lado. |
| `snd_triangulo` | Un triángulo de metal brillante colgado de un cordón, con un palillo metálico al lado y unas chispitas de brillo. |
| `snd_sonaja` | Un par de maracas redondas con mango, coloridas, con unos granitos saltando alrededor. |
| `snd_marimba` | Una marimba pequeña de seis placas de madera de colores (de más largas a más cortas) con dos mazas. |
| `snd_campanita` | Una campanita clara de metal dorado con un lazo, con dos rayitas de sonido. |
| `snd_cuerda` | Un instrumento de una sola cuerda (como un arco musical de juguete) con la cuerda vibrando, madera cálida. |
| `snd_bajo` | Un instrumento de cuerdas muy grande y panzón, grave y amable (como un contrabajo de juguete), color madera cálida, con su arco al lado. |

## Lote C — pintura (objetos 1024×1024, transparente, una sola pieza)

| Archivo | Prompt (después del estilo común) |
|---|---|
| `prop_pincel_fino` | Un pincel con la punta muy fina, mango largo de madera, cerdas con un poquito de pintura. |
| `prop_pincel_medio` | Un pincel con la punta redonda de tamaño medio, mango de madera, un poquito de pintura. |
| `prop_pincel_grueso` | Un pincel ancho y grueso, mango corto de madera, cerdas anchas con un poquito de pintura. |
| `prop_goma` | Una goma de borrar rosa de bordes redondeados, vista de lado, con migajitas al lado. |
| `prop_paleta` | Una paleta de pintor de madera clara con forma de riñón y un agujero para el pulgar, **vacía** (sin pintura) porque la app pone los colores. |
| `prop_bote_pintura` | Un bote de pintura de plástico blanco, abierto, vista de frente, con la boca vacía y un goterón blanco por fuera. (La app lo tiñe del color que el niño elija: que el cuerpo sea **blanco o gris muy claro**.) |
| `prop_vaso_agua` | Un vaso transparente con agua y un pincel adentro, agua con un poco de color. |
| `prop_esponja` | Una esponja de pintura amarilla con huequitos, vista de lado. |

---

## Cómo se conectan
- Convertidas a WebP en `apps/mobile/assets/arte/` (`covers/`, `bg/`, `snd/`, `props/`) con un script como `scripts/ciencia-arte.py`; manifiesto con el SHA-256 de los originales (los PNG no se guardan en el repo).
- `apps/mobile/src/subjects/arte/art.ts` mapea cada nombre a su imagen; si una falta, la app usa el dibujo provisional hecho con código.
- Aceptación: sin texto incrustado · centro despejado en fondos · objetos con transparencia limpia · legible en miniatura · peso < 350 KB cada una.
