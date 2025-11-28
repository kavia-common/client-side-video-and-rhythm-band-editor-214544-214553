/** useDragSelect - generic drag creation of chunks on a horizontal lane. */
import { useCallback, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export function useDragSelect({ onCreate, pxToMs }) {
  /** Returns handlers and state for drawing a selection rectangle to create a chunk. */
  const [drag, setDrag] = useState(null);
  const elRef = useRef(null);

  const onMouseDown = useCallback((e) => {
    if (!elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setDrag({ startX: x, endX: x });
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!drag || !elRef.current) return;
    const rect = elRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setDrag(prev => ({ ...prev, endX: x }));
  }, [drag]);

  const onMouseUp = useCallback(() => {
    if (!drag) return;
    const [a, b] = [drag.startX, drag.endX].sort((x, y) => x - y);
    const start = pxToMs(a);
    const end = pxToMs(b);
    if (end - start > 30) onCreate({ start, end });
    setDrag(null);
  }, [drag, onCreate, pxToMs]);

  return { elRef, drag, onMouseDown, onMouseMove, onMouseUp };
}
