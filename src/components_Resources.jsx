import React from 'react';
const items = [
  {title:'10-minute Check-In Template', desc:'Simple structure for daily talks.'},
  {title:'Repair After Conflict', desc:'Steps to de-escalate and reconnect.'},
  {title:'Date Night Ideas (Low Cost)', desc:'Quick ideas to reconnect.'},
  {title:'I-Statements Guide', desc:'How to express needs without blame.'},
];
export default function Resources(){
  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Resources (Quick Reads)</h3>
        <div className="space-y-2 text-sm">
          {items.map((it,i)=>(
            <div key={i} className="p-3 rounded-2xl glass">
              <div className="font-medium">{it.title}</div>
              <div className="text-brandInk/80">{it.desc}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-brandInk/70 mt-2">Demo copy; replace with your own content or links.</div>
      </div>
    </div>
  );
}
