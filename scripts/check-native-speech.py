#!/usr/bin/env python3
"""Execute the actual patched Kotlin recorder with deterministic Android lifecycle doubles.
No microphone/audio/files: tests error boundaries, not acoustic accuracy or a physical device.
Run after the Gradle Kotlin compilation has populated its compiler cache.
"""
import os
from pathlib import Path
import subprocess
import tempfile

root = Path(__file__).resolve().parent.parent
cache = Path(os.environ.get('GRADLE_USER_HOME', Path.home() / '.gradle')) / 'caches/modules-2/files-2.1'
compiler = sorted(cache.glob('org.jetbrains.kotlin/kotlin-compiler-embeddable/*/*/*.jar'))[-1]
version = compiler.parents[1].name
jars = [compiler]
for group, artifact, selected in [
    ('org.jetbrains.kotlin', 'kotlin-stdlib', version),
    ('org.jetbrains.kotlin', 'kotlin-script-runtime', version),
    ('org.jetbrains.kotlin', 'kotlin-reflect', version),
    ('org.jetbrains.intellij.deps', 'trove4j', '*'),
    ('org.jetbrains.kotlinx', 'kotlinx-coroutines-core-jvm', '*'),
    ('org.jetbrains', 'annotations', '*'),
]:
    matches = sorted(cache.glob(f'{group}/{artifact}/{selected}/*/*.jar'))
    if matches:
        jars.append(matches[-1])
classpath = os.pathsep.join(map(str, jars))
java = str(Path(os.environ['JAVA_HOME']) / 'bin/java') if 'JAVA_HOME' in os.environ else 'java'
source = Path(os.environ.get('SPEECH_RECORDER_SOURCE', root / 'node_modules/expo-speech-recognition/android/src/main/java/expo/modules/speechrecognition/ExpoAudioRecorder.kt'))
with tempfile.TemporaryDirectory(prefix='kitewise-native-speech-') as tmp:
    subprocess.run([java, '-cp', classpath, 'org.jetbrains.kotlin.cli.jvm.K2JVMCompiler', '-nowarn', '-no-stdlib', '-no-reflect', '-classpath', classpath, '-d', tmp, str(source), str(root / 'node_modules/expo-speech-recognition/android/src/main/java/expo/modules/speechrecognition/KitewiseSpeechFailure.kt'), *map(str, (root / 'scripts/native-speech-fixtures').glob('*.kt'))], check=True)
    subprocess.run([java, '-cp', tmp + os.pathsep + classpath, 'MainKt'], check=True)
