# apps/mobile — Lee Conmigo nativa (React Native + Expo)

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
- Identificador: `com.leeconmigo.mobile` (distinto de la app Capacitor, `com.leeconmigo.app`, para poder tener
  las dos instaladas mientras dura la migración). Antes de publicar se decide el definitivo.
- Componentes y tokens nativos: `packages/ui-native` (tokens generados desde `packages/ui/src/styles/tokens.css`;
  `packages/ui-native/tests/tokens.test.ts` falla si se desincronizan). En desarrollo, "Ver componentes" abre la muestra.
- Las historias se cargan con `require.context` de Metro (`src/bundled-stories.ts`): agregar un JSON en
  `packages/story-engine/stories/` basta, igual que en la app web.
