/**
 * Ángulo CSS (0 = hacia arriba, 90 = hacia la derecha, 180 = hacia abajo) → puntos `start`/`end` de expo-linear-gradient,
 * para que un degradado de `tokens.css` se vea igual en la app nativa.
 */
export function gradientPoints(angle: number): { start: { x: number; y: number }; end: { x: number; y: number } } {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) / 2;
  const dy = -Math.cos(rad) / 2;
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return { start: { x: r(0.5 - dx), y: r(0.5 - dy) }, end: { x: r(0.5 + dx), y: r(0.5 + dy) } };
}
