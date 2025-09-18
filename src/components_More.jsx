import React from 'react';

export default function More({ onOpen }){
  const items = [
    ['achievements','Achievements','🏆'],
    ['goals','Goals','🎯'],
    ['love','Love Languages','💞'],
    ['conflicts','Conflicts','🧩'],
    ['appreciation','Appreciation','🌼'],
    ['summary','Weekly Summary','🗓️'],
    ['ai','AI Prompts','🤖'],
    ['integrations','Integrations','📈'],
    ['partner','Partner Sync','🔗'],
    ['security','Security','🔒'],
    ['resources','Resources','📚'],
  ];
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {items.map(([key,label,icon])=>(
          <button key={key} onClick={()=>onOpen(key)} className="card text-left">
            <div className="text-2xl">{icon}</div>
            <div className="font-medium mt-1">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
