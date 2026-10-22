# Marca Kitewise (logo e íconos)

Primera versión (2026-10-22), hecha en código a pedido de Victor. **No es definitiva legalmente:** antes de publicar hay que buscar si ya existe una
marca o app «Kitewise» (`docs/12` §5) y, si hace falta, ajustar el dibujo.

## Idea
Una **cometa** (kite) de cuatro paños —coral, amarillo, turquesa y coral claro— con listones crema y una cola con dos moños. Es la misma cometa que
acompaña al niño en la app (`kitewise/kites/*`, DA-5: sin cara). Va sobre el azul de la marca (`#4B97FF → #1E6FE8`). El nombre se escribe en **Nunito Black**
(la fuente de la interfaz): «Kite» en azul marino `#1B2A6B` y «wise» en azul `#1E6FE8` (en blanco/amarillo sobre fondo azul).

## Archivos (`apps/mobile/assets/`)
| Archivo | Uso |
|---|---|
| `icon.png` (1024) | Ícono de la app (iOS y Android clásico) |
| `android-icon-background.png`, `android-icon-foreground.png` (1024) | Ícono adaptable de Android: la cometa queda en el 66 % central (zona segura) |
| `android-icon-monochrome.png` (1024) | Ícono temático de Android 13+ (una sola silueta) |
| `splash-icon.png` (1024, transparente) | Pantalla de carga (cuando se configure `expo-splash-screen`) |
| `favicon.png` (96) | Versión web |
| `brand/notification-icon.png` (256, blanco sobre transparente) | Ícono pequeño de los avisos de Android |
| `brand/kite-mark.svg`, `brand/kite-icon.svg` | Vectores (la cometa sola; la cometa sobre el fondo azul) |
| `brand/logo-horizontal.png` / `logo-horizontal-blanco.png` | Cometa + nombre para fondo claro / fondo azul |
| `brand/play-icon-512.png`, `brand/play-feature-1024x500.png` | Google Play: ícono 512 y gráfico de funciones |

Todo se genera con `node scripts/marca.mjs` (vuelve a crear los PNG desde el dibujo). Para cambiar colores o forma se edita ese archivo y se corre de nuevo.

## Reglas de uso
- Espacio libre alrededor del logo: al menos el alto de un moño. No estirar, no girar, no cambiar los colores de los paños.
- Sobre fondo claro usar `logo-horizontal.png`; sobre azul o foto oscura, `logo-horizontal-blanco.png`.
- Nada de texto dentro del ícono de la app. La cometa no lleva cara en el ícono (la mascota con expresiones es otra pieza).
- Si más adelante se quiere un ícono ilustrado (estilo «plastilina» de la cometa de `kites/`), se pide como imagen y se reemplaza `icon.png`/`android-icon-foreground.png`
  manteniendo la zona segura; este vector queda como respaldo y para tamaños pequeños.
