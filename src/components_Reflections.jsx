import React from 'react';
import { useApp } from './store.jsx';

export default function Reflections(){
  const { reflections, addReflection } = useApp();
  const [appreciation, setAppreciation] = React.useState("");
  const [challenge, setChallenge] = React.useState("");

  const add = ()=>{
    if(!appreciation.trim() && !challenge.trim()) return;
    addReflection({ appreciation: appreciation.trim(), challenge: challenge.trim() });
    setAppreciation(""); setChallenge("");
  };

  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Shared Reflections</h3>
        <label className="text-sm">One thing I appreciated about you today</label>
        <textarea rows={2} className="w-full rounded-2xl glass p-2 mb-3 outline-none"
          value={appreciation} onChange={(e)=>setAppreciation(e.target.value)} />
        <label className="text-sm">One challenge I had this week</label>
        <textarea rows={2} className="w-full rounded-2xl glass p-2 outline-none"
          value={challenge} onChange={(e)=>setChallenge(e.target.value)} />
        <button className="btn btn-primary mt-3" onClick={add}>Save Reflection</button>
      </div>
      <div className="card">
        <h4 className="font-medium mb-2">History</h4>
        <div className="space-y-2">
          {reflections.length===0 && <div className="text-sm text-brandInk/70">No reflections yet.</div>}
          {reflections.map(r => (
            <div key={r.id} className="p-3 rounded-2xl glass text-sm">
              {r.appreciation && <div><span className="pill mr-2">Appreciation</span>{r.appreciation}</div>}
              {r.challenge && <div className="mt-2"><span className="pill mr-2">Challenge</span>{r.challenge}</div>}
              <div className="text-xs text-brandInk/50 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
