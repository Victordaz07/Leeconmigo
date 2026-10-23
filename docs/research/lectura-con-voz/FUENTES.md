# Fuentes y trazabilidad

Consulta: 22 de octubre de 2026 (America/Los_Angeles). Los tiempos UTC exactos de los recursos consultados están en `SOURCE-MANIFEST.json`.

Se distinguen documentación/código original, reportes técnicos y páginas no accesibles. No hay un ensayo acústico propio ni una clasificación comparativa de exactitud infantil. Los enlaces a ramas móviles pueden cambiar: el manifiesto registra SHA-256 de los bytes consultados. Las fuentes de Expo 57.0.0 están fijadas a commit y su tarball se validó por SHA-512.

## APIs, bibliotecas, modelos e investigación

### S01

**Android SpeechRecognizer: código y JavaDocs AOSP**

[Fuente consultada](https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/master/core/java/android/speech/SpeechRecognizer.java)

API oficial; fábrica local, disponibilidad, ciclo de vida y advertencia de uso continuo. No prueba soporte de cada teléfono.

### S02

**Android RecognizerIntent: opciones y condiciones**

[Fuente consultada](https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/master/core/java/android/speech/RecognizerIntent.java)

API oficial; preferencia offline, audio source, segmentación, sesgo y opciones de palabras. Varias opciones dependen del proveedor.

### S03

**Android RecognitionListener**

[Fuente consultada](https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/master/core/java/android/speech/RecognitionListener.java)

API oficial; eventos parciales, finales y segmentados. No garantiza frecuencia de parciales.

### S04

**Android RecognitionSupport**

[Fuente consultada](https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/master/core/java/android/speech/RecognitionSupport.java)

API oficial; diferencia de idiomas instalados, soportados, pendientes y online.

### S05

**Android RecognitionPart**

