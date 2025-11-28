/** useRaf - requestAnimationFrame loop hook at up to 60 FPS */
import { useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export function useRaf(callback, active = true) {
  /** Call callback on each animation frame while active. */
  const saved = useRef(callback);
  const rafRef = useRef(null);

  useEffect(() => { saved.current = callback; }, [callback]);

  useEffect(() => {
    if (!active) return;
    let running = true;
    const loop = (t) => {
      if (!running) return;
      saved.current?.(t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);
}
