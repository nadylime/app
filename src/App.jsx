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

export default function App(){
  const [tab, setTab] = React.useState('checkin');
  const Active = tab==='more' ? null : (
    tab==='checkin' ? <CheckIn/> :
    tab==='dashboard' ? <Dashboard/> :
    tab==='discuss' ? <Discussions/> :
    tab==='journal' ? <Journal/> :
    tab==='reflect' ? <Reflections/> :
    tab==='insights' ? <Insights/> :
    tab==='therapy' ? <Therapy/> :
    tab==='settings' ? <Settings/> :
    tab==='achievements' ? <Achievements/> :
    tab==='goals' ? <Goals/> :
    tab==='love' ? <LoveLanguages/> :
    tab==='conflicts' ? <Conflicts/> :
    tab==='appreciation' ? <Appreciation/> :
    tab==='summary' ? <Summary/> :
    tab==='ai' ? <AI/> :
    tab==='integrations' ? <Integrations/> :
    tab==='partner' ? <Partner/> :
    tab==='security' ? <Security/> :
    tab==='resources' ? <Resources/> :
    <CheckIn/>
  );
  return (
    <AppProvider>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <header className="p-4 sticky top-0 z-10 glass">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Togetherly" className="w-8 h-8 rounded-full"/>
            <div>
              <h1 className="text-xl font-bold">Togetherly</h1>
              <div className="text-xs text-brandInk/70">A warm space for two people to check in</div>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {tab==='more' ? <More onOpen={setTab}/> : Active}
        </main>
        <nav className="sticky bottom-0 glass">
          <div className="grid grid-cols-4">
            {[['checkin','❤️','Check-In'],['dashboard','📈','Dashboard'],['discuss','💬','Discuss'],['journal','📓','Journal']].map(([k,ico,label])=> (
              <button key={k} onClick={()=>setTab(k)} className={'py-3 nav-item ' + (tab===k ? 'text-brandInk' : 'text-brandInk/60')}>
                <div className="text-lg">{ico}</div><div>{label}</div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 border-t border-white/30">
            {[['reflect','✨','Reflect'],['insights','🧠','Insights'],['therapy','🗂️','Therapy'],['more','➕','More']].map(([k,ico,label])=> (
              <button key={k} onClick={()=>setTab(k)} className={'py-3 nav-item ' + (tab===k ? 'text-brandInk' : 'text-brandInk/60')}>
                <div className="text-lg">{ico}</div><div>{label}</div>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </AppProvider>
  );
}
