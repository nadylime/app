import React from 'react';
import { useApp } from './store.jsx';

function generatePrompts({entries,discussions,journal}){
  const out = [];
  const last = entries.slice(-5);
  const avg = (arr,sel)=> Math.round(arr.reduce((s,e)=>s+sel(e),0)/Math.max(1,arr.length));
  const r=avg(last,e=>e.you.relationship), s=avg(last,e=>e.you.stress), c=avg(last,e=>e.you.communication);
  if (s>=7) out.push('What would make the next 48 hours feel lighter for each of us?');
  if (c<=5) out.push('Could we each share one thing we need to feel heard this week?');
  if (r<=5) out.push('What small ritual could we try this week to reconnect?');
  if (discussions.length) out.push(`Can we revisit "${discussions[0].text}" for 10 minutes using reflective listening?`);
  if (journal.length) out.push('Pick one journal entry and share one sentence that felt important.');
  if (!out.length) out.push('Plan a 15-minute walk together and share one appreciation.');
  return out;
}

export default function AI(){
  const data = useApp();
  const prompts = generatePrompts(data);
  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Conversation Prompts</h3>
        <ul className="list-disc ml-5 text-sm space-y-2">
          {prompts.map((p,i)=>(<li key={i}>{p}</li>))}
        </ul>
      </div>
      <div className="text-xs text-white/90">Local heuristics only (no external AI).</div>
    </div>
  );
}
