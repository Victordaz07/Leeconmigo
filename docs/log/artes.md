# Bitácora — Arte y música

## 2026-10-19 · AR-01/AR-02/AR-T1: investigación, especificación y prueba técnica de audio
- Victor decidió (D14): Arte y música usa el cuaderno existente; cada módulo de «Para la vida» es un cuaderno aparte. Se copió la investigación a `docs/research/` y se escribió `docs/design/artes/ESPECIFICACION.md` (ajustes: web → React Native, dependencias nativas nuevas, timbres sintetizados, sin micrófono ni cámara).
- AR-T1: `packages/music-engine` (22 pruebas) con el secuenciador de ocho pulsos sobre el reloj de audio, y la pantalla «Prueba de audio» (Ajustes de padres) con `react-native-audio-api`. Plugin configurado sin permisos, sin servicio en primer plano y sin FFmpeg. En el navegador: 25 ms de media entre llamadas del planificador y 0 congelamientos.
- Pendiente: probarla en la tableta de Victor (5 min a 60/90/140 BPM) con un APK nuevo.

## 2026-10-19 · Catálogo de 16 sonidos
- Victor pidió que el niño elija entre 16 sonidos (había 4 fijos). Las filas pasan a ser pistas `a`–`d` y cada una elige su sonido (`Kit`); catálogo en 4 familias × 4 (tambores, cuerpo y voz, madera/metal/sonajas, con tono) en `packages/music-engine/src/sounds.ts` y `synth.ts`, todo sintetizado, notas en do mayor pentatónico. Pruebas: huella distinta por sonido, orden grave→agudo de los tambores, alturas de las notas por autocorrelación y Fourier, nombres ES/EN. Selector en la pantalla «Prueba de audio» con vista previa al tocar.
