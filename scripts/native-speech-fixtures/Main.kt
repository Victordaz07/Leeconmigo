import android.media.AudioRecord
import expo.modules.speechrecognition.ExpoAudioRecorder
import expo.modules.speechrecognition.KitewiseSpeechFailure
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicReference

fun main() {
    val uncaught = AtomicReference<Throwable?>()
    Thread.setDefaultUncaughtExceptionHandler { thread, error ->
        if (thread.name == "main") error.printStackTrace() else uncaught.set(error)
    }
    val recorder = ExpoAudioRecorder(android.content.Context(), null)
    recorder.start()
    check(AudioRecord.reading.await(3, TimeUnit.SECONDS)) { "No worker read" }
    // Capture actual worker so success waits for its termination, rather than sleeping.
    val field = recorder.javaClass.getDeclaredField("recordingThread").apply { isAccessible = true }
    val worker = field.get(recorder) as Thread
    recorder.stop()
    worker.join(3000)
    check(!worker.isAlive) { "Capture worker leaked" }
    check(uncaught.get() == null) { "Uncaught native worker exception: ${uncaught.get()}" }
    check(AudioRecord.released) { "Microphone not released" }
    recorder.stop() // Repeated stop must be harmless.
    AudioRecord.failInitialization = true
    AudioRecord.released = false
    val failed = ExpoAudioRecorder(android.content.Context(), null)
    check(runCatching { failed.start() }.isFailure) { "Uninitialized microphone reported successful startup" }
    failed.stop()
    check(AudioRecord.released) { "Uninitialized microphone leaked" }
    val originalHandler = Thread.getDefaultUncaughtExceptionHandler()
    var delegated = 0
    Thread.setDefaultUncaughtExceptionHandler { _, _ -> delegated++ }
    val context = android.content.Context()
    KitewiseSpeechFailure.install(context)
    KitewiseSpeechFailure.install(context) // No duplicate handlers on module reinitialization.
    val failure = IllegalStateException("PRIVATE CHILD SPEECH MUST NOT BE STORED", RuntimeException("PRIVATE RECOGNIZED WORDS"))
    Thread.getDefaultUncaughtExceptionHandler()!!.uncaughtException(Thread.currentThread(), failure)
    val report = KitewiseSpeechFailure.read(context)!!
    check(report.contains("java.lang.IllegalStateException"))
    check(!report.contains("PRIVATE")) { "Exception content leaked to disk" }
    check(delegated == 1) { "Original crash handler not called exactly once" }
    Thread.setDefaultUncaughtExceptionHandler(originalHandler)
    println("PASS: interrupted read, worker termination, repeated stop, failed initialization cleanup; local report redaction and original handler delegation")
}
