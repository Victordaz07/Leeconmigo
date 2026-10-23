/** Reproducible privacy hardening of the pinned wrapper. Applied during Expo prebuild, never to generated native code.
 * Fails on upstream drift rather than silently shipping logs or a generic network recognizer.
 */
const fs = require('node:fs');
const path = require('node:path');
const { withDangerousMod } = require('expo/config-plugins');

function replace(source, before, after) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error('Speech privacy patch no longer matches pinned 57.0.0');
  return source.replace(before, after);
}
function hardenSpeech(projectRoot) {
  const root = path.dirname(require.resolve('expo-speech-recognition/package.json', { paths: [projectRoot] }));
  if (JSON.parse(fs.readFileSync(path.join(root, 'package.json'))).version !== '57.0.0') throw new Error('Audit speech wrapper before upgrading');
  const dir = path.join(root, 'android/src/main/java/expo/modules/speechrecognition');
  let service = fs.readFileSync(path.join(dir, 'ExpoSpeechService.kt'), 'utf8');
  service = replace(service, 'Log.d("ExpoSpeechService", message)', '// Kitewise D1: do not log transcripts or recognition options.');
  service = replace(service,
    'private fun createSpeechRecognizer(options: SpeechRecognitionOptions): SpeechRecognizer? {',
    'private fun createSpeechRecognizer(options: SpeechRecognitionOptions): SpeechRecognizer? {\n        check(Build.VERSION.SDK_INT >= 33 && options.requiresOnDeviceRecognition == true) { "Kitewise requires strict local recognition" }');
  service = replace(service, '            log("Start recognition.")\n\n            // Destroy', '            log("Start recognition.")\n            try {\n            // Destroy');
  service = service.replace('            try {\n                val intent = createSpeechIntent(options)', '                val intent = createSpeechIntent(options)');
  // Android callbacks and teardown must stay on the main executor. Provider failures
  // must reject the promise, not escape the posted Runnable and terminate the process.
  let module = fs.readFileSync(path.join(dir, 'ExpoSpeechRecognitionModule.kt'), 'utf8');
  module = replace(module, 'Executors.newSingleThreadExecutor(),\n                @RequiresApi', 'appContext.mainExecutor,\n                @RequiresApi');
  module = replace(module, '            val recognizer =\n                if (serviceComponent', '            var recognizer: SpeechRecognizer? = null\n            try {\n            recognizer =\n                if (serviceComponent');
  const unsafeCleanup = '                        recognizer.destroy()';
  const safeCleanup = '                        try { recognizer?.destroy() } catch (_: Exception) {}';
  if (!module.includes(unsafeCleanup) && !module.includes(safeCleanup)) throw new Error('Missing recognition cleanup sites');
  module = module.replaceAll(unsafeCleanup, safeCleanup);
  module = replace(module, '            )\n        }\n    }\n}', `            )
            } catch (e: Exception) {
                try { recognizer?.destroy() } catch (_: Exception) {}
                if (settled.compareAndSet(false, true)) {
                    promise.reject("local_recognition_unavailable", "Local recognition capability check failed", e)
                }
            }
        }
    }
}`);
  module = replace(module, 'import expo.modules.kotlin.Promise', 'import expo.modules.kotlin.functions.Queues\nimport expo.modules.kotlin.Promise');
  for (const name of ['requestPermissionsAsync', 'requestMicrophonePermissionsAsync']) {
    const before = `            AsyncFunction("${name}") { promise: Promise ->
                askForPermissionsWithPermissionsManager(
                    appContext.permissions,
                    promise,
                    RECORD_AUDIO,
                )
            }`;
    const after = `            AsyncFunction("${name}") { promise: Promise ->
                appContext.reactContext?.let { KitewiseSpeechFailure.install(it) }
                askForPermissionsWithPermissionsManager(
                    appContext.permissions,
                    promise,
                    RECORD_AUDIO,
                )
            }.runOnQueue(Queues.MAIN)`;
    module = replace(module, before, after);
  }
  const oldHooks = `            OnCreate {
                appContext.reactContext?.let { KitewiseSpeechFailure.install(it) }
            }
            Function("getLastSpeechFailure") {
                appContext.reactContext?.let { KitewiseSpeechFailure.read(it) }
            }
            OnDestroy {`;
  const hooks = `            OnCreate {
                appContext.reactContext?.let { KitewiseSpeechFailure.install(it) }
            }
            Function("getLastAppExitInfo") {
                appContext.reactContext?.let { KitewiseSpeechFailure.lastExits(it) }
            }
            Function("getLastSpeechFailure") {
                appContext.reactContext?.let { KitewiseSpeechFailure.read(it) }
            }
            OnDestroy {`;
  if (!module.includes('Function("getLastAppExitInfo")')) {
    module = replace(module, module.includes(oldHooks) ? oldHooks : '            OnDestroy {', hooks);
  }
  fs.copyFileSync(path.join(__dirname, 'KitewiseSpeechFailure.kt'), path.join(dir, 'KitewiseSpeechFailure.kt'));
  fs.writeFileSync(path.join(dir, 'ExpoSpeechRecognitionModule.kt'), module);
  fs.writeFileSync(path.join(dir, 'ExpoSpeechService.kt'), service);
  let recorder = fs.readFileSync(path.join(dir, 'ExpoAudioRecorder.kt'), 'utf8');
  for (const [before, after] of [
    ['private val tempPcmFile: File\n', 'private val tempPcmFile: File?\n'],
    ['tempPcmFile = createTempPcmFile()', 'tempPcmFile = if (outputFilePath != null) createTempPcmFile() else null'],
    ['                        tempPcmFile,', '                        tempPcmFile!!,'],
    ['val tempFileOutputStream = FileOutputStream(tempPcmFile)', 'val tempFileOutputStream = tempPcmFile?.let { FileOutputStream(it) }'],
    ['tempFileOutputStream.write(data, 0, read)', 'tempFileOutputStream?.write(data, 0, read)'],
    ['tempFileOutputStream.flush()', 'tempFileOutputStream?.flush()'],
    ['tempFileOutputStream.close()', 'tempFileOutputStream?.close()'],
  ]) recorder = replace(recorder, before, after);
  recorder = replace(recorder, '            if (this.state != AudioRecord.STATE_INITIALIZED) {\n                return\n            }', '            check(this.state == AudioRecord.STATE_INITIALIZED) { "Microphone could not initialize" }');
  recorder = replace(recorder, '    private var isRecordingAudio = false', '    @Volatile private var isRecordingAudio = false');
  recorder = replace(recorder, '    private var audioRecorder: AudioRecord? = null', '    @Volatile private var audioRecorder: AudioRecord? = null');
  recorder = replace(recorder, '        audioRecorder?.stop()\n        audioRecorder?.release()\n        audioRecorder = null', `        // Detach before stopping: a worker may still hold a read in progress.
        val recorder = audioRecorder
        audioRecorder = null
        try { recorder?.stop() } catch (_: IllegalStateException) {
            // Initialization failure or an already-stopped Android recorder.
        } finally {
            recorder?.release()
        }`);
  recorder = replace(recorder, '            val read =\n                if (Build.VERSION.SDK_INT', '            val read = try {\n                if (Build.VERSION.SDK_INT');
  recorder = replace(recorder, '                    recorder.read(data, 0, data.size)\n                }\n\n            when', `                    recorder.read(data, 0, data.size)
                }
            } catch (_: IllegalStateException) {
                // Android may throw when stop/release interrupts a pending read.
                // Never let this race escape the worker and kill the whole app.
                break
            }

            when`);
  fs.writeFileSync(path.join(dir, 'ExpoAudioRecorder.kt'), recorder);
}
module.exports = config => withDangerousMod(config, ['android', async cfg => { hardenSpeech(cfg.modRequest.projectRoot); return cfg; }]);
module.exports.hardenSpeech = hardenSpeech;
