import React from 'react';
export const clamp01=(n)=>Math.max(0,Math.min(10,n));
export const todayKey=(d=new Date())=>d.toISOString().slice(0,10);
export const formatShort=(iso)=>{const d=new Date(iso+'T00:00:00');return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});};

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function calcStreak(entries){
  if(!entries?.length) return 0;
  const days = new Set(entries.map(e=>e.date));
  let streak = 0;
  let cursor = new Date();
  for(;;){
    const key = cursor.toISOString().slice(0,10);
    if(days.has(key)){ streak++; cursor.setDate(cursor.getDate()-1); }
    else break;
  }
  return streak;
}

export function healthScore(entries){
  if(!entries?.length) return 0;
  const sums = entries.reduce((a,e)=>{
    a.r+=e.you.relationship; a.c+=e.you.communication; a.s+=e.you.stress; return a;
  }, {r:0,c:0,s:0});
  const n=entries.length, r=sums.r/n, c=sums.c/n, s=sums.s/n;
  return Math.round((r*0.45 + c*0.35 + (10 - s)*0.20)/10*100);
}

export function seededRandom(seed){
  let x=seed||123456789; return ()=>{x^=x<<13; x^=x>>17; x^=x<<5; return (x>>>0)/4294967296}
}