[Fuente consultada](https://raw.githubusercontent.com/aosp-mirror/platform_frameworks_base/master/core/java/android/speech/RecognitionPart.java)

API oficial; representación de palabras y metadatos. No es una evaluación fonética.

### S06

**expo-speech-recognition: documentación del proyecto**

[Fuente consultada](https://raw.githubusercontent.com/jamsch/expo-speech-recognition/main/README.md)

Documentación del wrapper; API, compatibilidad SDK 57, parciales/segmentos, grabación y limitaciones por plataforma. Leer junto al código versionado.

### S07

**Registro npm: expo-speech-recognition 57.0.0**

[Fuente consultada](https://registry.npmjs.org/expo-speech-recognition/57.0.0)

Metadatos de versión, integridad SHA-512, tarball y gitHead. Verificado sin instalar el paquete.

### S08

**Artefacto publicado expo-speech-recognition 57.0.0**

[Fuente consultada](https://registry.npmjs.org/expo-speech-recognition/-/expo-speech-recognition-57.0.0.tgz)

Tarball inspeccionado; integridad comparada con npm; sin ejecución. Contiene la versión concreta auditada, no solo main.

### S09

**ExpoSpeechService.kt fijado al commit de 57.0.0**

[Fuente consultada](https://raw.githubusercontent.com/jamsch/expo-speech-recognition/996258b7473ee723e9ffb5bb73d8694f091254ba/android/src/main/java/expo/modules/speechrecognition/ExpoSpeechService.kt)

Código Android auditado: fábrica local desde API 33, alternativas anteriores, sesiones y mensajes de diagnóstico.

### S10

**ExpoAudioRecorder.kt fijado al commit de 57.0.0**

[Fuente consultada](https://raw.githubusercontent.com/jamsch/expo-speech-recognition/996258b7473ee723e9ffb5bb73d8694f091254ba/android/src/main/java/expo/modules/speechrecognition/ExpoAudioRecorder.kt)

Código de captura: pipe, creación de temporal y escritura PCM condicionada a outputFilePath. persist false no escribe muestras en esa rama, aunque crea un archivo vacío.

### S11

**ExpoSpeechRecognizer.swift fijado al commit de 57.0.0**

[Fuente consultada](https://raw.githubusercontent.com/jamsch/expo-speech-recognition/996258b7473ee723e9ffb5bb73d8694f091254ba/ios/ExpoSpeechRecognizer.swift)

Código iOS: asignación condicional de requiresOnDeviceRecognition cuando el reconocedor declara soporte. Contrastar con issue 169.

### S12

**whisper.rn: documentación y ejemplos**

[Fuente consultada](https://raw.githubusercontent.com/mybigday/whisper.rn/main/README.md)

Binding nativo y ejemplo realtime; es necesario separar API disponible de la ruta que hoy usa Kitewise.

### S13

**Registro npm: versión estable de whisper.rn**

[Fuente consultada](https://registry.npmjs.org/whisper.rn/latest)

Al consultar latest devolvió 0.7.4. Una corrección fusionada en main no queda por eso incluida en esta versión.

### S14

**whisper.cpp**

[Fuente consultada](https://raw.githubusercontent.com/ggml-org/whisper.cpp/master/README.md)

Motor local, plataformas y modelos; no implica por sí solo latencia de palabra ni calidad infantil.

### S15

**Whisper: ficha de modelo oficial**

[Fuente consultada](https://raw.githubusercontent.com/openai/whisper/main/model-card.md)

Limitaciones, alucinaciones, variación entre lenguas y grupos. No evalúa nuestro Fold.

### S16

**WhisperStreaming**

[Fuente consultada](https://raw.githubusercontent.com/ufal/whisper_streaming/main/README.md)

Técnicas de acuerdo local y streaming sobre Whisper; declara su reemplazo por SimulStreaming y un resultado de 3,3 s en su escenario.

### S17

**SimulStreaming**

[Fuente consultada](https://raw.githubusercontent.com/ufal/SimulStreaming/main/README.md)

Proyecto posterior de streaming; implementación/entorno no equivalen a un SDK Android ya integrado.

### S18

**Silero VAD**

[Fuente consultada](https://raw.githubusercontent.com/snakers4/silero-vad/master/README.md)

Detector de actividad de voz; no determina si el niño leyó el cuento o si un fonema fue correcto.

### S19

**Vosk API**

[Fuente consultada](https://raw.githubusercontent.com/alphacep/vosk-api/master/README.md)

Runtime de reconocimiento local. El rendimiento y la licencia de cada modelo requieren revisión separada.

### S20

**Vosk: ejemplo oficial Android**

[Fuente consultada](https://raw.githubusercontent.com/alphacep/vosk-android-demo/master/app/src/main/java/org/vosk/demo/VoskActivity.java)

Ejemplo de integración y ciclo de reconocimiento local; no es un benchmark infantil.

### S21

**Vosk: licencia del código**

[Fuente consultada](https://raw.githubusercontent.com/alphacep/vosk-api/master/COPYING)

Apache-2.0 del código consultado; no generalizar a todos los pesos.

### S22

**Sherpa-ONNX**

[Fuente consultada](https://raw.githubusercontent.com/k2-fsa/sherpa-onnx/master/README.md)

Runtime y familias de modelos. Distinguir capacidades del runtime de un modelo específico.

### S23

**react-native-sherpa-onnx: wrapper comunitario**

[Fuente consultada](https://raw.githubusercontent.com/XDcobra/react-native-sherpa-onnx/main/README.md)

TurboModule, modelos y opciones. Compatibilidad con Kitewise y madurez deben probarse.

### S24

**Wrapper Sherpa RN: guía de streaming**

[Fuente consultada](https://raw.githubusercontent.com/XDcobra/react-native-sherpa-onnx/main/docs/stt-streaming.md)

Tipos/configuración de streaming y entradas. No demuestra soporte español infantil de cualquier checkpoint.

### S25

**Sherpa-ONNX: licencia del código**

[Fuente consultada](https://raw.githubusercontent.com/k2-fsa/sherpa-onnx/master/LICENSE)

Apache-2.0. Revisar también modelos y dependencias.

### S26

**Moonshine Voice: documentación del proyecto**

[Fuente consultada](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/README.md)

Toolkit local, bindings y alcance declarado. Sus afirmaciones comparativas no se tratan como resultados independientes.

### S27

**Moonshine: catálogo de modelos disponible**

[Fuente consultada](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/docs/models/available-models.md)

Declara Tiny/Small Streaming EN/ES y licencias. WER del catálogo no es precisión infantil del Fold.

### S28

**Moonshine: metodología y precisión publicada**

[Fuente consultada](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/docs/models/accuracy.md)

Paneles, diferencias de métricas/condiciones y cuantización; importante para no comparar cifras incompatibles.

### S29

**Moonshine: licencia actual y excepciones de modelos**

[Fuente consultada](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/LICENSE)

Streaming MIT frente a modelos antiguos no ingleses enumerados bajo Community. Elegir artefacto preciso.

### S30

**Moonshine: build del binding Android**

[Fuente consultada](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/language-bindings/android/build.gradle.kts)

Declara minSdk 26 y tres ABIs. Nuestra app usa minSdk 24 y cuatro ABIs: integración no validada.

### S31

**Moonshine: adaptación de dominio**

[Fuente consultada](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/docs/models/domain-customization.md)

Contexto y personalización; no permite inferir que texto inducido pruebe lectura correcta.

### S32

**Google ML Kit GenAI Speech: muestra oficial**

[Fuente consultada](https://raw.githubusercontent.com/googlesamples/mlkit/master/android/speech/README.md)

Existencia del ejemplo y flujo de disponibilidad/descarga. Documentación completa del producto no accesible.

### S33

**ML Kit: actividad de reconocimiento de voz**

[Fuente consultada](https://raw.githubusercontent.com/googlesamples/mlkit/master/android/speech/app/src/main/java/com/google/mlkit/genai/speech/demo/SpeechRecognitionActivity.kt)

Parciales/finales, checkStatus, modos y rutas fromMic/fromPfd; la muestra con descriptor escribe PCM temporal.

### S34

**ML Kit Speech: dependencia del ejemplo**

[Fuente consultada](https://raw.githubusercontent.com/googlesamples/mlkit/master/android/speech/app/build.gradle)

La muestra utiliza genai-speech-recognition 1.0.0-alpha1. No es una garantía de estabilidad productiva.

### S35

**ML Kit Speech: selector de idiomas/modos**

[Fuente consultada](https://raw.githubusercontent.com/googlesamples/mlkit/master/android/speech/app/src/main/res/values/arrays.xml)

El selector incluye es-US, es-ES y en-US. Un selector no es una matriz comprobada de soporte en el Fold.

### S36

**Picovoice Cheetah**

[Fuente consultada](https://raw.githubusercontent.com/Picovoice/cheetah/master/README.md)

STT streaming local con inglés/español declarados y AccessKey. Condiciones comerciales y red de licencia no verificadas.

### S37

**Picovoice Leopard**

[Fuente consultada](https://raw.githubusercontent.com/Picovoice/leopard/master/README.md)

Alternativa local de transcripción por bloques. No confundir con streaming de Cheetah.

### S38

**Azure: muestra oficial Python de Pronunciation Assessment**

[Fuente consultada](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-speech-sdk/master/scenarios/python/console/language-learning/pronunciation_assessment.py)

Texto de referencia, miscue, granularidad, prosodia y distintas modalidades; muestra conectada al servicio.

### S39

**Azure: evaluación de pronunciación continua**

[Fuente consultada](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-speech-sdk/master/scenarios/javascript/node/language-learning/pronunciationAssessmentContinue.js)

Muestra oficial de tratamiento de resultados y comparación en lectura larga. Capacidades por idioma se deben verificar.

### S40

**Azure: documentación de fonemas pronunciados**

[Fuente consultada](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-speech-sdk/master/docs/pronunciationassessment/how-to-get-spoken-phonemes.md)

Distingue hipótesis acústicas/fonéticas y evaluación. No valida diagnóstico infantil.

### S41

**Google Cloud Speech-to-Text v2: contrato proto oficial**

[Fuente consultada](https://raw.githubusercontent.com/googleapis/googleapis/master/google/cloud/speech/v2/cloud_speech.proto)

Streaming, configuración y respuestas por modelo. No es Android SpeechRecognizer ni una política de cuenta o tarifa.

### S42

**Google Cloud Speech-to-Text v1: contrato proto oficial**

[Fuente consultada](https://raw.githubusercontent.com/googleapis/googleapis/master/google/cloud/speech/v1/cloud_speech.proto)

Contrato de una versión diferente de la API; no generalizar capacidades de v2 o de Android. No documenta por sí solo tarifas ni retención.

### S43

**OpenAI Audio: transcripción de voz**

[Fuente consultada](https://raw.githubusercontent.com/openai/openai-python/main/src/openai/resources/audio/transcriptions.py)

Misma fuente primaria, referenciada para la distinción entre ASR y razonamiento/reescritura.

### S44

**OpenAI: tipo oficial de configuración realtime transcription**

[Fuente consultada](https://raw.githubusercontent.com/openai/openai-python/main/src/openai/types/realtime/realtime_transcription_session_create_request_param.py)

Confirma una modalidad distinta de transcripción. No se realizaron llamadas ni se verificó rendimiento infantil.

### S45

**Deepgram: SDK oficial**

[Fuente consultada](https://raw.githubusercontent.com/deepgram/deepgram-python-sdk/main/README.md)

Ejemplos streaming, Listen/Flux/Nova y selección de idioma. No inferir que todos sus modelos sean bilingües equivalentes.

### S46

**Speechmatics: SDK oficial**

[Fuente consultada](https://raw.githubusercontent.com/speechmatics/speechmatics-python-sdk/main/README.md)

Parciales/finales en realtime y configuración; sin benchmark común infantil.

### S47

**Soniox: SDK oficial**

[Fuente consultada](https://raw.githubusercontent.com/soniox/soniox-python/main/README.md)

Streaming y separación de tokens finales/no finales; ejemplo de protocolo incremental.

### S48

**AssemblyAI: SDK oficial**

[Fuente consultada](https://raw.githubusercontent.com/AssemblyAI/assemblyai-python-sdk/master/README.md)

Streaming y rutas de dictado/transcripción; algunas rutas permiten reescritura opcional, que no es evidencia de lectura.

### S49

**SpeechAce: muestras oficiales**

[Fuente consultada](https://raw.githubusercontent.com/speechace/speechace-api-samples/master/README.md)

API de pronunciación que recibe audio; descripción centrada en inglés. No se verificaron tarifas ni soporte español actual.

### S50

**Autores: Adaptation of Whisper models to child speech recognition**

[Fuente consultada](https://raw.githubusercontent.com/c3imaging/whisper_child_speech/main/README.md)

Repositorio con tablas MyST/PFSTAR/CMU y adaptación. Se leyó también el resumen indexado del artículo 2307.13008; no su PDF completo.

### S51

**Autores: comparación Conformer-Transducer, Whisper y wav2vec2 infantil**

[Fuente consultada](https://raw.githubusercontent.com/C3Imaging/child_asr_conformer/main/README.md)

Repositorio y resumen indexado del artículo 2311.04936; evidencia de adaptación y variación entre corpus, no Fold/ES.

### S52

**LiteChildASR: adaptación ligera de Whisper infantil**

[Fuente consultada](https://raw.githubusercontent.com/SatwikDutta/LiteChildASR/master/README.md)

Repositorio de autores y resumen 2507.14451. tiny.en/MyST/Pi; trabajo en progreso y peso enlazado no accesible para auditar licencia.

### S53

**DrivenData: reto infantil Word/Phonetic, referencia**

[Fuente consultada](https://raw.githubusercontent.com/drivendataorg/childrens-speech-recognition-benchmark-pub/main/README.md)

Separación explícita entre palabras y fonemas, tutoriales y restricciones de datos.

### S54

**DrivenData: runtime del reto infantil**

[Fuente consultada](https://raw.githubusercontent.com/drivendataorg/childrens-speech-recognition-runtime/main/README.md)

Infraestructura de evaluación; no confundir con un motor móvil listo.

### S55

**Classroom-ASR: repositorio en preparación**

[Fuente consultada](https://raw.githubusercontent.com/WuZhongdi/classroom-asr/main/README.md)

Acceso controlado y licencia pendiente; no hay autorización general para obtener/redistribuir audio infantil ni resultados verificables en el README consultado.

### S56

**WhisperX**

[Fuente consultada](https://raw.githubusercontent.com/m-bain/whisperX/main/README.md)

Transcripción/alineación y contexto de sincronización. La alineación forzada no prueba por sí sola la lectura del texto esperado.

### S57

**Montreal Forced Aligner**

[Fuente consultada](https://raw.githubusercontent.com/MontrealCorpusTools/Montreal-Forced-Aligner/main/README.md)

Herramienta de alineación forzada; distinta de seguimiento vivo con capacidad de rechazo.

### S58

**ReadAlongs Studio**

[Fuente consultada](https://raw.githubusercontent.com/ReadAlongs/Studio/main/README.md)

Creación de lecturas audio/texto sincronizadas; no equivale al motor de Google Read Along ni a un tutor en vivo.

### S59

**PocketSphinx**

[Fuente consultada](https://raw.githubusercontent.com/cmusphinx/pocketsphinx/main/README.md)

Reconocimiento y gramáticas; referencia de enfoques restringidos, no garantía de lectura infantil bilingüe.

### S60

**NVIDIA NeMo**

[Fuente consultada](https://raw.githubusercontent.com/NVIDIA/NeMo/main/README.md)

Herramientas de entrenamiento/inferencia; desplegar modelos grandes en Android exige trabajo adicional.

### S61

**SpeechBrain**

[Fuente consultada](https://raw.githubusercontent.com/speechbrain/speechbrain/develop/README.md)

Toolkit de investigación; no constituye por sí solo un módulo Expo de lectura.

### S62

**NVIDIA Parakeet TDT 0.6b v2: ficha de modelo**

[Fuente consultada](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v2/raw/main/README.md)

Variante inglesa concreta; no extrapolar su alcance a toda la familia Parakeet.

### S63

**React Native Voice: aviso de deprecación**

[Fuente consultada](https://raw.githubusercontent.com/react-native-voice/voice/master/README.md)

El README se declara deprecado/archivado y recomienda expo-speech-recognition. Evita basar la implementación en tutoriales antiguos.

### S64

**Moonshine: ejemplo oficial Transcriber Android**

[Fuente consultada](https://raw.githubusercontent.com/moonshine-ai/moonshine/main/examples/android/Transcriber/app/build.gradle.kts)

Ejemplo nativo y requisitos de build; no demuestra integración RN ni precisión con niños.

### S65

**Google Cloud: ejemplo oficial de streaming prolongado**

[Fuente consultada](https://raw.githubusercontent.com/GoogleCloudPlatform/python-docs-samples/main/speech/microphone/transcribe_streaming_infinite.py)

Demuestra gestión de límites, reinicios y audio superpuesto; no es un streaming infinito garantizado por el servicio.

### S66

**Google: muestra general de ML Kit GenAI**

[Fuente consultada](https://raw.githubusercontent.com/googlesamples/mlkit/master/android/genai/README.md)

Contexto de la familia de APIs; no sustituye el contrato específico de Speech.

## Conversaciones técnicas y cambios de mantenedores

Estos reportes son útiles para diseñar reproducciones. Un issue abierto o un PR cerrado por sí solo no demuestra frecuencia, corrección distribuida ni estado de la versión instalada. Se comprobaron los campos de fusión de los PR relevantes.

### F01

**Pérdida de final al detener Android continuo**

[Conversación o cambio](https://github.com/jamsch/expo-speech-recognition/issues/165)

Reporte concreto, no prevalencia poblacional.

### F02

**Carrera al cerrar el flujo local y perder el final**

[Conversación o cambio](https://github.com/jamsch/expo-speech-recognition/issues/158)

Reporte en API/locale/versiones concretas; no generalizar a todos los teléfonos.

### F03

**Sustitución de hipótesis después de una pausa**

[Conversación o cambio](https://github.com/jamsch/expo-speech-recognition/issues/87)

Motiva manejar segmento/revisión y no concatenar ciegamente.

### F04

**iOS: degradación silenciosa del requisito local**

[Conversación o cambio](https://github.com/jamsch/expo-speech-recognition/issues/169)

Se inspeccionó código 57.0.0 y la respuesta pública del mantenedor. No habilitar por defecto la ruta remota.

### F05

**PR de corrección de stop en Android**

[Conversación o cambio](https://github.com/jamsch/expo-speech-recognition/pull/163)

API GitHub: abierto y merged=false durante la consulta. No tratar como corrección distribuida.

### F06

**Crecimiento de memoria/cola en RealtimeTranscriber**

[Conversación o cambio](https://github.com/mybigday/whisper.rn/issues/339)

Reporte sobre 0.7.4 y ruta realtime; no es la ruta transcribeData usada actualmente por Kitewise.

### F07

**PR de unidades del pre-roll VAD**

[Conversación o cambio](https://github.com/mybigday/whisper.rn/pull/338)

API GitHub: merged=true el 2026-09-29; no implica inclusión en npm 0.7.4.

### F08

**PR de límites de memoria/trabajo realtime**

[Conversación o cambio](https://github.com/mybigday/whisper.rn/pull/340)

API GitHub: merged=true el 2026-10-06; distinguir main del paquete estable.

### F09

**Ruta sin VAD y callback estabilizado sin salida**

[Conversación o cambio](https://github.com/mybigday/whisper.rn/issues/330)

Reporte específico; conservar como caso de reproducción al ensayar esa API.

### F10

**PR para reconocimiento con minificación R8**

[Conversación o cambio](https://github.com/jamsch/expo-speech-recognition/pull/174)

API GitHub: merged=true; justifica comprobar el APK release y la versión exacta, sin suponer incidencia actual en Kitewise.

### Respuesta del mantenedor en F04

[Comentarios públicos del issue 169](https://github.com/jamsch/expo-speech-recognition/issues/169#issuecomment-5472658442). Se consultó el endpoint de comentarios completo; el mantenedor coincide en que no debería degradarse silenciosamente y plantea emitir un error.

## Páginas no accesibles y vacíos explícitos

| Fuente intentada | Resultado | Cómo se trató |
|---|---|---|
| [vosk-models](https://alphacephei.com/vosk/models) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [listen](https://www.cs.cmu.edu/~listen/) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [google-mlkit-doc](https://developers.google.com/ml-kit/genai/speech-recognition) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [google-voice-sdk](https://support.google.com/gboard/answer/11197787?hl=en) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [android-docs](https://developer.android.com/reference/android/speech/SpeechRecognizer) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [azure-pronunciation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [google-stt](https://cloud.google.com/speech-to-text/docs/streaming-recognize) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [openai-stt](https://developers.openai.com/api/docs/guides/speech-to-text) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [arxiv](https://arxiv.org/search/?query=children+speech+recognition&searchtype=all) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [crossref](https://api.crossref.org/works?query=children%20speech%20recognition%20whisper&rows=5) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [bing](https://www.bing.com/search?q=child+speech+recognition+read+along+benchmark) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [duckduckgo](https://html.duckduckgo.com/html/?q=child+speech+recognition+read+along+benchmark) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [stackoverflow](https://stackoverflow.com/questions/tagged/android-speechrecognition) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [gboard-help](https://support.google.com/gboard/answer/11197787?hl=en) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [google-readalong](https://readalong.google/) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |
| [google-research](https://research.google/blog/reading-with-children/) | HTTP 403 del entorno | No se presenta como leída; se usó fuente original alternativa cuando existía |

Los 404 de rutas exploratorias no prueban que una función o un producto no exista. Los 401 de fichas/pesos no permiten concluir una licencia ni disponibilidad pública. Las búsquedas semánticas de papers devolvieron también resultados irrelevantes: no se incorporaron por aparecer en una búsqueda. No se accedió a cuentas privadas ni se pidieron claves.

## Alcance de los artículos

Para los artículos 2307.13008, 2311.04936 y 2507.14451 se consultaron repositorios de autores y sus resúmenes indexados en [la búsqueda de Hugging Face](https://huggingface.co/api/papers/search?q=children%20speech%20recognition). arXiv/PDF no fueron accesibles desde este entorno. Los resultados cuantitativos citados están en los repositorios/resúmenes y se atribuyen a sus condiciones; no se afirmó lectura íntegra del PDF.

## Fuentes del proyecto

- `docs/03-READING-ENGINE.md`: objetivo y política de tolerancia.
- `docs/07-PRIVACY-AUDIO.md` y `docs/DECISIONS.md`, D1: voz no persistida ni enviada.
- `docs/06-CHILD-UX-RULES.md`: ayuda no punitiva y lectura como foco.
- Código inventariado y reproducido en [AUDITORIA-CODIGO.md](AUDITORIA-CODIGO.md).
