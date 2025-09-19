import React from 'react';
import { useApp } from './store.jsx';

export default function Achievements(){
  const { achievements } = useApp();
  const all = [
    {code:'first', name:'First Check-In', icon:'🌟'},
    {code:'streak3', name:'3-Day Streak', icon:'🔥'},
    {code:'streak7', name:'7-Day Streak', icon:'🏅'},
    {code:'habit30', name:'30 Check-Ins', icon:'💪'},
    {code:'communicator', name:'Discussion Starter', icon:'💬'},
    {code:'journaler', name:'Journalist', icon:'📓'},
    {code:'reflector', name:'Reflector', icon:'✨'},
    {code:'resilience', name:'Resilience', icon:'🌈'},
  ];
  const unlocked = new Set(achievements.map(a=>a.code));
  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Achievements</h3>
        <div className="grid grid-cols-2 gap-3">
          {all.map(a=>(
            <div key={a.code} className={"p-3 rounded-2xl glass text-sm flex items-center gap-2 " + (unlocked.has(a.code)? "":"opacity-60")}>
              <span className="text-xl">{a.icon}</span>
              <span>{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
