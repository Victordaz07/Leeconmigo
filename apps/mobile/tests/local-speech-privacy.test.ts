import { describe, expect, it } from 'vitest';
// @ts-expect-error -- Node-only test; the native application intentionally excludes Node globals.
import { createRequire } from 'node:module';
// @ts-expect-error -- Node-only test; the native application intentionally excludes Node globals.
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
// @ts-expect-error -- Node-only test; the native application intentionally excludes Node globals.
import { dirname, join } from 'node:path';
// @ts-expect-error -- Node-only test; the native application intentionally excludes Node globals.
import { tmpdir } from 'node:os';
const require = createRequire(import.meta.url);
const { hardenSpeech } = require('../plugins/local-speech.js');

describe('reproducible native privacy guard', () => {
  it('hardens the pinned wrapper and is idempotent on repeated prebuilds', () => {
    const temp = mkdtempSync(join(tmpdir(), 'kitewise-local-speech-'));
    try {
      const source = dirname(require.resolve('expo-speech-recognition/package.json'));
      const target = join(temp, 'node_modules/expo-speech-recognition');
      cpSync(source, target, { recursive: true });
      hardenSpeech(temp);
      const dir = join(target, 'android/src/main/java/expo/modules/speechrecognition');
      const service = readFileSync(join(dir, 'ExpoSpeechService.kt'), 'utf8');
      const module = readFileSync(join(dir, 'ExpoSpeechRecognitionModule.kt'), 'utf8');
      const recorder = readFileSync(join(dir, 'ExpoAudioRecorder.kt'), 'utf8');
      expect(service).not.toContain('Log.d("ExpoSpeechService", message)');
      expect(service).toContain('check(Build.VERSION.SDK_INT >= 33 && options.requiresOnDeviceRecognition == true)');
      expect(recorder).toContain('tempPcmFile = if (outputFilePath != null) createTempPcmFile() else null');
      expect(recorder).toContain('val tempFileOutputStream = tempPcmFile?.let { FileOutputStream(it) }');
      expect(module).toContain('appContext.mainExecutor,');
      expect(module.match(/runOnQueue\(Queues.MAIN\)/g)).toHaveLength(2);
      expect(module.match(/Function\("getLastAppExitInfo"\)/g)).toHaveLength(1);
      expect(module.match(/Function\("getLastSpeechFailure"\)/g)).toHaveLength(1);
      expect(module.slice(module.indexOf('private fun getSupportedLocales('))).not.toContain('Executors.newSingleThreadExecutor(),');
      expect(module).toContain('promise.reject("local_recognition_unavailable"');
      expect(module).not.toContain('                        recognizer.destroy()');
      expect(recorder).toContain('@Volatile private var isRecordingAudio');
      expect(recorder).toContain('val read = try {');
      hardenSpeech(temp);
      expect(readFileSync(join(dir, 'ExpoSpeechRecognitionModule.kt'), 'utf8')).toBe(module);
      expect(readFileSync(join(dir, 'ExpoSpeechService.kt'), 'utf8')).toBe(service);
      expect(readFileSync(join(dir, 'ExpoAudioRecorder.kt'), 'utf8')).toBe(recorder);
    } finally { rmSync(temp, { recursive: true, force: true }); }
  });
});
