/**
 * Lienzo de tablet: el diseño aprobado está dibujado para una pantalla de 1508×996 px (tablet horizontal).
 * Este componente lo escala para que quepa en la ventana, con márgenes si la proporción no coincide, de modo
 * que la interfaz se ve exactamente como se aprobó en cualquier tamaño de pantalla.
 *
 * Con `adaptive` (páginas de cómic con globos dibujados) el lienzo NO tiene alto fijo: conserva el ancho de diseño y toma el
 * alto que corresponde a la proporción real de la pantalla (entre `MIN_ADAPTIVE_HEIGHT` y `MAX_ADAPTIVE_HEIGHT`), así la
 * ilustración completa y las barras laterales aprovechan toda la pantalla, sea 16:10, 3:2 o 4:3. `useCanvasSize` dice el
 * tamaño de diseño actual.
 *
 * LIMITACIÓN CONOCIDA: solo existe diseño horizontal. La versión vertical de tablet (y teléfono) que piden
 * docs/05 y docs/08 todavía no está diseñada; aquí se muestra el mismo lienzo escalado.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export const DESIGN_WIDTH = 1508;
export const DESIGN_HEIGHT = 996;
export const MIN_ADAPTIVE_HEIGHT = 940;
export const MAX_ADAPTIVE_HEIGHT = 1180;

const CanvasSize = createContext({ width: DESIGN_WIDTH, height: DESIGN_HEIGHT });
/** Tamaño de diseño del lienzo en este momento (px de diseño, antes de escalar a la pantalla). */
export const useCanvasSize = () => useContext(CanvasSize);

/** Alto de diseño para una pantalla de `w × h` px: el del ancho de diseño con la misma proporción, acotado. */
export function adaptiveHeight(w: number, h: number): number {
  if (!(w > 0) || !(h > 0)) return DESIGN_HEIGHT;
  return Math.round(Math.min(MAX_ADAPTIVE_HEIGHT, Math.max(MIN_ADAPTIVE_HEIGHT, (DESIGN_WIDTH * h) / w)));
}

export function TabletCanvas({ children, adaptive = false }: { children: ReactNode; adaptive?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const height = adaptive ? adaptiveHeight(box.w, box.h) : DESIGN_HEIGHT;
  const scale = box.w > 0 && box.h > 0 ? Math.min(box.w / DESIGN_WIDTH, box.h / height) : 1;

  return (
    <div ref={host} className="absolute inset-0 grid place-items-center overflow-hidden bg-stage">
      <div style={{ width: DESIGN_WIDTH * scale, height: height * scale }}>
        <div
          data-testid="tablet-canvas"
          className="relative flex overflow-hidden bg-app-alt text-ink"
          style={{ width: DESIGN_WIDTH, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          <CanvasSize.Provider value={{ width: DESIGN_WIDTH, height }}>{children}</CanvasSize.Provider>
        </div>
      </div>
    </div>
  );
}
