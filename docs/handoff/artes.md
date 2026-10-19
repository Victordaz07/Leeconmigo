# HANDOFF — Arte y música
Actualizado: 2026-10-19 · Cuenta: A (por ahora) · Protocolo: `docs/14-MATERIAS-EN-PARALELO.md` · Decisión: D14 (`docs/DECISIONS.md`)
Tu materia es **Arte y música** (cuaderno `arte`, ya diseñado en D9, hoy «Pronto»). Los módulos de «Para la vida» son cuadernos aparte.

## Dónde estamos
- AR-01 ✅ Investigación recibida y copiada a `docs/research/` (`artes-investigacion.md`; `vida-8-modulos.md` y `vida-01/02/03-*.md` para los otros cuadernos).
- AR-02 ✅ `docs/design/artes/ESPECIFICACION.md`: lectura crítica, ajustes a React Native, arquitectura, pruebas técnicas, fases y decisiones `DA-1…DA-8` **para Victor**.
- AR-T1 ✅ **Audio aprobado en la tableta:** 4 corridas de 5 min (60/90/120/140 BPM), todas «parejo», 0 congelamientos, 0 pasos saltados. Queda una comprobación de 30 s: salir de la app a mitad de ritmo y volver, y detener/reanudar. Faltan 60 y 90 BPM para cerrarla.
  - `packages/music-engine` (34 pruebas): patrón de 8 pulsos × 4 filas, **catálogo de 16 sonidos sintetizados** en 4 familias (cada fila elige el suyo; `sounds.ts`/`synth.ts`, ESPECIFICACION §3b), secuenciador con anticipación sobre el reloj de audio, tempo que entra en el siguiente ciclo, solo/silencio, `FakeAudioOutput` y `PumpMonitor` (mide congelamientos del hilo de la interfaz).
  - `apps/mobile/src/audio/native-audio-output.ts`: salida real con `react-native-audio-api` (+ `react-native-worklets`).
  - Pantalla **Prueba de audio** en Ajustes de padres (tras el PIN): ritmo editable, **selector de 16 sonidos por fila (se oyen al tocarlos)**, tempo 60/90/120/140, volumen, «Prueba de 5 minutos», veredicto del adulto y resumen para pegar.
  - `app.json`: plugin `react-native-audio-api` **sin** permisos extra, **sin** servicio en primer plano, **sin** audio en segundo plano y **sin** FFmpeg (no se decodifican archivos). Al ir a segundo plano la prueba se detiene.
  - Verificada en el navegador (Chromium): arranca, el cursor avanza, 25 ms de media entre llamadas, 0 congelamientos. **No sustituye la prueba en la tableta.**

- AR-T2 🟡 **Prueba del lienzo construida, falta probarla en la tableta.**
  - `packages/art-content` (22 pruebas): `Drawing` (trazos terminados + un trazo activo), `beginStroke/extendStroke/endStroke`, **`cancelStroke`** (nunca deja un trazo colgado), `undo/redo/clearDrawing`, presión del lápiz (`widthAt`), camino suavizado (`strokePathData`), topes de memoria (500 trazos, 2000 puntos por trazo, 60 000 en total) y guardado validado (`toSaved/fromSaved`, para SQLite en AR-03).
  - `apps/mobile/src/screens/canvas-test-screen.tsx` + `canvas-surface.tsx` (Skia) y `canvas-surface.web.tsx` (respaldo SVG solo para el navegador). Pantalla en Ajustes de padres → «Probar el lienzo de dibujo»: colores, 3 grosores, goma, deshacer/rehacer/borrar, «Prueba de 60 segundos» con contadores (empezados = guardados + cancelados), cuadros lentos y veredicto.
  - Los toques usan el sistema de gestos de React Native (un segundo dedo cancela el trazo; segundo plano también); **no hizo falta `react-native-gesture-handler`**, así que no se agregó. Única dependencia nativa nueva: `@shopify/react-native-skia` 2.6.2 (la que fija Expo SDK 57).

## Siguiente paso exacto
1. **Victor compila un APK nuevo** (Skia es nativa) y en la tableta: Padres → Ajustes → «Probar el lienzo de dibujo» → «Prueba de 60 segundos»: dibuja sin parar con dedo y con lápiz si hay, prueba dos dedos a la vez y la palma apoyada, deshacer/rehacer, y pega el «Resultados». Fíjate sobre todo en: ¿la pantalla se mueve al dibujar hacia arriba/abajo?, ¿hay tirones?, ¿el trazo va pegado al dedo? (AR-T1 ya está aprobada.) Pasos originales de AR-T1: **Victor compila un APK nuevo** (hay dependencias nativas nuevas: `react-native-audio-api` y `react-native-worklets`; pasos en `apps/mobile/README.md`, `EXPO_PUBLIC_DEMO=1`, `npm run models` antes). En la tableta: Padres → Ajustes → «Probar el audio del taller». Hacer la **prueba de 5 minutos** a 60, 90 y 140 BPM (con audífonos y con altavoz) y pegar el «Resultados» en el chat.
2. Con ese resultado: si pasa (sin huecos ni arrastres, 0 congelamientos), seguir con AR-T2 (lienzo con Skia). Si falla, probar otro enfoque (muestras prehechas en bucle o motor propio) **antes** de construir talleres.
3. Pedir a Victor las decisiones `DA-1…DA-8` de la especificación.

## Cuidado con
- Lo compartido que se tocó en este paso (pedido a Victor, ya hecho con su OK): `apps/mobile/App.tsx` (ruta `audioTest`), `parent-settings-screen.tsx` (botón), `apps/mobile/package.json` (3 dependencias) y `app.json` (plugin). No editar más lo compartido sin avisar.
- Artes **no usa micrófono ni cámara**; las creaciones no salen del dispositivo (D1 por analogía).
- Los timbres son sintetizados: no agregar grabaciones ni bancos culturales sin permiso por escrito.
- Nunca nota al gusto ni por clics/efectos; estrellas por esfuerzo (D11).
- No hay APK hasta que Victor lo pida; él lo compila desde la app de Claude.

## Decisiones propuestas (Victor confirma; luego pasan a `docs/DECISIONS.md`)
`DA-1…DA-8` en `docs/design/artes/ESPECIFICACION.md` §10.

## Pedidos a lo compartido
_(ninguno pendiente)_

## Estado de pruebas
Al dejar este paso: `npm run typecheck` limpio y `npx vitest run` en verde.
