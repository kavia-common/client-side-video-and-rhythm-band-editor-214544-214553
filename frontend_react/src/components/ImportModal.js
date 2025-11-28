import React, { useRef, useState } from 'react';
import { useStore } from '../state/store';
import { parseSrt, parseVtt } from '../utils/subtitles';

// PUBLIC_INTERFACE
export default function ImportModal() {
  /** Modal for importing SRT / VTT subtitles to bandes. */
  const { state, dispatch, types } = useStore();
  const fileRef = useRef(null);
  const [format, setFormat] = useState('auto');

  if (!state.ui.modals.import) return null;

  const onClose = () => dispatch({ type: types.UI_TOGGLE_MODAL, payload: { key: 'import', value: false } });

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let items = [];
    if (format === 'srt' || (format === 'auto' && /\.srt$/i.test(file.name))) {
      items = parseSrt(text);
    } else if (format === 'vtt' || (format === 'auto' && /\.vtt$/i.test(file.name))) {
      items = parseVtt(text);
    } else {
      // try auto heuristic
      items = text.includes('WEBVTT') ? parseVtt(text) : parseSrt(text);
    }
    dispatch({ type: types.BANDES_SET, payload: items });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Import Subtitles">
      <div className="modal">
        <div className="modal-header">
          <strong>Import subtitles</strong>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom: 10 }}>
            <label className="badge">Format</label>
            <select className="btn" value={format} onChange={e=>setFormat(e.target.value)}>
              <option value="auto">Auto</option>
              <option value="srt">SRT</option>
              <option value="vtt">WebVTT</option>
            </select>
          </div>
          <input ref={fileRef} type="file" accept=".srt,.vtt,text/plain" onChange={onFile} />
          <p style={{ color:'#6B7280', fontSize:13, marginTop:8 }}>Imported lines become bandes items for editing and syncing.</p>
        </div>
      </div>
    </div>
  );
}
