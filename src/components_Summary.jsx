import React from 'react';
import { useApp } from './store.jsx';

function generateSummary(entries, discussions, journal){
  const last = entries.slice(-7);
  const avg = (arr,sel)=> Math.round(arr.reduce((s,e)=>s+sel(e),0)/Math.max(1,arr.length));
  const r = avg(last, e=>e.you.relationship);
  const s = avg(last, e=>e.you.stress);
  const c = avg(last, e=>e.you.communication);
  const topTopic = discussions[0]?.text || '—';
  const mood = journal.slice(-10).reduce((acc,j)=>acc+(j.mood==='😄'?2:j.mood==='🙂'?1:j.mood==='😕'?-1:j.mood==='😢'?-2:0),0);
  const moodLabel = mood>0?'positive':mood<0?'challenging':'mixed';
  return { r,s,c, topTopic, moodLabel, count:last.length };
}

export default function Summary(){
  const { entries, discussions, journal } = useApp();
  const sum = generateSummary(entries, discussions, journal);
  const copy = async ()=>{
    const text = `Weekly Summary:\nRelationship avg: ${sum.r}, Stress avg: ${sum.s}, Communication avg: ${sum.c}\nMood: ${sum.moodLabel}\nTop topic: ${sum.topTopic}`;
    await navigator.clipboard.writeText(text);
    alert('Summary copied to clipboard');
  };
  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Weekly Summary (demo)</h3>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>Relationship avg: <b>{sum.r}</b></li>
          <li>Stress avg: <b>{sum.s}</b></li>
          <li>Communication avg: <b>{sum.c}</b></li>
          <li>Mood: <b>{sum.moodLabel}</b></li>
          <li>Top flagged topic: <b>{sum.topTopic}</b></li>
        </ul>
        <button className="btn btn-primary mt-3" onClick={copy}>Copy Summary</button>
      </div>
    </div>
  );
}
