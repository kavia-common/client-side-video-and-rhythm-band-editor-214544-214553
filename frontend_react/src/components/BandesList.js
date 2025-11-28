import React, { useMemo, useState } from 'react';
import { useStore } from '../state/store';
import { msToTime } from '../utils/time';
import { cryptoRandomId } from '../utils/subtitles';

// PUBLIC_INTERFACE
export default function BandesList() {
  /** Manage list of bandes, add/remove, quick edit text and times. */
  const { state, dispatch, types } = useStore();
  const [filter, setFilter] = useState('');

  const items = useMemo(() => {
    const f = filter.toLowerCase().trim();
    if (!f) return state.bandes.items;
    return state.bandes.items.filter(b => (b.text||'').toLowerCase().includes(f));
  }, [state.bandes.items, filter]);

  const onAdd = () => {
    const id = cryptoRandomId();
    const start = Math.max(0, state.video.currentTime - 500);
    const end = start + 1500;
    dispatch({ type: types.BANDES_ADD, payload: { id, characterId: 'default', text: 'New line', start, end } });
  };

  return (
    <div className="list">
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" placeholder="Filter text..." value={filter} onChange={(e) => setFilter(e.target.value)} />
        <button className="btn primary" onClick={onAdd}>Add</button>
      </div>
      {items.map(item => (
        <div key={item.id} className="list-item">
          <div style={{ display: 'grid', gap: 6 }}>
            <strong style={{ color: '#2563EB' }}>{(state.characters.items.find(c=>c.id===item.characterId)?.name) || 'Default'}</strong>
            <input
              className="input"
              value={item.text}
              onChange={(e)=>dispatch({ type: types.BANDES_UPDATE, payload: { id: item.id, text: e.target.value } })}
            />
            <div style={{ display:'flex', gap:8, alignItems:'center', color:'#6B7280', fontSize:12 }}>
              <span>{msToTime(item.start)}</span>
              <span>→</span>
              <span>{msToTime(item.end)}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button className="btn" onClick={()=>dispatch({ type: types.BANDES_REMOVE, payload: item.id })}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
