import React, { useEffect, useRef } from 'react';
import { useStore } from '../state/store';
import { useVideoControls } from '../hooks/useVideoControls';

// PUBLIC_INTERFACE
export default function VideoPlayer() {
  /** Multi-format HTML5 video player with controls bound to store. */
  const ref = useRef(null);
  const { dispatch, types, state } = useStore();
  const { play, pause, toggle } = useVideoControls();

  useEffect(() => {
    if (!ref.current) return;
    dispatch({ type: types.VIDEO_SET_ELEMENT, payload: ref.current });
  }, [dispatch, types]);

  useEffect(() => {
    if (ref.current) ref.current.playbackRate = state.video.playbackRate;
  }, [state.video.playbackRate]);

  return (
    <div className="video-surface">
      <div className="surface-header">
        <div className="panel-title">Video Player</div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn" onClick={toggle}>{state.video.playing ? 'Pause' : 'Play'}</button>
          <button className="btn" onClick={pause}>Stop</button>
        </div>
      </div>
      <div className="surface-body">
        <video id="player" ref={ref} controls style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
