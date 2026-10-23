# Protocolo de prueba para «Leer juntos»

22 de octubre de 2026 · Propuesta ejecutable por etapas. **Estas pruebas de dispositivo todavía no se han realizado.** No cambiar D1, grabar a Noah ni contratar APIs para ejecutarlas por defecto.

## 1. Objetivo y candidatos

Elegir un proveedor que permita seguir una lectura infantil ES/EN con pocos falsos avances y retraso tolerable, sin almacenar ni enviar voz infantil.

Comparar primero:

| Código | Proveedor | Condición |
|---|---|---|
| AND | Android local mediante adaptador estricto | Servicio e idioma comprobados; fábrica local; sin fallback genérico |
| WHI-T | Whisper Tiny multilingüe actual | Baseline real por frases; describir retraso y pérdidas |
| WHI-B | Whisper Base multilingüe actual | Misma captura, segmentación y alineación que Tiny |
| MOO | Moonshine Tiny Streaming inglés/español | Pesos y binding exactos, licencia y compatibilidad verificados |

No iniciar todos a la vez sobre el micrófono. Si se ensaya otro candidato, se agrega como otra condición y se registra por qué. Los resultados de un proveedor no se atribuyen al alineador si usó otra versión de este.

Para Moonshine, el binding oficial inspeccionado parte de API 26 y tres ABIs. El primer diagnóstico puede ser un APK separado para el Fold; incorporar esa dependencia al APK público actual de API 24/cuatro ABIs exige resolver antes el empaquetado. No asumir que una guarda de ejecución arregla una incompatibilidad del manifiesto nativo.

## 2. Preparación y registro del entorno

Registrar sin identificadores personales:

- Marca/modelo y formato de pantalla: Fold cerrado/abierto, retrato/paisaje.
- Android/API, One UI, RAM disponible aproximada y estado térmico inicial.
- Versión del APK diagnóstico, commit, motor y versión del wrapper/runtime.
- Modelo, hash, cuantización, parámetros de hilos y configuración relevante.
- Locale solicitado, locale efectivo si el proveedor lo informa y disponibilidad de modelo.
- Condición de red: preparación conectada o ensayo offline; estado del servicio.
- Fuente/ruta de audio: micrófono interno, auricular, Bluetooth si se prueba.
- Volumen TTS y ruido de fondo aproximado como categorías, sin guardar muestras.

No almacenar nombre del niño, ID de voz, transcripciones completas, grabaciones ni contenido de conversaciones ajenas en los resultados. El identificador del ensayo puede ser aleatorio y sin vínculo personal.

Antes de invitar a leer: preparar el modelo, comprobar permiso y servicio, confirmar estado listo, cerrar cualquier otro capturador, mostrar indicador de micrófono y comprobar que detenerlo realmente lo libere.

## 3. Etapa A: casos deterministas del comparador

No usa audio. Debe pasar antes de conectar el proveedor al lector. Para cada caso se define texto esperado, eventos de hipótesis con segmento/revisión, instante de llegada y posiciones/cobertura aceptables.

| Caso | Entrada/condición | Resultado exigido |
|---|---|---|
| A01 | Solo la última palabra de una oración larga | No marcar toda la oración ni completar página |
| A02 | Una palabra frecuente repetida en varias líneas | No saltar a la aparición distante por un empate |
| A03 | Lectura ordenada con varios parciales | Cursor plausible; cobertura no duplicada |
| A04 | Parcial «puerta roja» luego «puerta azul» | Sustituir hipótesis; no dos créditos ni falso error definitivo |
| A05 | Mismo final recibido dos veces | Confirmación idempotente |
| A06 | Parciales con prefijo repetido | No concatenar prefijos como palabras nuevas |
| A07 | Segmento nuevo tras una pausa | Mantener finales previos y reemplazar solo el parcial activo |
| A08 | «el el el gato» | Tolerar arranque sin multiplicar avance |
| A09 | Cuento que dice «muy, muy lejos» | Conservar las dos palabras esperadas |
| A10 | Volver tres palabras para autocorregir | Recuperar posición sin perder cobertura legítima ni sumar tiempo doble |
| A11 | Reiniciar una oración | No saltar a una frase repetida de otra página |
| A12 | Omitir una palabra entre dos reconocidas | Representar omisión/incertidumbre, no `word.correct` automático |
| A13 | Agregar una palabra ajena | No desplazar arbitrariamente los índices del cuento |
| A14 | Conversación ajena con palabras comunes del cuento | No confirmar grandes tramos |
| A15 | Vacío/silencio/marcadores de ruido | No avance ni tiempo válido |
| A16 | Resultado tardío de generación anterior | Ignorar |
| A17 | Resultado de página anterior tras navegar | Ignorar o finalizar solo en su contexto cerrado |
| A18 | Final antes que un parcial antiguo | El parcial antiguo no revierte el final |
| A19 | `don't`/`do not`, números/cifras | Correspondencia explícita de tokens, sin cambiar el cuento |
| A20 | Tildes, ñ y nombres propios | Normalización enlazada al texto; sin afirmar evaluación fonética |
| A21 | Segmento final perdido/cancelado | No inventar confirmación de todas las hipótesis |
| A22 | Cobertura suficiente con pausas | Política de página explícita, sin exigir perfección léxica |
| A23 | Repetir una palabra ya confirmada | No sumar otro intervalo de lectura por la duplicación |
| A24 | Orden de eventos diferente para el mismo audio | Estado coherente o descarte explícito del evento inválido |

