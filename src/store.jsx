import React from 'react';
import { useLocalStorage, calcStreak, healthScore, clamp01, seededRandom, todayKey } from './utils.js';
const AppContext = React.createContext(null);
export const useApp = () => React.useContext(AppContext);

function generateInitial(seed=Date.now()){
  const rand = seededRandom(seed);
  const out = [];
  for(let i=6;i>=1;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const date = d.toISOString().slice(0,10);
    const base = Math.round(6 + (rand()-0.5)*2);
    const you = {
      relationship: clamp01(base + Math.round((rand()-0.5)*2)),
      stress: clamp01(5 + Math.round((rand()-0.5)*3)),
      communication: clamp01(base + Math.round((rand()-0.5)*2)),
      note: ''
    };
    const partnerB = {
      relationship: clamp01(you.relationship + Math.round((rand()-0.5)*3)),
      stress: clamp01(you.stress + Math.round((rand()-0.5)*3)),
      communication: clamp01(you.communication + Math.round((rand()-0.5)*3)),
    };
    out.push({ date, you, partnerB });
  }
  return out;
}

export function AppProvider({children}){
  const [entries, setEntries] = useLocalStorage('entries', generateInitial());
  const [discussions, setDiscussions] = useLocalStorage('discussions', []);
  const [journal, setJournal] = useLocalStorage('journal', []);
  const [reflections, setReflections] = useLocalStorage('reflections', []);
  const [settings, setSettings] = useLocalStorage('settings', { reminders:false, frequency:'daily' });

  const addEntry = (youInput)=>{
    const date = todayKey();
    const jitter = (n)=>clamp01(n + (Math.random()*4 - 2));
    const partnerB = {
      relationship: Math.round(jitter(youInput.relationship)),
      stress: Math.round(jitter(youInput.stress)),
      communication: Math.round(jitter(youInput.communication)),
    };
    const newEntry = { date, you:youInput, partnerB };
    setEntries(prev => {
      const filtered = prev.filter(e=>e.date!==date);
      return [...filtered, newEntry].sort((a,b)=>a.date.localeCompare(b.date));
    });
  };

  const addDiscussion = (text)=> setDiscussions(prev=>[{id:crypto.randomUUID(), text, resolved:false, createdAt:Date.now()}, ...prev]);
  const toggleDiscussion = (id)=> setDiscussions(prev=>prev.map(d=>d.id===id?{...d, resolved:!d.resolved}:d));
  const addJournal = (item)=> setJournal(prev=>[{id:crypto.randomUUID(), ...item, createdAt:Date.now()}, ...prev]);
  const addReflection = (item)=> setReflections(prev=>[{id:crypto.randomUUID(), ...item, createdAt:Date.now()}, ...prev]);

  const value = {
    entries, addEntry,
    discussions, addDiscussion, toggleDiscussion,
    journal, addJournal,
    reflections, addReflection,
    settings, setSettings,
    streak: calcStreak(entries),
    health: healthScore(entries)
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
