import React from 'react';
import dayjs from 'dayjs';
export const clamp01=(n)=>Math.max(0,Math.min(10,n));
export const todayKey=(d=new Date())=>d.toISOString().slice(0,10);
export const formatShort=(iso)=>{const d=new Date(iso+'T00:00:00');return d.toLocaleDateString(undefined,{month:'short',day:'numeric'})};
export function useLocalStorage(key, initialValue){ const [v,setV]=React.useState(()=>{ const i=localStorage.getItem(key); return i?JSON.parse(i):initialValue; }); React.useEffect(()=>{ localStorage.setItem(key, JSON.stringify(v)); },[key,v]); return [v,setV]; }
export function calcStreak(entries){ if(!entries?.length) return 0; const days=new Set(entries.map(e=>e.date)); let s=0; let c=new Date(); for(;;){ const k=c.toISOString().slice(0,10); if(days.has(k)){ s++; c.setDate(c.getDate()-1);} else break; } return s; }
export function healthScore(entries){ if(!entries?.length) return 0; const sums=entries.reduce((a,e)=>{a.r+=e.you.relationship; a.c+=e.you.communication; a.s+=e.you.stress; return a},{r:0,c:0,s:0}); const n=entries.length, r=sums.r/n, c=sums.c/n, s=sums.s/n; return Math.round((r*0.45 + c*0.35 + (10-s)*0.20)/10*100); }
export function seededRandom(seed){ let x=seed||123456789; return ()=>{ x^=x<<13; x^=x>>17; x^=x<<5; return (x>>>0)/4294967296; } }
export const posWords=['love','great','good','happy','calm','connected','support','proud','fun','joy','appreciate','thanks']; export const negWords=['sad','angry','upset','tired','anxious','stress','mad','lonely','ignore','hurt','fight','argue'];
export function simpleSentiment(text=''){ const t=text.toLowerCase(); let s=0; posWords.forEach(w=>{ if(t.includes(w)) s+=1; }); negWords.forEach(w=>{ if(t.includes(w)) s-=1; }); return s; }
export function download(filename, text){ const blob=new Blob([text],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }
export async function sha256(text){ const enc=new TextEncoder().encode(text); const buf=await crypto.subtle.digest('SHA-256', enc); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''); }
export function toICS(title='Togetherly Check-In', description='', startDateISO=todayKey(), hours=20, minutes=0){ const dt=dayjs(startDateISO + `T${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:00`); const uid=Math.random().toString(36).slice(2)+'@togetherly'; return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Togetherly//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dt.format('YYYYMMDDTHHmmss')}
DTSTART:${dt.format('YYYYMMDDTHHmmss')}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`; }
export function base64Json(obj){ return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
export function fromBase64Json(str){ try { return JSON.parse(decodeURIComponent(escape(atob(str)))); } catch(e){ return null; } }
