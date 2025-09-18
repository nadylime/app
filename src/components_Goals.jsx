import React from 'react';
import { useApp } from './store.jsx';

function percentWeekly(g){
  const now = new Date(); const week = [];
  for (let i=6;i>=0;i--){ const d=new Date(); d.setDate(now.getDate()-i); week.push(d.toISOString().slice(0,10)); }
  const hits = g.history.filter(h=>week.includes(h)).length;
  const denom = g.cadence==='daily' ? 7 : g.cadence==='weekly' ? 1 : 1;
  const target = g.target * denom;
  return Math.min(100, Math.round(hits/Math.max(1,target)*100));
}

export default function Goals(){
  const { goals, addGoal, logGoal } = useApp();
  const [title, setTitle] = React.useState('');
  const [cadence, setCadence] = React.useState('daily');
  const [target, setTarget] = React.useState(1);
  const add = ()=>{ if(!title.trim()) return; addGoal({ title: title.trim(), cadence, target: Number(target) }); setTitle(''); };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Goals</h3>
        <div className="grid grid-cols-3 gap-2">
          <input className="rounded-xl border p-2 col-span-2" placeholder="e.g., Walk together 2x/week" value={title} onChange={e=>setTitle(e.target.value)} />
          <select className="rounded-xl border p-2" value={cadence} onChange={e=>setCadence(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input type="number" min="1" className="rounded-xl border p-2" value={target} onChange={e=>setTarget(e.target.value)} />
          <button className="btn btn-primary col-span-2" onClick={add}>Add Goal</button>
        </div>
      </div>
      <div className="card">
        <h4 className="font-medium mb-2">Your Goals</h4>
        <div className="space-y-2">
          {goals.length===0 && <div className="text-sm text-slate-500">No goals yet.</div>}
          {goals.map(g=>(
            <div key={g.id} className="p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{g.title}</div>
                  <div className="text-xs text-slate-500">{g.cadence}, target {g.target}/{g.cadence}</div>
                </div>
                <button className="btn-ghost" onClick={()=>logGoal(g.id)}>Log done today</button>
              </div>
              <div className="text-xs text-slate-600 mt-2">Weekly progress: {percentWeekly(g)}%</div>
              <div className="text-xs text-slate-400">Completions: {g.history.length}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
