package expo.modules.speechrecognition

import android.content.Context

/** Local failure codes only. Never persist exception messages, JS stacks, audio or transcripts.
 * Chaining Android's handler preserves normal crash behavior; this is not an error suppressor.
 * OS kills and native signals are outside Java's uncaught-exception handler.
 */
internal object KitewiseSpeechFailure {
    private var installed = false
    private const val PREFS = "kitewise_technical_failure"
    private const val KEY = "last_failure"

    @Synchronized
    fun install(context: Context) {
        if (installed) return
        val app = context.applicationContext
        val previous = Thread.getDefaultUncaughtExceptionHandler() ?: return
        Thread.setDefaultUncaughtExceptionHandler { thread, error ->
            try {
                // Class/method names and source line numbers are static program identifiers.
                // Deliberately omit Throwable.message/toString and JavascriptException's JS stack.
                val summary = buildString {
                    append("Kitewise 0.2.1\n")
                    var cause: Throwable? = error
                    repeat(3) {
                        val current = cause ?: return@repeat
                        append(current.javaClass.name).append('\n')
                        current.stackTrace.take(6).forEach { frame ->
                            append(frame.className).append('.').append(frame.methodName)
                                .append(':').append(frame.lineNumber).append('\n')
                        }
                        cause = current.cause
                    }
                }.take(2400)
                app.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString(KEY, summary).commit()
            } catch (_: Exception) {
                // Failure diagnostics must never interfere with Android's original crash handler.
            } finally {
                previous.uncaughtException(thread, error)
            }
        }
        installed = true
    }

    fun read(context: Context): String? = try {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString(KEY, null)
    } catch (_: Exception) { null }
}
