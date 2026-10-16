/** Día local `AAAA-MM-DD` (el repaso 1-3-7 cuenta días del niño, no de UTC). */
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
