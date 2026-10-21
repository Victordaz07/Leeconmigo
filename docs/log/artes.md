# Bitácora — Arte y música

## 2026-10-19 · AR-01/AR-02/AR-T1: investigación, especificación y prueba técnica de audio
- Victor decidió (D14): Arte y música usa el cuaderno existente; cada módulo de «Para la vida» es un cuaderno aparte. Se copió la investigación a `docs/research/` y se escribió `docs/design/artes/ESPECIFICACION.md` (ajustes: web → React Native, dependencias nativas nuevas, timbres sintetizados, sin micrófono ni cámara).
- AR-T1: `packages/music-engine` (22 pruebas) con el secuenciador de ocho pulsos sobre el reloj de audio, y la pantalla «Prueba de audio» (Ajustes de padres) con `react-native-audio-api`. Plugin configurado sin permisos, sin servicio en primer plano y sin FFmpeg. En el navegador: 25 ms de media entre llamadas del planificador y 0 congelamientos.
- Pendiente: probarla en la tableta de Victor (5 min a 60/90/140 BPM) con un APK nuevo.

## 2026-10-19 · Catálogo de 16 sonidos
- Victor pidió que el niño elija entre 16 sonidos (había 4 fijos). Las filas pasan a ser pistas `a`–`d` y cada una elige su sonido (`Kit`); catálogo en 4 familias × 4 (tambores, cuerpo y voz, madera/metal/sonajas, con tono) en `packages/music-engine/src/sounds.ts` y `synth.ts`, todo sintetizado, notas en do mayor pentatónico. Pruebas: huella distinta por sonido, orden grave→agudo de los tambores, alturas de las notas por autocorrelación y Fourier, nombres ES/EN. Selector en la pantalla «Prueba de audio» con vista previa al tocar.

## 2026-10-19 · AR-T1: primer resultado en la tableta
- Victor compiló el APK y pegó el resultado de la corrida #3: **140 BPM · 5:00 · congelamientos 0 (hueco máx. 81 ms, media 33.3 ms) · pasos saltados 0 · segundo plano 0 · se oyó: parejo.** Es el tempo más exigente y pasa el criterio (sin huecos ni arrastres que se oigan).
- Falta registrar las corridas a 60 y 90 BPM (y la comparación auriculares/altavoz) para dar AR-T1 por cerrada.

## 2026-10-19 · AR-T1: audio aprobado en la tableta
- Cuatro corridas de 5:00 con el secuenciador real (`react-native-audio-api`), todas «parejo», 0 congelamientos y 0 pasos saltados: 60 BPM (hueco máx. 45 ms), 90 BPM (44 ms), 120 BPM (43 ms), 140 BPM (81 ms). Media de 33,3 ms entre llamadas en todas.
- **Veredicto: el enfoque de audio funciona; AR-T1 pasa en lo esencial (reproducción continua y pareja).** Queda como comprobación corta (30 s) lo que las corridas no ejercitaron («segundo plano» salió 0 en todas): salir de la app a mitad de ritmo y volver, y detener/reanudar.

## 2026-10-19 · AR-T2: lienzo de dibujo (código y pantalla de prueba)
- Victor aprobó DA-7. Se agregó `@shopify/react-native-skia` 2.6.2 (versión que fija Expo SDK 57). `react-native-gesture-handler` no hizo falta: los toques se manejan con el sistema de gestos de React Native (un segundo dedo o el segundo plano cancelan el trazo).
- `packages/art-content` (nuevo, 22 pruebas): trazos, trazo activo único, cancelar sin dejarlo colgado, deshacer/rehacer, goma, presión, camino suavizado, topes de memoria y guardado validado.
- Pantalla «Prueba del lienzo» (Ajustes de padres): prueba de 60 s con contadores y veredicto. Verificada en Chromium con el respaldo SVG (3 trazos, deshacer/rehacer, trazo con dedo puesto → 0 colgados, 0 cuadros lentos) y empaquetada para Android sin errores. 1586 pruebas en verde.
- Pendiente: probarla en la tableta con un APK nuevo.

