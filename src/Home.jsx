import React from 'react';
import {OVERVIEW} from './tripPeople.js';

export default function Home({go,ranked,score,openIdea,openDay}){
  const openOverview=index=>{
    if(index===1)return openDay('Friday');
    if(index===3)return openDay('Sunday');
    if(index===4)return openDay('Monday');
    return go('trip');
  };

  return <main className="page home-page">
    <section className="hero card"><h2>Wedding trip.<br/>Packed with adventure.</h2><p>Vote, add ideas, chat, and build the open parts of the trip together.</p><div className="hero-actions"><button className="gold" onClick={()=>go('explore')}>Explore ideas →</button><button className="ghost" onClick={()=>go('chat')}>Chat</button></div></section>
    <div className="section-head"><h3>Trip overview</h3><button onClick={()=>go('trip')}>Details →</button></div>
    <div className="card overview-card">{OVERVIEW.map((item,index)=><button className="overview-row" key={item[0]} onClick={()=>openOverview(index)}><b>{item[0]}</b><span>{['✈️','🔥','💍','🛶','🏎️','✈️'][index]}</span><strong>{item[1]}</strong></button>)}</div>
    <div className="section-head"><h3>Group favorites</h3><button onClick={()=>go('vote')}>Vote →</button></div>
    {ranked.slice(0,3).map((idea,index)=><button className="rank card rank-button" key={idea.id} onClick={()=>openIdea(idea)}><div className="rank-num">{index+1}</div><div><b>{idea.name}</b><p>{idea.day}</p></div><b>{score(idea.id)} pts</b></button>)}
  </main>;
}
