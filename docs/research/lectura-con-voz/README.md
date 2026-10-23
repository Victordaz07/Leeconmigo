# Investigación: leer con el niño

22 de octubre de 2026 · VZ-01 · Investigación solicitada por Victor tras probar el APK 0.1.2.

La experiencia de dictado de Gboard es una buena referencia: hablar y recibir respuesta mientras se habla. Para convertirla en acompañamiento lector necesitamos además seguir el cuento, tolerar repeticiones/autocorrecciones y ayudar sin convertir la lectura en un examen.

## Documentos

- [PDF completo, 54 páginas](Kitewise-investigacion-motor-de-lectura.pdf): informe, auditoría, protocolo y bibliografía en un solo documento.
- [Informe completo](INFORME.md): unas 10.000 palabras, 21 apartados, APIs, alternativas locales y cloud, investigación infantil, auditoría y arquitectura recomendada.
- [Fuentes y límites de acceso](FUENTES.md): 66 referencias de APIs/código/modelos/investigación y 10 conversaciones o cambios de desarrolladores. Identifica lo leído, los resultados declarados por autores/proveedores y los sitios bloqueados.
- [Auditoría del código de Kitewise](AUDITORIA-CODIGO.md): hallazgos y prioridades antes de activar la voz en el lector.
- [Protocolo de pruebas](PLAN-DE-PRUEBAS.md): comparación por dispositivo/idioma, casos negativos, metas propuestas y evaluación sin conservar voz infantil.
- [Manifiesto de consulta](SOURCE-MANIFEST.json): URLs, SHA-256, estado de acceso y verificación del paquete Expo 57.0.0.
- [Reproducción del matcher](REPRODUCCION-MATCHER.json) y [niveles de API del SDK oficial](ANDROID-API-LEVELS.json).

## Recomendación

Probar primero **Android en modo local estricto**, con resultados parciales y segmentos cuando el servicio lo permita. Compararlo con **Moonshine Tiny Streaming EN/ES**, manteniendo **Whisper Tiny/Base** como referencia local existente. Elegir después de medir con el mismo alineador y textos, no por una cifra comercial o un benchmark de adultos.

Antes de conectar cualquier motor, corregir el seguimiento experimental: una palabra aislada del final puede hoy llevar al consumidor a marcar todas las anteriores como correctas. Este camino no está activado en el lector libre actual. La corrección debe distinguir cursor probable, cobertura confirmada e incertidumbre, y manejar revisiones de hipótesis.

## Hallazgos que cambian una decisión de implementación

| Hallazgo | Implicación |
|---|---|
| `PREFER_OFFLINE` depende de la implementación; el servicio tiene su propia identidad de red | Usar fábrica local y verificar disponibilidad/idioma, no confiar solo en una preferencia o en quitar INTERNET a nuestra app |
| `expo-speech-recognition@57.0.0` existe y su código publicado fue inspeccionado | Candidata concreta para Expo 57; no hay que seguir una guía antigua del paquete Voice deprecado |
| Ese wrapper selecciona fábrica local desde API 33; iOS tiene una asignación condicional relevante | Guardas estrictas antes de iniciar; no caída silenciosa a red |
| Hay reportes de pérdida de finales al detener Android continuo | Ensayar stop/abort/pausas y no perder o inventar la última palabra |
| Whisper RN estable consultado es 0.7.4; existen fixes posteriores para su clase realtime | No copiar esa ruta sin comprobar versión, colas y memoria; el camino actual de Kitewise es distinto |
| Moonshine declara streaming EN/ES, pero su binding Android parte de API 26 y tres ABIs | Candidato interesante; hay trabajo real para integrarlo en nuestra app de API 24/cuatro ABIs |
| ML Kit tiene muestra Speech nueva con dependencia alfa | Merece laboratorio; no asumir soporte o estabilidad en el Fold por ver un selector de idiomas |
| ASR y evaluación de fonemas son problemas distintos | Mantener pronunciación TTS y no emitir juicios fonéticos basados solo en texto reconocido |

## Qué se ha comprobado y qué falta

Comprobados: fuentes y código, integridad SHA-512 del tarball 57.0.0, diferencias de versiones, atributos de API del SDK y dos reproducciones del comparador con texto escrito. Se consultaron muestras oficiales, repositorios de investigación y respuestas de mantenedores. No se instaló ni ejecutó un SDK nuevo.

Pendiente: disponibilidad real de locales/modelos en el Fold, precisión con voz infantil, latencia de posición, estabilidad sostenida, TTS/eco y batería. Las metas del protocolo son propuestas; no se presentan como resultados.

D1 permanece intacta: voz infantil solo efímera y local. Las APIs de nube se comparan documentalmente y no se llamaron con audio. No se activó el micrófono del lector, no se modificó la app ni se generó otro APK en esta investigación.

Siguiente paso propuesto: VZ-02, pruebas y corrección del alineador; después VZ-03, diagnóstico local de Android en el Fold. El alcance solicitado en esta entrega es investigación.
