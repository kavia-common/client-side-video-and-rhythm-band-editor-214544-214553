import React, { useMemo, useRef } from 'react';
import { useStore } from '../state/store';
import { msToTime } from '../utils/time';
import { useDragSelect } from '../hooks/useDragSelect';
import { cryptoRandomId } from '../utils/subtitles';

// PUBLIC_INTERFACE
export default function Timeline() {
  /** Interactive timeline with draggable cursor and chunk creation by dragging. */
  const { state, dispatch, types } = useStore();
  const containerRef = useRef(null);

  const pixelsPerMs = useMemo(() => 0.05 * state.timeline.zoom, [state.timeline.zoom]);

  const msToPx = (ms) => ms * pixelsPerMs;
  const pxToMs = (px) => Math.max(0, px / pixelsPerMs);

  const onCreate = ({ start, end }) => {
    const id = cryptoRandomId();
    dispatch({ type: types.BANDES_ADD, payload: { id, characterId: 'default', text: '...', start, end } });
  };

  const { elRef, drag, onMouseDown, onMouseMove, onMouseUp } = useDragSelect({ onCreate, pxToMs });

  const width = msToPx(state.timeline.duration || Math.max(state.video.duration, 120000)) + 40;
  const cursorLeft = msToPx(state.video.currentTime);

  return (
    <div
      className="timeline-rows"
      ref={(node) => { containerRef.current = node; elRef.current = node; }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      role="application"
      aria-label="Timeline editor"
    >
      <div className="timeline-cursor" style={{ left: cursorLeft }} />
      {/* One row for default band for now */}
      <div className="row" style={{ width }}>
        {state.bandes.items.map(b => {
          const left = msToPx(b.start);
          const widthPx = msToPx(b.end - b.start);
          return (
            <div key={b.id} className="chunk" style={{ left, width: widthPx }}>
              <span style={{ fontWeight: 600 }}>{(state.characters.items.find(c => c.id===b.characterId)?.name)||'Def'}</span>
              <span>{b.text}</span>
            </div>
          );
        })}
      </div>
      {drag && (
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: Math.min(drag.startX, drag.endX),
            width: Math.abs(drag.endX - drag.startX),
            height: 24,
            background: 'rgba(245,158,11,0.25)',
            border: '1px dashed rgba(245,158,11,0.8)',
            borderRadius: 6,
            pointerEvents: 'none'
          }}
        />
      )}
      <div style={{ position: 'absolute', bottom: 6, left: 10, fontSize: 12, color: '#6B7280' }}>
        {msToTime(state.video.currentTime)} / {msToTime(state.timeline.duration || state.video.duration)}
      </div>
    </div>
  );
}
