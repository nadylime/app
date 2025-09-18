import React from 'react';
import CheckIn from './components_CheckIn.jsx';
import Dashboard from './components_Dashboard.jsx';
import Discussions from './components_Discussions.jsx';
import Journal from './components_Journal.jsx';
import Reflections from './components_Reflections.jsx';
import Insights from './components_Insights.jsx';
import Therapy from './components_Therapy.jsx';
import Settings from './components_Settings.jsx';

import Achievements from './components_Achievements.jsx';
import Goals from './components_Goals.jsx';
import LoveLanguages from './components_LoveLanguages.jsx';
import Conflicts from './components_Conflicts.jsx';
import Appreciation from './components_Appreciation.jsx';
import Summary from './components_Summary.jsx';
import AI from './components_AI.jsx';
import Integrations from './components_Integrations.jsx';
import Partner from './components_Partner.jsx';
import Security from './components_Security.jsx';
import Resources from './components_Resources.jsx';
import More from './components_More.jsx';

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
  // Additional screens
  { key:'achievements', label:'Achievements', icon:'🏆', Comp: Achievements },
  { key:'goals', label:'Goals', icon:'🎯', Comp: Goals },
  { key:'love', label:'Love', icon:'💞', Comp: LoveLanguages },
  { key:'conflicts', label:'Conflicts', icon:'🧩', Comp: Conflicts },
  { key:'appreciation', label:'Appreciation', icon:'🌼', Comp: Appreciation },
  { key:'summary', label:'Summary', icon:'🗓️', Comp: Summary },
  { key:'ai', label:'Prompts', icon:'🤖', Comp: AI },
  { key:'integrations', label:'Integrations', icon:'📈', Comp: Integrations },
  { key:'partner', label:'Partner', icon:'🔗', Comp: Partner },
  { key:'security', label:'Security', icon:'🔒', Comp: Security },
  { key:'resources', label:'Resources', icon:'📚', Comp: Resources },
];

export default function App(){
  const [tab, setTab] = React.useState('checkin');
  const Active = tab==='more' ? null : (screens.find(s=>s.key===tab)?.Comp ?? CheckIn);
  return (
    <AppProvider>
      <div className="max-w-md mx-auto min-h-screen flex flex-col bg-slate-50">
        <header className="p-4 sticky top-0 bg-slate-50/80 backdrop-blur z-10">
          <h1 className="text-xl font-bold">Couple Check-In</h1>
          <div className="text-xs text-slate-500">A private, shared space for two people</div>
        </header>
        <main className="flex-1">
          {tab==='more' ? <More onOpen={setTab}/> : <Active />}
        </main>
        <nav className="sticky bottom-0 bg-white border-t border-slate-200">
          <div className="grid grid-cols-4">
            {['checkin','dashboard','discuss','journal'].map(k=>{
              const s = screens.find(x=>x.key===k);
              return (
                <button key={k} onClick={()=>setTab(k)} className={"py-3 nav-item " + (tab===k ? "text-indigo-600" : "text-slate-500")}>
                  <div className="text-lg">{s.icon}</div><div>{s.label}</div>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-4 border-t border-slate-200">
            {['reflect','insights','therapy','more'].map(k=>{
              if (k==='more') return (
                <button key={k} onClick={()=>setTab('more')} className={"py-3 nav-item " + (tab==='more' ? "text-indigo-600" : "text-slate-500")}>
                  <div className="text-lg">➕</div><div>More</div>
                </button>
              );
              const s = screens.find(x=>x.key===k);
              return (
                <button key={k} onClick={()=>setTab(k)} className={"py-3 nav-item " + (tab===k ? "text-indigo-600" : "text-slate-500")}>
                  <div className="text-lg">{s.icon}</div><div>{s.label}</div>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </AppProvider>
  );
}
