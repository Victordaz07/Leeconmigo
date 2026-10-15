import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Tipografías (docs/05): Andika para leer, Nunito para la interfaz, JetBrains Mono solo en el panel de desarrollo.
// Solo el subconjunto latino (cubre español e inglés): los demás alfabetos no se usan.
import '@fontsource/andika/latin-400.css';
import '@fontsource/andika/latin-700.css';
import '@fontsource-variable/nunito';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-700.css';
import './styles.css';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
