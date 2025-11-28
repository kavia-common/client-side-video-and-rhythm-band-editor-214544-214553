import React, { useState } from 'react';
import { useStore } from '../state/store';
import { cryptoRandomId } from '../utils/subtitles';

// PUBLIC_INTERFACE
export default function CharacterManager() {
  /** Manage characters with names and colors. */
  const { state, dispatch, types } = useStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2563EB');

  const add = () => {
    if (!name.trim()) return;
    dispatch({ type: types.CHARACTERS_ADD, payload: { id: cryptoRandomId(), name: name.trim(), color } });
    setName('');
  };

  return (
    <div style={{ marginTop: 12 }}>
      <div className="panel-header" style={{ border: '1px solid var(--border)', borderRadius: 8, marginBottom: 8 }}>
        <div className="panel-title">Characters</div>
      </div>
      <div className="list">
        {state.characters.items.map(c => (
          <div key={c.id} className="list-item">
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:16, height:16, borderRadius:4, background:c.color, border:'1px solid #ddd' }} />
              <strong>{c.name}</strong>
            </div>
            <button className="btn" onClick={()=>dispatch({ type: types.CHARACTERS_REMOVE, payload: c.id })}>Remove</button>
          </div>
        ))}
        <div style={{ display:'flex', gap:8 }}>
          <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="input" type="color" value={color} onChange={e=>setColor(e.target.value)} style={{ width:56, padding:4 }} />
          <button className="btn primary" onClick={add}>Add</button>
        </div>
      </div>
    </div>
  );
}
