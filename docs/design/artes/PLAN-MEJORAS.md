# Plan de mejoras de Arte y música (de «funciona» a «se siente como un taller»)

> Origen: Victor dijo «se ve super básico» (2026-10-21) y pidió una súper investigación. Resultado completo (con fuentes) en
> `docs/research/artes-mejoras-2026-10-21.md`. Este documento la **adapta al repo**: qué se adopta, qué se corrige o se pospone, en qué orden
> se construye y qué le toca decidir a Victor. Las decisiones son propuestas `DA-9…` hasta que Victor las confirme.

## Diagnóstico (lo que Victor ve, y por qué)
1. Piezas, pinceles y fondos **planos y lisos**: no hay materialidad (papel, bordes, sombras).
2. Las unidades son **tarjetas con texto y botones**; crear parece un premio posterior a contestar.
3. **No hay dónde ver lo creado** (solo una lista de títulos): falta «Mi museo».
4. Casi **sin respuesta** al tocar (ni un roce de sonido, ni asentarse al soltar).
5. Pocas herramientas **que se distingan** (3 grosores no son 3 pinceles).
6. Ninguna obra real de artista (hoy solo una nota «Pronto…»).

## Lo que el informe acierta y adoptamos
- **Mesa de creación:** obra grande, pocas herramientas a la vista, ayuda contextual; no catálogos abiertos a la vez.
- **Materialidad sin Skia:** texturas como imágenes + recortes/sombras con `react-native-svg` (ya es nuestro motor). Papel real, bordes rasgados generados una vez (deterministas), sombra aproximada.
- **Tres pinceles que de verdad se comportan distinto** (marcador, crayón, lavado), con muestra antes de elegir.
- **Mi museo** (galería privada: continuar, duplicar, versiones, marcos), sin contadores, corazones ni «obra de la semana».
- **Encuentros = observar → probar → decidir → crear → revisar**, con una obra auténtica y preguntas abiertas.
- **Jugo que informa, no que distrae:** asentarse al soltar, roce de papel; efectos / vibración / movimiento por separado; «reducir movimiento» manda.
- **Enfoque = quitar decoración**, no desenfocar.
- Frases de la guía: reconocer acciones reales, preguntar, nunca «eres un genio» ni «perfecto».

## Lo que corregimos o posponemos (no se aplica tal cual)
| Del informe | Por qué no tal cual |
|---|---|
| «Ms. Rosa» como guía | No está en el repo (solo en la guía visual de Victor). **No se produce nada de personaje hasta que Victor confirme** (DA-5). Alternativa: la cometa como señal de ayuda, sin cara. |
| Estilo «gouache apagado» (crema/ocre/terracota/salvia) de `GUIA_ARTE_IDENTIDAD_VISUAL.md` | Todo el arte hecho hasta hoy (Tanda 1, 31 imágenes) es **vivo y alegre** (coral, violeta, turquesa). Mezclar los dos estilos desentona. **Decisión DA-9.** Las texturas de papel (Tanda 2) son neutras y sirven a los dos. |
| Texto original dentro de obras reales (firmas, inscripciones, partituras) | Choca con «nunca texto en imagen» (que vale para ilustración propia). **Decisión DA-10:** vista cultural separada que muestra la obra tal cual, o solo obras sin inscripciones visibles. |
| Flipbook y relleno de regiones | Apuestas grandes: después de museo y rendimiento (el informe también lo ordena así). |
| Pasar de 16 a pocos sonidos | Ya están todos disponibles; lo que se hace es **mostrar pocos primero** y dejar el resto en una bandeja «Más». |

