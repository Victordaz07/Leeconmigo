import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** true si el sistema pide reducir el movimiento: las animaciones que se repiten (anillo del mic) se apagan. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduced(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduced;
}
