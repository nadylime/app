import React from 'react';
import { useLocalStorage, calcStreak, healthScore, clamp01, seededRandom, todayKey, simpleSentiment } from './utils.js';

const AppContext = React.createContext(null);
export const useApp = () => React.useContext(AppContext);

function generateInitial(seed=Date.now()){
  const rand=seededRandom(seed); const out=[];
  for(let i=6;i>=1;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const date = d.toISOString().slice(0,10);
    const base = Math.round(6 + (rand()-0.5)*2);
    const you = { relationship: clamp01(base + Math.round((rand()-0.5)*2)), stress: clamp01(5 + Math.round((rand()-0.5)*3)), communication: clamp01(base + Math.round((rand()-0.5)*2)), note:'' };
    const partnerB = { relationship: clamp01(you.relationship + Math.round((rand()-0.5)*3)), stress: clamp01(you.stress + Math.round((rand()-0.5)*3)), communication: clamp01(you.communication + Math.round((rand()-0.5)*3)) };
    out.push({ date, you, partnerB });
  }
  return out;
}

function computeAchievements(entries, discussions, journal, reflections){
  const streak = calcStreak(entries);
  const total = entries.length;
  const a = [];
  if (total >= 1) a.push({code:'first', name:'First Check-In'});
  if (streak >= 3) a.push({code:'streak3', name:'3-Day Streak'});
  if (streak >= 7) a.push({code:'streak7', name:'7-Day Streak'});
  if (total >= 30) a.push({code:'habit30', name:'30 Check-Ins'});
  if (discussions.length >= 5) a.push({code:'communicator', name:'Discussion Starter'});
  if (journal.length >= 5) a.push({code:'journaler', name:'Journalist'});
  if (reflections.length >= 3) a.push({code:'reflector', name:'Reflector'});
  const negCount = journal.filter(j=>simpleSentiment(j.text)<0).length;
  if (negCount && entries.length>=5) a.push({code:'resilience', name:'Resilience (you kept logging)'});
  return a;
}

export function AppProvider({children}){
  // Core
  const [entries, setEntries] = useLocalStorage('entries', generateInitial());
  const [discussions, setDiscussions] = useLocalStorage('discussions', []);
  const [journal, setJournal] = useLocalStorage('journal', []);
  const [reflections, setReflections] = useLocalStorage('reflections', []);
  const [settings, setSettings] = useLocalStorage('settings', { reminders:false, frequency:'daily', hour:20, minute:0 });

  // Advanced
  const [goals, setGoals] = useLocalStorage('goals', [
    {id: 'g1', title:'Date night', cadence:'weekly', target:1, history:[]},
    {id: 'g2', title:'10-min daily check-in', cadence:'daily', target:1, history:[]}
  ]);
  const [appreciations, setAppreciations] = useLocalStorage('appreciations', []);
  const [conflicts, setConflicts] = useLocalStorage('conflicts', []);
  const [love, setLove] = useLocalStorage('love', { youPrimary:'Words of Affirmation', partnerPrimary:'Quality Time', logs:[] });
  const [pinHash, setPinHash] = useLocalStorage('pinHash', '');
  const [pairedData, setPairedData] = useLocalStorage('pairedData', null); // stores last imported from partner

  const addEntry = (youInput)=>{
    const date = todayKey();
    const jitter = (n)=>clamp01(n + (Math.random()*4 - 2));
    const partnerB = { relationship: Math.round(jitter(youInput.relationship)), stress: Math.round(jitter(youInput.stress)), communication: Math.round(jitter(youInput.communication)) };
    const newEntry = { date, you:youInput, partnerB };
    setEntries(prev => {
      const filtered = prev.filter(e=>e.date!==date);
      return [...filtered, newEntry].sort((a,b)=>a.date.localeCompare(b.date));
    });
  };

  // Discussions
  const addDiscussion = (text)=> setDiscussions(prev=>[{id:crypto.randomUUID(), text, resolved:false, createdAt:Date.now()}, ...prev]);
  const toggleDiscussion = (id)=> setDiscussions(prev=>prev.map(d=>d.id===id?{...d, resolved:!d.resolved}:d));

  // Journal
  const addJournal = (item)=> setJournal(prev=>[{id:crypto.randomUUID(), ...item, createdAt:Date.now()}, ...prev]);

  // Reflections
  const addReflection = (item)=> setReflections(prev=>[{id:crypto.randomUUID(), ...item, createdAt:Date.now()}, ...prev]);

  // Goals
  const addGoal = (g)=> setGoals(prev=>[{id:crypto.randomUUID(), ...g, history:[]}, ...prev]);
  const logGoal = (id)=> setGoals(prev=>prev.map(g=>g.id===id ? {...g, history:[...g.history, todayKey()]} : g));

  // Appreciation bank
  const addAppreciation = (text)=> setAppreciations(prev=>[{id:crypto.randomUUID(), text, createdAt:Date.now()}, ...prev]);

  // Conflicts
  const addConflict = (c)=> setConflicts(prev=>[{id:crypto.randomUUID(), ...c, createdAt:Date.now()}, ...prev]);

  // Love language log
  const logLove = (language, note)=> setLove(prev=>({...prev, logs:[{id:crypto.randomUUID(), language, note, date:todayKey()}, ...prev.logs]}));

  // Partner pairing (store external data for compare screens if desired)
  const importPaired = (data)=> setPairedData(data);

  const value = {
    entries, addEntry,
    discussions, addDiscussion, toggleDiscussion,
    journal, addJournal,
    reflections, addReflection,
    settings, setSettings,
    goals, addGoal, logGoal,
    appreciations, addAppreciation,
    conflicts, addConflict,
    love, setLove, logLove,
    pinHash, setPinHash,
    pairedData, importPaired,
    streak: calcStreak(entries),
    health: healthScore(entries),
    achievements: computeAchievements(entries, discussions, journal, reflections)
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
