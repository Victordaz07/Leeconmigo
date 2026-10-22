# Paquete para el abogado (privacidad infantil)

> ⚠️ Lo escribió Claude Code, **no es asesoría legal**. Es para que el abogado vea rápido qué hace la app y qué hay que decidir. Los textos de la app
> (`apps/mobile/src/legal/copy.ts`) y los de esta carpeta (`*.md`, generados con `node scripts/legal-docs.mjs`) son **borradores**.

## 1. Qué es la app (resumen técnico verificado en el código)
- Kitewise: práctica escolar (lectura en voz alta, matemáticas, ciencia, sociedad, arte y música) para niños de primaria (~6–12). Android primero, iOS después.
- **Sin servidor, sin cuentas, sin nube.** Todo se guarda en el dispositivo. Sin anuncios, sin analítica, sin reporte de errores de terceros, sin chat.
- **Voz:** reconocimiento 100 % en el dispositivo (modelo Whisper incluido en la app). Audio y texto reconocido solo en memoria durante la lectura; nunca a archivo ni red (hay una prueba automática que falla si el código de voz usa red/archivos).
- **Avisos:** notificaciones locales programadas en el dispositivo; el envío remoto (Firebase/FCM) está quitado del manifiesto (hay prueba automática).
- **Informe semanal PDF:** se crea en el dispositivo; solo sale si el adulto lo comparte con la hoja del sistema.
- **Modo padres:** protegido con PIN (en el dispositivo); sin recuperación por correo.
- **Primera pantalla:** aviso legal con pregunta de adultos + casilla de aceptación (versión de textos guardada; si cambian, se vuelve a pedir).
- **Borrar todos los datos:** botón en Modo padres → Legal y privacidad.

## 2. Mapa de datos (para el formulario «Seguridad de los datos» de Google Play)
| Dato | ¿Sale del dispositivo? | Dónde | Nota |
|---|---|---|---|
| Nombre/apodo del niño, avatar, nivel, metas | No | Almacenamiento local de la app | Lo escribe el adulto |
| Estadísticas de práctica (minutos, historias, preguntas, palabras con ayuda, estrellas, enfoque que marcó el niño) | No | Local | Derivadas; sin audio ni texto reconocido |
| Progreso por materia | No | Local | |
| Creaciones del niño (ritmos, pinturas, collages, ideas de hasta 140 caracteres) | No | Local | Texto libre corto del niño |
| Voz | No | Solo memoria temporal | Nunca se guarda |
| PIN de padres, recordatorios, aceptación legal | No | Local | |
| Fotos, ubicación, contactos, identificadores de publicidad | No se usan | — | |
Propuesta para el formulario: «No se recopilan datos» / «No se comparten datos» (el abogado confirma si procede declararlo así dado que todo es local).

## 3. Permisos de Android (manifiesto del APK)
- `RECORD_AUDIO` — leer en voz alta; reconocimiento local.
- `POST_NOTIFICATIONS` — recordatorios locales (se pide solo cuando el adulto activa uno).
- `VIBRATE` — estándar de la plataforma.
- **Quitados a propósito** (`blockedPermissions` en `app.json`): `INTERNET`, `SYSTEM_ALERT_WINDOW`, `READ/WRITE_EXTERNAL_STORAGE`. Sin `INTERNET`, el sistema operativo impide que la app envíe datos. ⚠️ Pendiente de verificar en un dispositivo real que nada se rompe.
- Copia de seguridad de Android desactivada (`allowBackup=false`).

## 4. Preguntas para el abogado
1. **COPPA:** ¿la app es «dirigida a niños»? Al no recopilar información personal fuera del dispositivo, ¿qué obligaciones quedan (aviso, consentimiento de los padres, etc.)? ¿Basta el aviso con casilla de aceptación del adulto o hace falta «consentimiento verificable de los padres» en algún caso?
2. **California** (CalOPPA, CCPA/CPRA, Age-Appropriate Design Code si está vigente): ¿obligaciones adicionales? ¿Política de privacidad en URL pública, con qué contenido mínimo?
3. **Google Play — Familias / Designed for Families** y **Apple Kids**: ¿el «candado de adultos» (pregunta de multiplicación) y el PIN cumplen el «parental gate»? ¿Declarar el micrófono y las notificaciones como se propone?
4. **Entidad (C11):** ¿publicar a nombre personal o con una LLC? ¿Seguro de responsabilidad?
5. **Términos:** ¿son aplicables las cláusulas de «tal cual», limitación de responsabilidad y ley aplicable frente a consumidores/menores? ¿Qué estado/país y jurisdicción poner?
6. **Descargos:** ¿bastan los avisos («no es terapia/diagnóstico/evaluación oficial»; reconocimiento de voz falible; supervisión de adultos)? ¿Alguna afirmación del texto o de la tienda que pueda considerarse una promesa de resultados?
7. **Contenido:** ilustraciones generadas con herramientas de IA — términos de cada herramienta, titularidad y uso comercial; revisión de historias originales (sin derechos de terceros).
8. **Licencias de código abierto:** lista completa de dependencias y avisos de licencia que deben incluirse (Whisper/Silero MIT, fuentes OFL, React Native, Expo y el resto).
9. **Accesibilidad** (ADA/WCAG) y contacto de soporte: ¿qué se espera?
10. **Marca «Kitewise»:** búsqueda en USPTO (clases 9, 41, 42) y registro; el dominio `.com` está tomado (ver `docs/12` §5).
11. **Eliminación de datos:** al estar todo en el dispositivo, ¿es suficiente el botón «Borrar todos los datos» + desinstalar?
12. **Datos de salud/educación:** aunque no se recopilan, ¿alguna implicación de FERPA/derechos educativos por usar la app en una escuela? (hoy solo uso familiar).

## 5. Lo que tiene que dar Victor antes de publicar
- Nombre legal de quien publica (persona o LLC) · correo de soporte/privacidad · URL pública de la política · ley aplicable → `apps/mobile/src/legal/config.ts`, luego `node scripts/legal-docs.mjs` y subir `docs/legal/*.md` a una página web.
- Cambiar `LEGAL_VERSION` de «…-borrador» a final cuando el abogado apruebe.
