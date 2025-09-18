import React from 'react';
import { useApp } from './store.jsx';

export default function Discussions(){
  const { discussions, addDiscussion, toggleDiscussion } = useApp();
  const [text, setText] = React.useState("");

  const add = ()=>{
    if(!text.trim()) return;
    addDiscussion(text.trim());
    setText("");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Flag Topics to Discuss</h3>
        <div className="flex gap-2">
          <input className="flex-1 rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="e.g., Budget check-in this weekend" value={text} onChange={e=>setText(e.target.value)} />
          <button className="px-4 rounded-xl bg-slate-900 text-white" onClick={add}>Add</button>
        </div>
      </div>
      <div className="card">
        <h4 className="font-medium mb-2">Your List</h4>
        <div className="space-y-2">
          {discussions.length===0 && <div className="text-sm text-slate-500">No topics yet.</div>}
          {discussions.map(d => (
            <label key={d.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200">
              <input type="checkbox" checked={d.resolved} onChange={()=>toggleDiscussion(d.id)} className="mt-1 accent-indigo-600" />
              <div>
                <div className={d.resolved ? "line-through text-slate-400" : ""}>{d.text}</div>
                <div className="text-xs text-slate-400 mt-1">{new Date(d.createdAt).toLocaleString()}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