## Dos hallazgos del informe que tocan lo ya construido (verificados en el repo)
1. **Copia de seguridad de Android:** el manifiesto generado trae `android:allowBackup="true"` (`apps/mobile/android` es generado, sin versionar; `app.json` no lo desactiva). Con eso Android puede subir el progreso y las creaciones de los niños a Google Drive. Eso choca con D1/`docs/12` («nada sale del dispositivo»). **Pedido a lo compartido** (es `app.json`/`app-state`, no mío): poner `"android": { "allowBackup": false }` (y revisar el equivalente en iOS) antes de publicar. Anotado en `docs/handoff/artes.md`.
2. **Micrófono:** `RECORD_AUDIO` está declarado a nivel de app porque lo usa Lectura (Whisper). Arte **no** pide el micrófono ni muestrea audio (se anima con eventos del secuenciador, no con análisis de audio). Mantenerlo así.

## Orden de construcción (IDs en `docs/ROADMAP.md`)
Regla del informe que adoptamos: **el salto debe sentirse también con sonido y movimiento apagados** y **primero lo recuperable (guardar), después lo bonito**.

| Etapa | Qué | IDs | Necesita imágenes |
|---|---|---|---|
| 0 | Base recuperable: cerrar y reabrir la app a mitad de una obra en la tableta; tamaños táctiles | AR-M0 | no |
| 1 | **Materialidad y claridad:** papel de dibujo bajo el lienzo, bandeja de materiales con muestras («Más…»), selección con contorno doble y asas grandes, barra de herramientas de la pieza junto al cartón en teléfono, celdas vacías legibles en el ritmo, guardado honesto con miniatura | AR-M1 | **Tanda 2-A** |
| 2 | **Mi museo:** galería con miniaturas, continuar, duplicar, versiones (sin perder nada), marcos | AR-M2 | Tanda 2-C |
| 3 | **Profundidad:** tres pinceles distintos, simetría y duplicar, papeles con textura y borde rasgado en el collage, una obra real por unidad (con créditos), comparación A/B de ritmo | AR-M3 | Tanda 2-A/B, obras (licencias) |
| 4 | Una sola apuesta grande a la vez: flipbook (AR-06c) **o** recorte libre **o** mezcla avanzada | AR-M4 | según elegida |

Cada etapa se cierra con una prueba de 3–5 niños (sin cámara ni grabación: notas sin nombres) y con estas salidas del informe: todos recuperan su trabajo; ningún control pierde algo irrecuperable; el niño mayor reconoce el espacio como suyo; la primera acción creativa no depende de una explicación larga.

## Imágenes (Tanda 2) — ver `PEDIDO-IMAGENES.md`
17 imágenes en tres lotes (materiales, cinta/recortes de adorno, museo). **No se generan pantallas, botones ni personajes.** Los bordes rasgados de cada pieza del collage se calculan en código (una vez por pieza, guardados), no con una imagen por pieza.

## Decisiones propuestas para Victor (`DA-9…`)
- **DA-9** ¿Un solo estilo para Arte? (a) Mantener el **vivo y alegre** de la Tanda 1 y hacer los materiales neutros; (b) pasar a la guía «gouache apagado» y rehacer portadas/fondos más adelante; (c) vivo para 1.º–4.º y más sobrio («cuaderno de artista») para 5.º–6.º. *Recomendación: (a) ahora, (c) después de probar con un niño de 5.º–6.º.*
- **DA-10** Obras reales con inscripciones: ¿vista cultural separada que las muestra tal cual, o solo obras sin texto visible?
- **DA-11** ¿Selección inicial de reproducciones abiertas (Met, AIC, Smithsonian) y presupuesto después para creadores dominicanos, latinos y de la Bahía?
- **DA-12** «Mi museo»: ¿solo para mirar en el dispositivo, o exportar un archivo con control de un adulto?
- **DA-13** Almacenamiento: tope de obras y qué pasa al acercarse (avisar, nunca borrar en silencio).
- **DA-14** ¿Quién revisa los encuentros piloto y acompaña la prueba con 3–5 niños?
- (Ya abiertas) **DA-5** guía de Artes; **DA-1…8** de `ESPECIFICACION.md` §10.

## Qué no cambia
Privacidad (nada sale del dispositivo, sin micrófono ni cámara en Arte), sin notas ni puntos, estrellas por esfuerzo (D11), Modo Enfoque por el padre (D4), arte y texto separados, cada unidad en su módulo.
