import React, { useRef } from 'react';
import { useStore } from '../state/store';

// PUBLIC_INTERFACE
export default function HeaderToolbar() {
  /** Toolbar with open video, export, import buttons and rate select. */
  const inputRef = useRef(null);
  const { dispatch, types, state } = useStore();

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const videoEl = document.querySelector('video#player');
    if (videoEl) {
      videoEl.src = url;
      videoEl.onloadedmetadata = () => {
        dispatch({ type: types.VIDEO_SET_META, payload: { duration: Math.floor(videoEl.duration * 1000), width: videoEl.videoWidth, height: videoEl.videoHeight } });
        dispatch({ type: types.TIMELINE_SET_DURATION, payload: Math.floor(videoEl.duration * 1000) });
      };
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="video/*" hidden onChange={onPick} />
      <button className="btn" onClick={() => inputRef.current?.click()}>Open Video</button>
      <button className="btn" onClick={() => dispatch({ type: types.UI_TOGGLE_MODAL, payload: { key: 'import', value: true } })}>Import Subs</button>
      <button className="btn secondary" onClick={() => dispatch({ type: types.UI_TOGGLE_MODAL, payload: { key: 'export', value: true } })}>Export</button>

      <div style={{ width: 8 }} />
      <label className="badge">Rate</label>
      <select
        className="btn"
        value={state.video.playbackRate}
        onChange={(e) => dispatch({ type: types.VIDEO_SET_RATE, payload: Number(e.target.value) })}
      >
        <option value={0.5}>0.5x</option>
        <option value={1}>1x</option>
        <option value={1.25}>1.25x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
      </select>
    </>
  );
}
