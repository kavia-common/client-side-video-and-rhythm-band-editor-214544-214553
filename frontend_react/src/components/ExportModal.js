import React from 'react';
import { useStore } from '../state/store';
import { msToTime } from '../utils/time';

// PUBLIC_INTERFACE
export default function ExportModal() {
  /** Modal for exporting bandes as SRT text file. */
  const { state, dispatch, types } = useStore();
  if (!state.ui.modals.export) return null;

  const onClose = () => dispatch({ type: types.UI_TOGGLE_MODAL, payload: { key: 'export', value: false } });

  const toSrt = () => {
    const items = [...state.bandes.items].sort((a,b)=>a.start-b.start);
    const lines = items.map((b, idx) => {
      const start = msToTime(b.start).replace('.', ',');
      const end = msToTime(b.end).replace('.', ',');
      const text = b.text || '';
      return `${idx+1}\n${start} --> ${end}\n${text}\n`;
    });
    return lines.join('\n');
  };

  const download = () => {
    const blob = new Blob([toSrt()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bandes_export.srt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Export">
      <div className="modal">
        <div className="modal-header">
          <strong>Export</strong>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          <p style={{ color:'#6B7280' }}>Export current bandes as SRT (SubRip). All client-side.</p>
          <button className="btn primary" onClick={download}>Download .srt</button>
        </div>
      </div>
    </div>
  );
}
