import React from 'react';
import CheckIn from './components_CheckIn.jsx';
import Dashboard from './components_Dashboard.jsx';
import Discussions from './components_Discussions.jsx';
import Journal from './components_Journal.jsx';
import Reflections from './components_Reflections.jsx';
import Insights from './components_Insights.jsx';
import Therapy from './components_Therapy.jsx';
import Settings from './components_Settings.jsx';
import { AppProvider } from './store.jsx';

const screens = [
  { key:'checkin', label:'Check-In', icon:'❤️', Comp: CheckIn },
  { key:'dashboard', label:'Dashboard', icon:'📈', Comp: Dashboard },
  { key:'discuss', label:'Discuss', icon:'💬', Comp: Discussions },
  { key:'journal', label:'Journal', icon:'📓', Comp: Journal },
  { key:'reflect', label:'Reflect', icon:'✨', Comp: Reflections },
  { key:'insights', label:'Insights', icon:'🧠', Comp: Insights },
  { key:'therapy', label:'Therapy', icon:'🗂️', Comp: Therapy },
  { key:'settings', label:'Settings', icon:'⚙️', Comp: Settings },
];

export default function App(){
  const [tab, setTab] = React.useState('checkin');
  const Active = screens.find(s=>s.key===tab)?.Comp ?? CheckIn;
  return (
    <AppProvider>
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50">
        <header className="p-4 sticky top-0 bg-slate-50/80 backdrop-blur z-10">
          <h1 className="text-xl font-bold">Couple Check-In</h1>
          <div className="text-xs text-slate-500">A private, shared space for two people</div>
        </header>
        <main className="flex-1">
          <Active />
        </main>
        <nav className="sticky bottom-0 bg-white border-t border-slate-200">
          <div className="grid grid-cols-4">
            {screens.slice(0,4).map(s => (
              <button key={s.key} onClick={()=>setTab(s.key)}
                className={"py-3 nav-item " + (tab===s.key ? "text-indigo-600" : "text-slate-500")}>
                <div className="text-lg">{s.icon}</div>
                <div>{s.label}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 border-t border-slate-200">
            {screens.slice(4).map(s => (
              <button key={s.key} onClick={()=>setTab(s.key)}
                className={"py-3 nav-item " + (tab===s.key ? "text-indigo-600" : "text-slate-500")}>
                <div className="text-lg">{s.icon}</div>
                <div>{s.label}</div>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </AppProvider>
  );
}