## 2026-10-20 · APK demo 0.6.0 (audio de 16 sonidos + prueba del lienzo)
- Compilado en la nube desde `master` (4a4117d): `Kitewise-demo-0.6.0-arte-audio-lienzo.apk`, arm64-v8a + armeabi-v7a, ~238 MB (Skia, audio-api y worklets agregan ~140 MB; el AAB de tienda será mucho menor). Lleva `EXPO_PUBLIC_DEMO=1`.
- Dos cosas que hubo que resolver al compilar en la nube (no afectan a una PC con `npm install` normal):
  1. `npm install --ignore-scripts` no corre el `postinstall` de Skia: hay que correr `node node_modules/@shopify/react-native-skia/scripts/install-libs.js` (copia las librerías nativas a `libs/android`) o el CMake falla con «Skia prebuilt binaries not found».
  2. `react-native-worklets` usa el plugin `com.diffplug.spotless`, que solo existe en el portal de plugins de Gradle: el script `~/.gradle/init.d/maven-mirror.gradle` (fuera del repo) ahora añade `https://plugins.gradle.org/m2` a `pluginManagement`.
- Para compilar más rápido: `-PreactNativeArchitectures=arm64-v8a,armeabi-v7a` (por defecto Gradle también compila x86 y x86_64).

## 2026-10-20 · APK 0.6.0 se cerraba al abrir → Skia pasa a cargarse solo al abrir el lienzo
- Victor instaló el APK 0.6.0 y Android lo cerró al arrancar («Kitewise se cerró debido a que esta aplicación tiene un error»). No hay registro del error (`adb logcat`), así que la causa exacta no está confirmada. El único cambio nuevo respecto al APK anterior que sí funcionaba era Skia, que se importaba al arrancar (`App.tsx` → pantalla del lienzo → Skia): cualquier fallo al inicializar el módulo nativo mata la app entera.
- Arreglo (APK 0.6.1): `canvas-surface.tsx` carga Skia con `require` la primera vez que se abre un lienzo y, si falla, la pantalla muestra el mensaje de error en vez de cerrar la app. Así el resto de la app arranca igual que antes.
- Si 0.6.1 abre bien pero el lienzo falla, el mensaje de la pantalla es la pista; si se cierra al abrir el lienzo, hace falta `adb logcat -b crash` (Victor tiene depuración USB).

## 2026-10-20 · Skia se cierra al elegirlo; el lienzo pasa a SVG por defecto (APK 0.6.2)
- Grabación de pantalla de Victor con el APK 0.6.1: la app arranca bien (la carga diferida funcionó), pero al tocar «Probar el lienzo de dibujo» **se cierra** («Kitewise continúa fallando»). Es un fallo nativo al inicializar Skia (`System.loadLibrary("rnskia")`/`SkiaManager`), que `try/catch` de JS no atrapa. Sin `adb logcat` no hay causa; las librerías están completas (libreactnative, libc++_shared, NEEDED correctos, sin minificar).
- Decisión: el lienzo se prueba primero con el plan B de la especificación (**SVG** con `react-native-svg`, que la app ya trae), y Skia queda como motor opcional que el adulto elige. La pantalla muestra el motor en los resultados para comparar. Verificado en Chromium con SVG: 4 trazos, deshacer/rehacer, 0 colgados, 0 cuadros lentos.
- Para diagnosticar Skia: con el equipo conectado por USB, `adb logcat -b crash -d` justo después del cierre.

## 2026-10-20 · AR-T2: primer resultado con SVG en la tableta
- Corrida #1 (APK 0.6.2, motor SVG, 1:00): trazos empezados 14 / guardados 13 / cancelados 0 · en pantalla 13 (1969 puntos) · **cuadros lentos 0 (máx. 29 ms, media 16,7 ms)** · «colgados» 1 · veredicto del adulto: **todo bien**.
- Lectura: los 60 fps se sostienen con ~2000 puntos y 13 trazos; no se perdió ningún trazo (14 = 13 + el que seguía en curso cuando acabó el minuto). El «colgado 1» fue casi seguro ese trazo en curso al terminar la prueba con el dedo puesto, no un error: la métrica no distinguía los dos casos. Arreglado: ahora «colgado» exige que no haya ningún dedo en el lienzo, y se anota «terminó con el dedo puesto».
- Sin ejercitar todavía: dos dedos a la vez y palma (cancelados salió 0), lápiz, y que la pantalla no se mueva al dibujar (el veredicto «todo bien» sugiere que no).

