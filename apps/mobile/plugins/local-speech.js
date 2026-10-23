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
  fs.writeFileSync(path.join(dir, 'ExpoAudioRecorder.kt'), recorder);
}
module.exports = config => withDangerousMod(config, ['android', async cfg => { hardenSpeech(cfg.modRequest.projectRoot); return cfg; }]);
module.exports.hardenSpeech = hardenSpeech;