Los casos de omisiones y conversación deben incluir versiones donde el ASR tiene alta confianza: confiar en esa cifra no puede saltarse el alineador.

## 4. Etapa B: diagnóstico de proveedor en dispositivo

Primero un adulto prueba control de captura y comportamiento de API. Se puede utilizar audio de laboratorio propio/permitido para automatizar parte de la comparación; eso evalúa el pipeline, no demuestra precisión infantil. No usar grabaciones de Noah para hacer archivos de prueba.

Pruebas mínimas por locale:

1. Modelo listo y no listo; preparación conectada; solicitud después sin red.
2. Inicio, primer parcial, sucesivos parciales, final y cierre.
3. Frases cortas y lectura continua sin silencios largos.
4. Pausas de 1, 3, 6 y 10 segundos, sin cambiar de página.
5. Habla baja normal y habla clara; distancia de uso habitual.
6. Detener inmediatamente después de la última palabra y después de esperar un final.
7. Cancelar, iniciar otra sesión y comprobar que no aparezca texto de la anterior.
8. Repetir durante varios ciclos, buscando fugas de micrófono, memoria y colas.
9. Bloquear pantalla, enviar a segundo plano, volver y revocar permiso.
10. Giro y apertura/cierre del Fold sin recrear capturas inadvertidas.
11. Auricular/Bluetooth conectado o desconectado mientras escucha, si se incluye esa ruta.
12. Otra app usa el micrófono; servicio no disponible; idioma no instalado.

No basta con apagar Wi-Fi si queda red móvil activa. Registrar exactamente qué conectividad se usó. Probar después con red disponible y confirmar que el código no selecciona la ruta remota. El resultado se describe como observación más auditoría de API, no como una prueba universal de todo el comportamiento del sistema operativo.

## 5. Etapa C: lectura real breve y amable

Sesiones cortas propuestas, aproximadamente 3–5 minutos por condición, sin convertir al niño en evaluador ni pedirle errores artificiales. Un adulto maneja los casos de ruido o intentos de engañar al sistema. El niño puede detenerse y seguir en modo manual.

Usar textos conocidos de Kitewise en el idioma correspondiente y dificultad cómoda. No cambiar simultáneamente tamaño de letra, cuento difícil, proveedor y posición del teléfono: no podríamos atribuir la diferencia. Alternar orden de candidatos y usar textos equivalentes para reducir el efecto de práctica.

Observar: si el resaltado acompaña, si salta, si espera durante vacilaciones, si permite autocorrección y si el niño puede pedir pronunciación sin perder el lugar. Registrar recuentos y notas anónimas de interacción; descartar audio e hipótesis al terminar.

Una sola voz sirve para adaptar el producto familiar. Para afirmar que funciona para niños en general se necesitan más voces, condiciones y una población definida. No transformar la respuesta de Noah en una garantía universal.

## 6. Etapa D: ayuda TTS, ruido y negativos

