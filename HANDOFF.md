# HANDOFF — estado actual
Actualizado: 2026-10-15 · Cuenta: A · Rama: claude/gracious-shannon-a0238d
Último commit: ver `git log -1` ("RN-00: …")

## Tarea en curso
Ninguna en código. RN-00 terminada: Victor decidió **React Native + Expo** (D7) y **publicar la app** (D8).

## Hecho
- [x] F1-02 sistema de relevo (HANDOFF, ROADMAP, SESSION_LOG, DECISIONS, /retomar, /relevo)
- [x] RN-00 `docs/11-MIGRACION-REACT-NATIVE.md` (plan RN-01…RN-09) y `docs/12-LEGAL-PRIVACIDAD-PUBLICACION.md`
- [x] D7/D8 en `docs/DECISIONS.md`; notas en `docs/02` y `docs/09` (#6, #13 resueltos); `CLAUDE.md` actualizado

## Siguiente paso exacto
**RN-01**: crear `apps/mobile` con Expo + TypeScript dentro del monorepo (npm workspaces), con un development
build (no Expo Go, porque la voz necesitará código nativo). Primera pantalla: leer una historia de
`@lee-conmigo/story-engine` y mostrar su título. Verificar que `npm test` sigue en 1068 ✅ y que la app vieja
(`npm run dev`) sigue funcionando. Probar en el Android de Victor (necesita generar un APK de desarrollo o
usar EAS Build — confirmar con Victor cuál prefiere).

## Preguntas abiertas para Victor
C10 modelo de negocio · C11 persona o LLC · C2/C3 fuente y paleta · C4 matemáticas · C6 multi-perfil · C9 estándares.

## Cuidado con
- **No borrar `apps/reader` ni `packages/ui`**: Noah sigue usando la app Capacitor hasta RN-CP2.
- No agregar funciones nuevas a la app vieja; van a la nueva (`docs/11` "Qué NO hacer").
- Cero SDKs de analítica/anuncios/reporte de errores (D8, `docs/12` §6).
- `npm ci` falla en la nube por el postinstall de `onnxruntime-node`: usar `npm ci --ignore-scripts`.

## Estado de pruebas
`npm test`: 1068/1068 ✅ (solo cambios de documentación en esta sesión)
