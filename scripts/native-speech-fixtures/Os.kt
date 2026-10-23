package android.os
object Build {
    object VERSION { const val SDK_INT = 36 }
    object VERSION_CODES { const val GINGERBREAD = 9; const val M = 23 }
}
class ParcelFileDescriptor {
    fun close() {}
    class AutoCloseOutputStream(parcel: ParcelFileDescriptor) : java.io.OutputStream() {
        override fun write(value: Int) {}
    }
    companion object { fun createPipe() = arrayOf(ParcelFileDescriptor(), ParcelFileDescriptor()) }
}