## 2026-10-20 · AR-03: módulo Arte y música + proyecto editable + Taller libre de ritmo
- Victor: «Sigue con SVG y pasa a AR-03» (Skia queda opcional, sin bloquear). 
- `packages/art-content`: modelo `ArtLibrary/ArtProject/RhythmScene/ProjectVersion`, operaciones puras (crear, guardado automático, renombrar, duplicar, borrar, guardar/volver/borrar versión), validador y textos ES/EN. 37 pruebas (15 nuevas del proyecto + las 22 del lienzo).
- App: módulo `arte` (portada «Taller libre» / «N creaciones», inicio con Taller libre + creaciones, taller de ritmo con rejilla de 8 pulsos × 4 filas, 16 sonidos por fila, 4 velocidades con nombre, guardado automático, versiones, duplicar, borrar con confirmación). `useRhythmPlayer` reutiliza el motor de AR-T1.
- Verificación: typecheck limpio; 1601 pruebas en verde; Chromium: crear → marcar pulsos → cambiar sonido y velocidad → tocar → nombrar → dos versiones → volver a A → duplicar → borrar, sin errores de consola. En la web los dos tempos más rápidos tenían el mismo nombre («Rápido»): se separó en Lento/Medio/Rápido/Muy rápido (con prueba).
- Pendiente: probarlo en la tableta (APK nuevo, solo cuando Victor lo pida).

## 2026-10-20 · AR-04: unidad guiada A1-U04 «Mi banda deja respirar al silencio»
- Victor: «sigue con AR-04». Dominio puro en `packages/art-content` (`unit-model.ts`, `unit.ts`, `unit-copy.ts`): seis encuentros, lo que falta para darlos por hechos (verificable, sin «más cuadros = mejor»), avance guardado dentro de la biblioteca (opcional para no invalidar lo ya guardado), estrellas por esfuerzo (D11). 52 pruebas del paquete.
- App: `UnitPlayer` (los seis encuentros), `RhythmGrid` extraída y compartida con el Taller libre, `useRhythmPlayer` con `solo`, sección «Retos» en el inicio del cuaderno.
- La cápsula cultural del encuentro 6 es **inventada y rotulada** hasta que Victor confirme temas y fuentes.
- Verificado en Chromium de punta a punta: pista amable si el pulso no es el correcto, aviso si el silencio cae donde suena algo, dos versiones distintas, «Tu carpeta», 3 estrellas de esfuerzo, el inicio muestra «6 de 6 encuentros»; sin errores de consola.

## 2026-10-20 · Prueba de AR-03/AR-04 en la tableta (APK 0.7.0)
- Victor: el Taller libre y la unidad «funcionan bien, guardan y se sienten super bien»; en el ritmo, **«el lento es muy lento y no creo que lo necesitemos a menos que esté ligado a algún tutorial»**. Ningún encuentro de A1-U04 usa 60 BPM (la unidad va a 90), así que el taller pasa de 4 a 3 velocidades: Despacio (90), Medio (120), Rápido (140). El motor sigue aceptando 60–140 (la Prueba de audio de padres conserva 60; lo ya guardado a 60 sigue siendo válido).
- Observación de Victor: «en Arte y música por ahora solo tenemos el taller de música, no el de arte». Es lo previsto (AR-05 pintura y paleta, AR-06 collage y flipbook, AR-07 3D). El lienzo de AR-T2 (SVG) ya está validado en la tableta.

