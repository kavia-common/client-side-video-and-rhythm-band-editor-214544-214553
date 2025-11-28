import React, { useEffect, useRef } from 'react';
import { useStore } from '../state/store';
import { useRaf } from '../hooks/useRaf';
import { msToFrames } from '../utils/time';

// PUBLIC_INTERFACE
export default function CanvasPreview() {
  /** 60 FPS canvas overlay preview rendering current bandes text near the cursor. */
  const canvasRef = useRef(null);
  const { state } = useStore();

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = c.clientWidth * dpr;
    c.height = c.clientHeight * dpr;
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
  }, []);

  useRaf(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const { currentTime } = state.video;
    const { items } = state.bandes;

    // clear
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, c.width, c.height);

    // render time
    ctx.fillStyle = '#93C5FD';
    ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.fillText(`t=${(currentTime/1000).toFixed(2)}s | ${msToFrames(currentTime, state.timeline.fps)}f`, 8, 18);

    // show currently active lines
    const active = items.filter(b => currentTime >= b.start && currentTime <= b.end).slice(0, 3);
    active.forEach((b, i) => {
      const color = (state.characters.items.find(c => c.id === b.characterId)?.color) || '#F59E0B';
      ctx.fillStyle = color;
      ctx.font = '600 20px system-ui, -apple-system, Segoe UI, Roboto';
      ctx.fillText(b.text, 20, 60 + i * 28);
    });
  }, true);

  return (
    <div className="canvas-surface">
      <div className="surface-header">
        <div className="panel-title">Canvas Preview (60 FPS)</div>
      </div>
      <div className="surface-body">
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
