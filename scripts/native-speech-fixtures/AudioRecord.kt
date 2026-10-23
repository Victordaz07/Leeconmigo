package android.media

import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

object AudioFormat { const val CHANNEL_IN_MONO = 16; const val ENCODING_PCM_16BIT = 2 }
object MediaRecorder { object AudioSource { const val VOICE_RECOGNITION = 6 } }
class AudioRecord(source: Int, rate: Int, channel: Int, encoding: Int, size: Int) {
    val state = if (failInitialization) 0 else STATE_INITIALIZED
    fun startRecording() {}
    fun stop() {
        stopped.countDown()
        if (failInitialization) throw IllegalStateException("Uninitialized recorder")
    }
    fun release() { released = true }
    fun read(data: ByteArray, offset: Int, size: Int, mode: Int = 0): Int {
        reading.countDown()
        check(stopped.await(3, TimeUnit.SECONDS)) { "Test did not interrupt read" }
        // Inject a platform exception while release interrupts a pending read.
        throw IllegalStateException("Recorder released during pending read")
    }
    companion object {
        const val STATE_INITIALIZED = 1; const val READ_BLOCKING = 0
        const val ERROR_DEAD_OBJECT = -6; const val ERROR_INVALID_OPERATION = -3; const val ERROR_BAD_VALUE = -2
        var failInitialization = false
        var released = false
        var reading = CountDownLatch(1)
        var stopped = CountDownLatch(1)
        fun getMinBufferSize(rate: Int, channel: Int, encoding: Int) = 320
    }
}
