import React from 'react';
import { useApp } from './store.jsx';
import { simpleSentiment } from './utils.js';

export default function Journal(){
  const { journal, addJournal } = useApp();
  const [text, setText] = React.useState("");
  const [mood, setMood] = React.useState("🙂");
  const add = ()=>{ if(!text.trim()) return; addJournal({ text: text.trim(), mood, sentiment: simpleSentiment(text) }); setText(""); };

  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Mood Journal</h3>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm text-brandInk/70">Mood:</label>
          <select className="rounded-full glass p-2" value={mood} onChange={(e)=>setMood(e.target.value)}>
            <option>😄</option><option>🙂</option><option>😐</option><option>😕</option><option>😢</option>
          </select>
        </div>
        <textarea rows={3} className="w-full rounded-2xl glass p-3 outline-none"
          placeholder="Quick note about how you're feeling…" value={text} onChange={(e)=>setText(e.target.value)} />
        <button className="btn btn-primary mt-3" onClick={add}>Add Entry</button>
      </div>
      <div className="card">
        <h4 className="font-medium mb-2">Recent</h4>
        <div className="space-y-2">
          {journal.length===0 && <div className="text-sm text-brandInk/70">No journal entries yet.</div>}
          {journal.map(j => (
            <div key={j.id} className="p-3 rounded-2xl glass">
              <div className="text-lg">{j.mood}</div>
              <div className="mt-1">{j.text}</div>
              <div className={"text-xs mt-1 " + (j.sentiment<0?"text-red-600":j.sentiment>0?"text-green-700":"text-brandInk/50")}>
                Sentiment: {j.sentiment>0 ? "positive" : j.sentiment<0 ? "negative" : "neutral"}
              </div>
              <div className="text-xs text-brandInk/50 mt-1">{new Date(j.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
