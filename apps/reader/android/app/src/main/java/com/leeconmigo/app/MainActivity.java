package com.leeconmigo.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

/**
 * Pantalla completa "inmersiva": oculta la barra de estado y la de navegación de Android mientras se usa la
 * app (docs/05 pide que la tecnología "desaparezca detrás de la lectura"; Victor lo pidió explícitamente
 * probando en una tablet real, 2026-09-29 — la barra inferior no cumple ninguna función dentro de la app).
 * Con un gesto de borde el sistema las muestra un instante y se ocultan solas de nuevo
 * (BEHAVIOR_SHOW_TRANSIENT_BY_USER_SWIPE), así nunca queda al usuario sin forma de salir de la app.
 */
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    hideSystemBars();
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) hideSystemBars();
  }

  private void hideSystemBars() {
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    WindowInsetsControllerCompat controller = new WindowInsetsControllerCompat(getWindow(), getWindow().getDecorView());
    controller.hide(androidx.core.view.WindowInsetsCompat.Type.systemBars());
    controller.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
  }
}
