package android.content
class Context {
    val cacheDir = java.io.File(System.getProperty("java.io.tmpdir"))
    val applicationContext get() = this
    val packageName = "com.kitewise.app"
    fun getSystemService(name: String) = android.app.ActivityManager()
    fun getSharedPreferences(name: String, mode: Int) = prefs
    companion object { const val ACTIVITY_SERVICE = "activity"; const val MODE_PRIVATE = 0; val prefs = Preferences() }
}
class Preferences {
    private val values = mutableMapOf<String, String>()
    fun getString(key: String, fallback: String?) = values[key] ?: fallback
    fun edit() = this
    fun putString(key: String, value: String): Preferences { values[key] = value; return this }
    fun commit() = true
}