## 2026-10-20 · AR-05: taller de pintura y mezclador
- Victor: «sigue con esa propuesta y pasa a AR-05» (paleta con primarios + blanco y negro, sin que la app elija por el niño) y preguntó si hacía falta generar imágenes para que quede «bonito, llamativo y divertido desde que lo abran»: sí → `docs/design/artes/PEDIDO-IMAGENES.md` (22 archivos en 3 lotes: portada e inicio, 16 instrumentos, 8 objetos de pintura). La app no espera: usa dibujos hechos con código hasta que lleguen.
- Modelo de mezcla (`MODELO-MEZCLA.md`): cubo RYB con interpolación trilineal para los primarios + blanco/negro por peso de gotas; no promedia RGB (hay prueba); etiquetado como aproximación didáctica. Al escribirlo se corrigió una afirmación falsa del primer borrador (rojo+amarillo en RGB promediado SÍ da naranja; lo que falla es amarillo+azul).
- Pintura guardada como escena del proyecto (`PaintScene`) en un lienzo lógico fijo para verse igual al girar la tableta; la paleta guarda recetas (el color se calcula).
- Verificado en Chromium: pintar con 3 colores, mezclar rojo+amarillo → naranja (`#FF8000`), guardarlo y pintar con él, deshacer/rehacer, nombrar, volver a abrir (3 trazos, 6 colores), borrar; sin errores de consola.

## 2026-10-20 · Lote A de imágenes de Arte y música conectado
- Victor mandó `KiteWise_Arte_Lote_A_7_Imagenes.zip` (7 PNG de GPT, 1536×1024 y 1024×1536). Revisadas una por una: sin texto, el centro de los fondos despejado, la mitad derecha de `hero_arte_inicio` despejada (crema uniforme `#FEF7EA`), espacio vacío a propósito entre instrumentos en `cover_a1_u04`.
- `scripts/arte-imagenes.py` los convierte a WebP (535 KB en total) y escribe el manifiesto con el SHA-256 de los originales (`docs/design/artes/arte/manifest-lote-a.json`; los PNG no se guardan en el repo). Prueba (`packages/art-content/tests/arte-art.test.ts`) que el manifiesto, los archivos y los tamaños cuadran.
- Conectado: portada de la estantería (antes un cuadro con una ♪), inicio del cuaderno con el estudio a la izquierda y los botones sobre la mitad crema (en teléfono, la imagen arriba y los botones debajo), miniatura en la tarjeta de A1-U04 y fondos de ritmo y pintura (horizontal/vertical según el giro). Los encabezados llevan un fondo crema translúcido para leerse sobre el fondo. En el teléfono, «Guardado» se acorta a ✓.
- Verificado en Chromium en tableta horizontal, tableta vertical y teléfono; sin errores de consola.

## 2026-10-20 · Lotes B y C de imágenes conectados (23 de 24)
- Victor pidió los prompts de los Lotes B y C (se los di en el chat) y mandó `KiteWise_Arte_Lotes_B_C_24_PNG.zip`. El zip se descomprime sin errores, pero **`snd_pisada.png` está cortado** (PNG incompleto): se omite y hay que volver a generarla. Las otras 23 se revisaron una por una (fondo transparente limpio, objeto centrado, sin texto ni caras).
- `scripts/arte-imagenes.py` ahora omite y avisa de las imágenes dañadas y reduce los objetos a 512×512 (se ven a menos de 100 px; 809 KB en total). Manifiestos `manifest-lote-b.json` y `-c.json`; la prueba de `art-content` comprueba que los tres manifiestos, los archivos y los tamaños cuadran.
- Conectado: botón de sonido de cada fila y selector de sonidos con su dibujo (sin dibujo, solo el nombre); en pintura, pinceles fino/medio/grueso, goma, paleta junto a «Tus colores», vaso junto a «Mezclar pinturas» y el bote de pintura como cada «pintura» del mezclador (la gota de color va sobre el bote blanco; no se tiñe el bote).
- Corregido de paso (venía de AR-03): en un teléfono la rejilla de ritmo se salía de la pantalla (el pulso 8 quedaba cortado). Ahora el botón del sonido se estrecha y la tarjeta usa menos margen; caben los ocho pulsos en 390 px.
- Verificado en Chromium en tableta y teléfono; sin errores de consola.

