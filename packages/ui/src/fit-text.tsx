/**
 * Texto que llena su caja: busca la letra MÁS GRANDE (entre un mínimo y un tope) con la que el contenido cabe entero en la
 * caja, sin recortar nada. Es lo que acomoda el texto dentro de los globos dibujados en la ilustración.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { TextVAlign } from '@lee-conmigo/contracts';

/**
 * Tamaño más grande en [min, max] para el que `fits` es verdadero (búsqueda binaria, precisión de 0,5 px). Si ni el mínimo cabe,
 * devuelve el mínimo (el texto se verá justo, pero nunca más pequeño que eso); si el tope cabe, devuelve el tope.
 */
export function bestFontSize(fits: (px: number) => boolean, min: number, max: number): number {
  if (max <= min) return min;
  if (fits(max)) return max;
  if (!fits(min)) return min;
  let lo = min;
  let hi = max;
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    if (fits(mid)) lo = mid;
    else hi = mid;
  }
  return Math.floor(lo * 2) / 2;
}

export interface FitBoxInfo {
  /** Letra usada (px de pantalla). */
  font: number;
  /** El texto no cabe ni con la letra mínima. */
  overflow: boolean;
}

export interface FitBoxProps {
  /** Caja (px de pantalla). */
  width: number;
  height: number;
  /** Letra mínima y máxima (px de pantalla) cuando se ajusta sola. */
  minFont: number;
  maxFont: number;
  /** Letra fija (px de pantalla): no se ajusta. */
  fixedFont?: number;
  valign?: TextVAlign;
  /** Cambia cuando cambia el texto (para volver a ajustar). */
  fitKey: string;
  style?: CSSProperties;
  className?: string;
  onFit?: (info: FitBoxInfo) => void;
  children: ReactNode;
}

const JUSTIFY = { top: 'flex-start', middle: 'center', bottom: 'flex-end' } as const;

/**
 * Píxeles de holgura al comparar el ancho del contenido con el de la caja. Las palabras llevan márgenes negativos (para que el
 * resaltador las envuelva) y, con letras pequeñas, `scrollWidth` sale 1 px más que `clientWidth`: sin holgura, ni la letra mínima
 * "cabía" y un cuadro largo se quedaba en el mínimo aunque sobrara espacio.
 */
export const FIT_SLACK_PX = 2;

/** ¿El contenido cabe en la caja (con la holgura de ancho)? Recibe las medidas del navegador. */
export function contentFits(content: { height: number; scrollWidth: number }, box: { height: number; width: number }): boolean {
  return content.height <= box.height && content.scrollWidth <= box.width + FIT_SLACK_PX;
}

export function FitBox({ width, height, minFont, maxFont, fixedFont, valign = 'middle', fitKey, style, className, onFit, children }: FitBoxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [font, setFont] = useState(fixedFont ?? minFont);
  const report = useRef(onFit);
  report.current = onFit;

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const apply = () => {
      if (fixedFont !== undefined) {
        i.style.fontSize = `${fixedFont}px`;
        setFont(fixedFont);
        report.current?.({ font: fixedFont, overflow: !contentFits({ height: i.offsetHeight - 1, scrollWidth: i.scrollWidth }, { height: o.clientHeight, width: o.clientWidth }) });
        return;
      }
      // Sin diseño calculable (oculto, pruebas sin navegador): letra mínima.
      if (o.clientHeight === 0 || o.clientWidth === 0) {
        setFont(minFont);
        return;
      }
      const fits = (px: number) => {
        i.style.fontSize = `${px}px`;
        return contentFits({ height: i.offsetHeight, scrollWidth: i.scrollWidth }, { height: o.clientHeight, width: o.clientWidth });
      };
      const best = bestFontSize(fits, minFont, maxFont);
      i.style.fontSize = `${best}px`;
      setFont(best);
      report.current?.({ font: best, overflow: !fits(best) });
      i.style.fontSize = `${best}px`;
    };
    apply();
    // La tipografía puede terminar de cargar después y cambiar los saltos de línea.
    void (typeof document !== 'undefined' ? document.fonts?.ready.then(apply) : undefined);
  }, [fitKey, width, height, minFont, maxFont, fixedFont]);

  return (
    <div ref={outer} className={className} style={{ ...style, width, height, display: 'flex', flexDirection: 'column', justifyContent: JUSTIFY[valign], overflow: 'hidden' }}>
      <div ref={inner} style={{ fontSize: font, flex: 'none', width: '100%' }}>
        {children}
      </div>
    </div>
  );
}
