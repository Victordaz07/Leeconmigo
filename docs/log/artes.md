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