## 2026-10-20 · `snd_pisada` recibida: Tanda 1 de imágenes completa (31 de 31)
- La primera copia de `snd_pisada` llegó cortada dentro del zip del Lote B; Victor la pegó en el chat (solo se veía, no había archivo que abrir) y luego la mandó como `snd_pisada.zip`: PNG válido, 1254×1254, fondo transparente limpio. Convertida a WebP (512×512, 45 KB) con `scripts/arte-imagenes.py … lote-b2` y conectada a `SOUND_ART`: los 16 sonidos tienen su dibujo.
- Lección para próximos lotes: las imágenes pegadas en el chat no llegan como archivo; mandarlas en `.zip`.

## 2026-10-20 · Mezclador: el botón de quitar una gota ahora dice «Quitar»
- Victor, probando el APK 0.8.0, preguntó para qué era la casilla gris con un «−» debajo del nombre de cada pintura: era el botón de quitar una gota, pero un cuadrito gris con una raya, sin palabra, no se entendía (sobre todo para 1.º y 2.º). Ahora dice «− Quitar» (EN: «− Remove»), es más ancho, queda pegado al bote y se apaga cuando esa pintura tiene 0 gotas. Verificado en Chromium (teléfono): quitar un rojo baja de 2 a 1 gota; «Quitar» de una pintura sin gotas está desactivado.

## 2026-10-20 · AR-05b: unidad A2-U02 «Colores que se relacionan»
- Dominio puro en `packages/art-content` (`unit2-model.ts`, `unit2.ts`, `unit2-copy.ts`, pruebas `unit2.test.ts`): proyecto de pintura con dos cuadros, paleta de 4 colores elegida entre los guardados (incluye uno mezclado), «los dos cuadros usan solo esa paleta» y «son distintos entre sí» como evidencia verificable, estrellas por esfuerzo. `ArtLibrary.units` ahora admite las dos unidades (cada una con su validador).
- Interfaz: se extrajeron `PaintArea` (lienzo + paleta + pincel + deshacer/rehacer/borrar) y `PaintMixer` del Taller de pintura para reutilizarlos; nuevo `unit2-player.tsx` y `mini-paint.tsx`. Tarjeta nueva en «Retos» (de momento con un recuadro de cuatro azules hecho con código, sin imagen).
- Verificado en Chromium (tableta y teléfono) de punta a punta: pista suave al señalar la paleta B, el quinto color no entra, sin «incorrecto», 3 estrellas al final, se queda en «6 de 6 encuentros»; el Taller de pintura sigue igual tras la extracción. Las opciones largas se salían de la tarjeta en el teléfono: corregido (también en A1-U04).

## 2026-10-20 · AR-06a: Taller de collage
- Victor aprobó seguir con el collage («funciona perfecto» sobre A2-U02). Dominio puro `collage.ts` + `collage-copy.ts` + pruebas; proyecto de collage en `project.ts` (escena nueva, validación, duplicado sin compartir piezas).
- Interfaz: `CollageArea` (reutilizable para la unidad A1-U06) y `CollageWorkshop`. Verificado en Chromium (tableta y teléfono): pegar, recolorear, arrastrar, agrandar, girar, capas, copiar, cambiar fondo, deshacer/rehacer, salir y reabrir (queda guardado).
- Pendiente de probar en la tableta real: arrastre con lápiz y el segundo dedo (cancela el arrastre).

## 2026-10-20 · AR-06b: unidad A1-U06 «Una historia de recortes»
- Elegida de la investigación (§10: «Ordenar piezas y escenas para contar algo»; no estaba entre los 6 retos desarrollados, así que los encuentros son diseño propio, en el mismo patrón que A1-U04 y A2-U02). Un collage de cuatro cartones (tres de historia y uno para probar piezas). Lo verificable: orden de las escenas, piezas por escena, y que algo cambie entre escenas seguidas (por `id` de pieza: movió, apareció, creció).
- Verificado en Chromium (tableta y teléfono) de punta a punta; pista suave con un orden equivocado; «Cuéntala» dice si el cambio elegido se ve en las escenas sin bloquear; 3 estrellas al final; sin errores de consola.

