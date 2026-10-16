# apps/mobile — Kitewise (React Native + Expo)

La app nueva (`docs/11-MIGRACION-REACT-NATIVE.md`). Convive con la app actual (`apps/reader`, Capacitor) hasta
que la iguale. Usa los mismos paquetes de lógica del monorepo (`contracts`, `reading-engine`, `story-engine`,
`session-engine`) y las mismas historias de `packages/story-engine/stories/`.

## Requisitos (en tu computadora)

- **Node 22.22.2 o más nuevo** (React Native 0.86 lo pide; con 22.22.0 instala pero avisa).
- **Android Studio** (trae el SDK de Android y el emulador) — solo para compilar en tu computadora.
- Tu teléfono/tablet con **depuración USB** activada, o un emulador.

## Correrla en tu Android

Desde la raíz del repo:

```bash
npm install
cd apps/mobile
npx expo run:android      # compila la app de desarrollo, la instala y la abre
```

La primera vez tarda (descarga Gradle y compila todo). Después, `npx expo start` basta para ver los cambios al
instante mientras la app de desarrollo está instalada.

Usamos **development build**, no Expo Go: la voz (RN-03) necesita código nativo propio que Expo Go no trae.

## APK de prueba (instalar sin cable ni servidor)

Para que la familia pruebe la app sin Android Studio: un APK que se instala directo. Lleva el **panel de
simulación** (DEV ⚙) porque la lectura todavía no usa la voz real (eso es RN-07); con él se maneja la lectura.

```bash
cd apps/mobile
npm run models                         # una vez: baja los modelos de voz (~100 MB) y verifica su SHA-256
npx expo prebuild --platform android --no-install
cd android
echo "sdk.dir=$ANDROID_HOME" > local.properties
EXPO_PUBLIC_DEMO=1 NODE_ENV=production ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

- Necesita el SDK de Android (`ANDROID_HOME`) y Java 17+. En la nube de Claude funciona bajando las
  `commandline-tools` de Google (ver `docs/log/SESSION_LOG.md`, entrada "APK demo").
- Va firmado con la llave de depuración de Expo: sirve para probar, **no para la tienda** (eso es P-04).
- Lleva la voz real (whisper.rn, en el equipo, sin red) y la **Prueba de voz** en Ajustes de padres. Los modelos
  (`assets/models/*.bin`) no van en git: sin `npm run models`, el empaquetado falla.
- `EXPO_PUBLIC_DEMO=1` solo muestra las herramientas de desarrollo (`src/dev-tools.ts`). Un build de tienda nunca
  la lleva.

## Voz (RN-03)

`src/speech/whisper-native-speech-engine.ts`: micrófono (`@fugood/react-native-audio-pcm-stream`, solo memoria) →
frases (`UtteranceSegmenter` de `@lee-conmigo/speech-engine/core`) → Silero VAD confirma voz → Whisper (whisper.rn) en el
equipo → texto. Implementa el contrato `SpeechEngine`. En la web hay una versión `.web.ts` que dice "no disponible".
`packages/speech-engine/tests/privacy.test.ts` falla si el código de voz usa red, archivos o `audioOutputPath` (D1).

## Comandos

```bash
npm run typecheck -w @lee-conmigo/mobile       # TypeScript
npm run export:android -w @lee-conmigo/mobile  # empaqueta el JS para Android (comprueba que Metro resuelve todo)
cd apps/mobile && npx expo-doctor              # revisa versiones y configuración de Expo
```

## Vista rápida en el navegador

`cd apps/mobile && npx expo start --web` abre la app en el navegador (react-native-web). Sirve para revisar diseño
rápido; **no reemplaza probar en Android** (la voz y algunos detalles nativos solo existen ahí).

## Notas

- `android/` e `ios/` **no se versionan**: Expo los genera (`npx expo prebuild`). La configuración nativa va en
  `app.json`, nunca editando esas carpetas a mano.
- React tiene que ser **una sola versión en todo el monorepo** (React Native lo exige): está fijada con
  `overrides` en el `package.json` de la raíz. Al subir de SDK de Expo, actualizar ahí también.
- Nombre oficial **Kitewise** (D10). Identificador: `com.kitewise.app` (distinto de la app Capacitor de Noah,
  `com.leeconmigo.app`, así se pueden tener las dos instaladas mientras dura la migración). Los paquetes internos
  conservan el prefijo `@lee-conmigo/` (solo código, el usuario nunca lo ve).
- Componentes y tokens nativos: `packages/ui-native` (tokens generados desde `packages/ui/src/styles/tokens.css`;
  `packages/ui-native/tests/tokens.test.ts` falla si se desincronizan). En desarrollo, "Ver componentes" abre la muestra.
- Las historias se cargan con `require.context` de Metro (`src/bundled-stories.ts`): agregar un JSON en
  `packages/story-engine/stories/` basta, igual que en la app web.
