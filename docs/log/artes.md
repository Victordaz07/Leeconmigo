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