| Caso | Estímulo | Criterio |
|---|---|---|
| D01 | Tocar palabra para escucharla | TTS audible; no acreditar esa voz como lectura infantil |
| D02 | Repetir varias ayudas | Sin bucle de ASR/TTS y sin duplicar progreso |
| D03 | Escuchar la ayuda y luego leerla | Reanuda normalmente, con evidencia del nuevo intento |
| D04 | Silencio con música/ruido sin palabras | No inventar cobertura |
| D05 | Adulto habla de otro tema | No confirmar grandes tramos por palabras aisladas |
| D06 | Adulto dice solo el final del fragmento | No completar todo el texto |
| D07 | TV lee otra cosa | No avanzar por mera detección de voz |
| D08 | TV/adulto lee exactamente el cuento | Medir la limitación; no prometer identificación de hablante |
| D09 | Abrir ilustración ampliada y girar | Micrófono y estado coherentes con la política de actividad |
| D10 | Responder pregunta de comprensión | No confundir esa conversación con lectura del pasaje |
| D11 | Retroceder fragmento | Anclas correctas y tiempo no duplicado |
| D12 | Perder proveedor a mitad de página | Recuperación/manual; progreso conservado |

## 7. Métricas y cómo medirlas sin almacenar voz infantil

Separar dos entornos de medida:

**Laboratorio con audio permitido:** si hay referencias de palabras y tiempos verificadas, se calcula latencia de eventos y WER. La referencia de WER es lo que realmente contiene el audio, no lo que debió decir el lector. Registrar condiciones de segmentación y punto desde el que se mide el tiempo.

**Lectura infantil en vivo sin grabación:** observador marca saltos, pérdidas de lugar, ayudas e interrupciones. Se pueden obtener duraciones de eventos y métricas agregadas internas, pero no atribuir precisión milimétrica a marcas manuales. Un WER exacto no se declara sin una referencia humana fiable de lo hablado. Si para verificar un error hiciera falta grabarlo, el caso queda como observación no confirmada bajo la política actual.

Medidas propuestas:

- Retraso de primera hipótesis útil y de confirmación, con p50/p95 y definición de inicio.
- Recuentos de saltos grandes falsos, fragmentos perdidos, hipótesis duplicadas y errores recuperables.
- Tiempo fuera de posición y recuperaciones correctas tras repetir.
- Solicitudes de ayuda TTS y casos en que causó crédito propio.
- Reinicios, sesiones abortadas, profundidad máxima de cola y muestras descartadas.
- Memoria inicial/máxima/final y estado térmico durante una sesión de 15 minutos, inicialmente con adulto.
- En laboratorio, RTF separado de latencia percibida y de espera de endpoint.

Las métricas temporales deben vivir en un reloj monótono. Un `Date.now()` de pared no es una referencia robusta si cambia la hora del dispositivo. No fabricar tiempos de palabra a partir de repartir uniformemente la duración del segmento.

## 8. Metas iniciales de ensayo

Son hipótesis de producto para discutir con resultados, **no prestaciones demostradas**:

| Criterio | Meta inicial propuesta |
|---|---|
| Inicio útil | Estado listo explícito antes de invitar a leer; medir frío/caliente |
| Respuesta progresiva | Hipótesis útil p50 ≤ 500 ms y p95 ≤ 1.000 ms en laboratorio, desde fin de palabra identificable con contexto suficiente |
| Confirmación | Objetivo orientativo p95 ≤ 1.500 ms en esos casos; informar aparte palabras que necesitan contexto adicional |
| Negativos de falso avance | Cero saltos grandes falsos en A01/A02/A14/A15/D01/D06 del conjunto reservado; informar número de casos |
| Repeticiones y revisiones | Cero créditos duplicados en la batería determinista |
| Sesión sostenida | 15 minutos sin crecimiento continuo de cola/memoria ni fallo de captura, primero sin niño |
| Recuperación | Cambio a manual y conservación de ancla ante un fallo sin salida destructiva |
| Privacidad | Sin audio escrito/subido; sin transcripciones infantiles persistentes o logs en release |

Si un proveedor llega mejor por fragmentos que por palabras, se puede proponer acompañamiento por línea/frase honesto. No anunciar seguimiento palabra a palabra si la experiencia real llega varios segundos tarde. No alcanzar una meta conduce a ajustar alcance o cambiar candidato, no a presionar al lector.

## 9. Resultados permitidos

Una plantilla propuesta para el artefacto del ensayo contiene solo agregados. No se presenta como formato ya aprobado para persistencia de niños:

