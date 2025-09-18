import React from 'react';
import { useApp } from './store.jsx';

function insightLines(entries){
  const last = entries.slice(-7);
  if(last.length < 3) return ["Log a few more days to see insights."];
  const avg = (arr, sel)=> Math.round(arr.reduce((s,e)=>s+sel(e),0)/arr.length);
  const r = avg(last, e=>e.you.relationship);
  const c = avg(last, e=>e.you.communication);
  const s = avg(last, e=>e.you.stress);
  const out = [];
  if(s>=7) out.push("Stress has been elevated — consider a short walk or a screen-free 30 minutes together.");
  if(r<=4) out.push("Relationship satisfaction dipped — try a low-stakes date night or write each other a quick note.");
  if(c<=5) out.push("Communication feels tough — try the 'I feel… when… because…' framework for one topic.");
  if(out.length===0) out.push("Nice trend! Keep the momentum with a 10-minute daily check-in.");
  return out;
}

export default function Insights(){
  const { entries } = useApp();
  const lines = insightLines(entries);
  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Insights</h3>
        <ul className="list-disc ml-5 text-sm text-slate-700 space-y-2">
          {lines.map((l,i)=>(<li key={i}>{l}</li>))}
        </ul>
      </div>
      <div className="card text-sm text-slate-600">
        These suggestions are demo-only and not medical advice.
      </div>
    </div>
  );
}
