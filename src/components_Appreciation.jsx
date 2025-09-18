import React from 'react';
import { useApp } from './store.jsx';

export default function Appreciation(){
  const { appreciations, addAppreciation } = useApp();
  const [text,setText]=React.useState('');
  const add=()=>{ if(!text.trim()) return; addAppreciation(text.trim()); setText(''); };
  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Appreciation Bank</h3>
        <div className="flex gap-2">
          <input className="flex-1 rounded-xl border p-2" placeholder="e.g., Thanks for handling dinner tonight" value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn btn-primary" onClick={add}>Save</button>
        </div>
      </div>
      <div className="card">
        <h4 className="font-medium mb-2">Saved</h4>
        <div className="space-y-2 text-sm">
          {appreciations.length===0 && <div className="text-slate-500">No notes yet.</div>}
          {appreciations.map(a=>(
            <div key={a.id} className="p-3 rounded-xl border border-slate-200">{a.text}<div className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
