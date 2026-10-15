import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Un solo comando (`npm test`) corre las pruebas de todos los paquetes y de la app.
// Las pruebas de componentes declaran `// @vitest-environment jsdom` en su primera línea.
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['packages/*/tests/**/*.test.{ts,tsx}', 'apps/*/tests/**/*.test.{ts,tsx}'],
    environment: 'node',
    // Con cada historia nueva, la prueba de humo de la biblioteca completa (`apps/reader/tests/library.test.tsx`) y las de
    // sesión de varias páginas leen más y más texto con el motor real; el límite de 5 s por defecto ya se cumplía justo y
    // empezó a fallar de forma intermitente bajo carga (no por un error de lógica: en aislamiento siempre pasaban).
    testTimeout: 20000,
  },
});
