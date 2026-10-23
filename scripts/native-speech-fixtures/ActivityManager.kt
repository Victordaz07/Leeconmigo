package android.app
class ApplicationExitInfo(val reason: Int, val status: Int, val timestamp: Long) {
    val description = "PRIVATE DATA MUST NOT BE READ"
}
class ActivityManager {
    fun getHistoricalProcessExitReasons(name: String, pid: Int, count: Int) = listOf(ApplicationExitInfo(5, 11, 1000L))
}
