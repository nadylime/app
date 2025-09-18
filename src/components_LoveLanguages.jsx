import React from 'react';
import { useApp } from './store.jsx';

const list = ['Words of Affirmation','Quality Time','Acts of Service','Gifts','Physical Touch'];

export default function LoveLanguages(){
  const { love, setLove, logLove } = useApp();
  const setYou = (e)=> setLove({...love, youPrimary:e.target.value});
  const setPartner = (e)=> setLove({...love, partnerPrimary:e.target.value});
  const [note, setNote] = React.useState('');

  const add = (lang)=>{ logLove(lang, note); setNote(''); };

  return (
    <div className="p-4 space-y-4">
      <div className="card grid-2">
        <div>
          <div className="text-sm text-slate-600 mb-1">Your Primary</div>
          <select className="w-full rounded-xl border p-2" value={love.youPrimary} onChange={setYou}>
            {list.map(l=><option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <div className="text-sm text-slate-600 mb-1">Partner Primary</div>
          <select className="w-full rounded-xl border p-2" value={love.partnerPrimary} onChange={setPartner}>
            {list.map(l=><option key={l}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-2">Log Moments</h3>
        <div className="grid grid-cols-5 gap-2">
          {list.map(l=>(<button key={l} className="btn-ghost" onClick={()=>add(l)}>{l.split(' ')[0]}</button>))}
        </div>
        <textarea rows={2} className="w-full rounded-xl border p-2 mt-2" placeholder="Optional note…" value={note} onChange={e=>setNote(e.target.value)} />
      </div>
      <div className="card">
        <h4 className="font-medium mb-2">History</h4>
        <div className="space-y-2 text-sm">
          {love.logs.length===0 && <div className="text-slate-500">No logs yet.</div>}
          {love.logs.map(l=>(
            <div key={l.id} className="p-2 rounded-xl border border-slate-200">
              <span className="pill mr-2">{l.language}</span>{l.note || '—'} <span className="text-xs text-slate-400 ml-2">{l.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