## 2026-10-21 · Informe de mejoras de Arte y música recibido
- Victor: «se ve super básico». Le di un prompt de súper investigación; devolvió `Kitewise_Arte_Musica_Investigacion_2026-10-21-1.md` (~82 KB, 39 fuentes), copiado a `docs/research/artes-mejoras-2026-10-21.md`.
- Lectura crítica en `docs/design/artes/PLAN-MEJORAS.md`: se adopta mesa de creación, materialidad sin Skia, tres pinceles, Mi museo, observar→probar→decidir, jugo moderado; se corrige o pospone lo que depende de decisiones de Victor (guía «Ms. Rosa», estilo gouache apagado vs. el vivo de la Tanda 1, texto en obras reales).
- Hallazgo verificado: el manifiesto trae `allowBackup="true"` (copia de seguridad de Android) → pedido a lo compartido. `RECORD_AUDIO` es de Lectura; Arte no lo usa.
- Tanda 2 de imágenes (17: materiales, adornos, museo) preparada en `PEDIDO-IMAGENES.md`, sin pedir todavía.

## 2026-10-21 · Decisiones por delegación + AR-M1 (parte de código)
- Victor delegó: «puedes decidir tú y luego lo verificamos… vivo, divertido, pero funcional» y pidió que los prompts de imágenes se den siempre en el chat. Decididas DA-5 (guía = la cometa sin cara) y DA-9…13 (estilo vivo; obras con inscripciones tal cual en vista aparte; Mi museo solo en el dispositivo; avisar y nunca borrar en silencio). Tanda 2 reescrita en estilo vivo (marcos y carpetas de colores; papeles neutros).
- Código de la Etapa 1 que no necesita imágenes (ver handoff). Verificado en Chromium (tableta y teléfono).
- Bug visto de paso: las tarjetas de «Retos» en teléfono (texto en una columna de ~60 px) → corregido.

## 2026-10-21 · Tanda 2 de imágenes recibida y conectada al collage
- Victor mandó `KiteWise_Arte_Tanda_2_17_Imagenes.zip` y el zip del Lote 2-A (los mismos 6 papeles). Revisión: 17 de 17 válidas, sin texto, papeles sin costuras, alfa limpio; los marcos vinieron 1536×1024 (3:2), así que `scripts/arte-imagenes.py` ahora mide el hueco de cada marco y lo guarda en el manifiesto.
- Collage: nuevos papeles de material (kraft, fibras, cartón, seda) y fondos (kraft, cartón) + texturas en crema y blanco. Seda con translucidez. Dominio: `MATERIAL_PAPERS`, ids nuevos en `PAPER_COLORS`/`BACKGROUNDS` (lo guardado antes sigue siendo válido). 132 pruebas del paquete.
- Verificado en Chromium. Aprendizaje: los identificadores de `ClipPath` deben ser únicos en toda la pantalla (miniaturas), por eso llevan un prefijo con `useId`.

## 2026-10-21 · «Guardar en mi cuaderno» en los cierres + grano de papel en la pintura
- `ClosingCard` acepta `notebook` (frase corta → idea de Mi cuaderno con la materia de la sesión; misma regla de 3 por día y aviso si está lleno). Conectado en Lectura, Ciencia y Sociedad con `notebookSaverFor` (`apps/mobile/src/notebook-save.ts`). Verificado en Chromium: guarda en `kitewise.v1.mi-cuaderno.<niño>`.
- Pintura: capa de fibras de papel (22 %) ENCIMA de los trazos, ignorada por el toque; así la goma (que pinta del color del papel) no deja una mancha lisa. Los colores siguen limpios.

## 2026-10-21 · AR-M2 «Mi museo»
- Dominio `museum.ts` (+ `museum-copy.ts`, 6 pruebas): marco por obra (`frame?` opcional en `ArtProject`; si falta, se deduce del id y es estable), `setFrame`, `museumWorks` (recientes primero, filtro por tipo; nunca «la mejor»).
- Pantalla `museum-screen.tsx`: pared con banderines, obras enmarcadas (la miniatura va ENTERA dentro del hueco medido del marco), placa con el título y 4 botones de color para cambiar de marco, filtros con las carpetas. Toca una obra → abre su taller; al volver regresa al museo. Entrada desde el inicio de Arte (aparece cuando hay creaciones).
- Verificado en Chromium (tableta y teléfono). Sin exportar nada fuera del equipo (DA-12).
