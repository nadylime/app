import React from 'react';
import { useApp } from './store.jsx';

function Slider({label, value, setValue, min=0, max=10, emoji}){
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-medium">{label} {emoji}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e=>setValue(Number(e.target.value))}
        className="w-full accent-indigo-600" />
      <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0</span><span>10</span></div>
    </div>
  );
}

export default function CheckIn(){
  const { addEntry } = useApp();
  const [relationship, setRelationship] = React.useState(6);
  const [stress, setStress] = React.useState(5);
  const [communication, setCommunication] = React.useState(6);
  const [note, setNote] = React.useState("");

  const submit = ()=>{
    addEntry({ relationship, stress, communication, note });
    setNote("");
    alert("Check-in saved! Partner B simulated 📈");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold mb-2">Daily Check-In</h2>
        <Slider label="Relationship Satisfaction" emoji="❤️" value={relationship} setValue={setRelationship} />
        <Slider label="Personal Stress" emoji="⚡" value={stress} setValue={setStress} />
        <Slider label="Communication Satisfaction" emoji="💬" value={communication} setValue={setCommunication} />
        <div className="mt-2">
          <label className="text-sm font-medium">Quick note (optional)</label>
          <textarea rows={3} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a short note or emoji…"
            className="mt-1 w-full rounded-xl border border-slate-200 p-2 outline-none focus:ring-2 focus:ring-indigo-200" />
        </div>
        <button className="btn btn-primary mt-4" onClick={submit}>Submit Check-In</button>
      </div>
      <div className="text-xs text-slate-500 text-center">Your partner's responses are simulated for demo purposes.</div>
    </div>
  );
}
