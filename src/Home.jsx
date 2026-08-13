import React from 'react';
import {OVERVIEW} from './tripPeople.js';

export default function Home({go,ranked,score,openIdea,openDay}){
 const openOverview=i=>{
  if(i===2) return go('saturday');
  if(i===1) return openDay('Friday');
  if(i===3) return openDay('Sunday');
  if(i===4) return openDay('Monday');
  return go('trip');
 };
 return <main className="page home-page">
  <section className="hero card"><h2>Wedding trip.<br/>Packed with adventure.</h2><p>Vote, add ideas, and build the open parts of the trip together.</p><div className="hero-actions"><button className="gold" onClick={()=>go('explore')}>Explore ideas →</button><button className="ghost" onClick={()=>go('vote')}>Vote</button></div></section>
  <div className="section-head"><h3>Trip overview</h3><button onClick={()=>go('trip')}>Details →</button></div>
  <div className="card" style={{padding:12}}>{OVERVIEW.map((x,i)=><button className="overview-row" key={x[0]} onClick={()=>openOverview(i)}><b>{x[0]}</b><span>{['✈️','🔥','💍','🛶','🏎️','✈️'][i]}</span><strong>{x[1]}</strong>{[1,2,3,4].includes(i)&&<span className="pill">OPEN</span>}</button>)}</div>
  <div className="section-head"><h3>Group favorites</h3><button onClick={()=>go('vote')}>Vote →</button></div>
  {ranked.slice(0,3).map((a,i)=><button className="rank card rank-button" key={a.id} onClick={()=>openIdea(a)}><div className="rank-num">{i+1}</div><div><b>{a.name}</b><p>{a.day} · {a.where}</p></div><b>{score(a.id)} pts</b></button>)}
 </main>
}