```json
{
  "runId": "aleatorio-sin-identidad",
  "appCommit": "commit-del-diagnostico",
  "provider": "android-local",
  "providerVersion": "version-comprobada",
  "modelHash": null,
  "locale": "es-US",
  "deviceClass": "foldable",
  "osApi": null,
  "networkCondition": "offline-after-provisioning",
  "referenceKind": "adult-lab-or-live-observation",
  "metrics": {
    "cases": 0,
    "largeFalseAdvances": 0,
    "duplicateCredits": 0,
    "lostSegments": 0,
    "ttsSelfCredits": 0,
    "recognizerRestarts": 0,
    "hypothesisLatencyP50Ms": null,
    "hypothesisLatencyP95Ms": null
  },
  "audioSaved": false,
  "audioUploaded": false,
  "transcriptSaved": false
}
```

No incluir el nombre de Noah, hipótesis textuales, samples PCM, URI de archivo de voz o identificadores biométricos. No agregar analítica o un SDK de crash que recolecte buffers. Las hipótesis necesarias para el comparador viven en memoria y se destruyen al cerrar su sesión.

## 10. Informe de decisión al terminar

Entregar versión y configuración de cada candidato, matriz por idioma/dispositivo, casos fallidos, métricas con denominadores, incertidumbres, condición de privacidad, costo/tamaño y recomendación de alcance. Si el mejor candidato funciona solo en el Fold o solo en inglés, ese es el alcance comprobado, no una solución universal.

Elegir el motor después de esa comparación, preservando el contrato y el lector manual. La evaluación fonética automatizada permanece como un proyecto distinto que necesita evidencia adicional.

[S01]: FUENTES.md#s01
[S02]: FUENTES.md#s02
[S03]: FUENTES.md#s03
[S04]: FUENTES.md#s04
[S05]: FUENTES.md#s05
[S06]: FUENTES.md#s06
[S07]: FUENTES.md#s07
[S08]: FUENTES.md#s08
[S09]: FUENTES.md#s09
[S10]: FUENTES.md#s10
[S11]: FUENTES.md#s11
[S12]: FUENTES.md#s12
[S13]: FUENTES.md#s13
[S14]: FUENTES.md#s14
[S15]: FUENTES.md#s15
[S16]: FUENTES.md#s16
[S17]: FUENTES.md#s17
[S18]: FUENTES.md#s18
[S19]: FUENTES.md#s19
[S20]: FUENTES.md#s20
[S21]: FUENTES.md#s21
[S22]: FUENTES.md#s22
[S23]: FUENTES.md#s23
[S24]: FUENTES.md#s24
[S25]: FUENTES.md#s25
[S26]: FUENTES.md#s26
[S27]: FUENTES.md#s27
[S28]: FUENTES.md#s28
[S29]: FUENTES.md#s29
[S30]: FUENTES.md#s30
[S31]: FUENTES.md#s31
[S32]: FUENTES.md#s32
[S33]: FUENTES.md#s33
[S34]: FUENTES.md#s34
[S35]: FUENTES.md#s35
[S36]: FUENTES.md#s36
[S37]: FUENTES.md#s37
[S38]: FUENTES.md#s38
[S39]: FUENTES.md#s39
[S40]: FUENTES.md#s40
[S41]: FUENTES.md#s41
[S42]: FUENTES.md#s42
[S43]: FUENTES.md#s43
[S44]: FUENTES.md#s44
[S45]: FUENTES.md#s45
[S46]: FUENTES.md#s46
[S47]: FUENTES.md#s47
[S48]: FUENTES.md#s48
[S49]: FUENTES.md#s49
[S50]: FUENTES.md#s50
[S51]: FUENTES.md#s51
[S52]: FUENTES.md#s52
[S53]: FUENTES.md#s53
[S54]: FUENTES.md#s54
[S55]: FUENTES.md#s55
[S56]: FUENTES.md#s56
[S57]: FUENTES.md#s57
[S58]: FUENTES.md#s58
[S59]: FUENTES.md#s59
[S60]: FUENTES.md#s60
[S61]: FUENTES.md#s61
[S62]: FUENTES.md#s62
[S63]: FUENTES.md#s63
[S64]: FUENTES.md#s64
[S65]: FUENTES.md#s65
[S66]: FUENTES.md#s66
[F01]: FUENTES.md#f01
[F02]: FUENTES.md#f02
[F03]: FUENTES.md#f03
[F04]: FUENTES.md#f04
[F05]: FUENTES.md#f05
[F06]: FUENTES.md#f06
[F07]: FUENTES.md#f07
[F08]: FUENTES.md#f08
[F09]: FUENTES.md#f09
[F10]: FUENTES.md#f10
