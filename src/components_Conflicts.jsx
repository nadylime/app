import React from 'react';
import { useApp } from './store.jsx';

export default function Conflicts(){
  const { conflicts, addConflict } = useApp();
  const [title,setTitle]=React.useState('');
  const [feelings,setFeelings]=React.useState('');
  const [resolution,setResolution]=React.useState('');
  const [technique,setTechnique]=React.useState('');

  const add=()=>{
    if(!title.trim()) return;
    addConflict({ title:title.trim(), feelings:feelings.trim(), resolution:resolution.trim(), technique:technique.trim() });
    setTitle(''); setFeelings(''); setResolution(''); setTechnique('');
  };

  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Conflict Resolution Log</h3>
        <input className="w-full rounded-2xl glass p-2 mb-2" placeholder="Topic or situation" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="w-full rounded-2xl glass p-2 mb-2" placeholder="Feelings (I feel... when... because...)" value={feelings} onChange={e=>setFeelings(e.target.value)} />
        <input className="w-full rounded-2xl glass p-2 mb-2" placeholder="Resolution outcome" value={resolution} onChange={e=>setResolution(e.target.value)} />
        <input className="w-full rounded-2xl glass p-2 mb-2" placeholder="Technique used (e.g., time-out, reflective listening)" value={technique} onChange={e=>setTechnique(e.target.value)} />
        <button className="btn btn-primary" onClick={add}>Add</button>
      </div>
      <div className="card">
        <h4 className="font-medium mb-2">History</h4>
        <div className="space-y-2 text-sm">
          {conflicts.length===0 && <div className="text-brandInk/70">No conflicts logged yet.</div>}
          {conflicts.map(c=>(
            <div key={c.id} className="p-3 rounded-2xl glass">
              <div className="font-medium">{c.title}</div>
              <div className="text-brandInk/80 mt-1">{c.feelings}</div>
              <div className="text-brandInk/80 mt-1">Resolution: {c.resolution || '—'}</div>
              <div className="text-brandInk/60 text-xs mt-1">Technique: {c.technique || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
