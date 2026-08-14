import React from 'react';
import {OVERVIEW} from './tripPeople.js';

const overviewIcons=['plane','route','mountain','heart','sun','compass','plane'];

function OverviewIcon({type}){
  const common={fill:'none',stroke:'currentColor',strokeWidth:'1.8',strokeLinecap:'round',strokeLinejoin:'round'};
  return <span className="overview-icon" aria-hidden="true"><svg viewBox="0 0 24 24" {...common}>
    {type==='plane'&&<><path d="M22 2 9.5 14.5"/><path d="m22 2-7 20-4-9-9-4Z"/></>}
    {type==='route'&&<><circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3"/></>}
    {type==='mountain'&&<><path d="m3 19 6-10 3 5 2-3 7 8Z"/><path d="m7.7 11.2 1.3 1.3 1.2-1.1"/></>}
    {type==='heart'&&<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z"/>}
    {type==='sun'&&<><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>}
    {type==='compass'&&<><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9Z"/></>}
  </svg></span>;
}

export default function Home({go,ranked,score,openIdea,openDay}){
  const openOverview=index=>{
    if(index===1)return openDay('Friday');
    if(index===4)return openDay('Sunday');
    if(index===5)return openDay('Monday');
    return go('trip');
  };

  return <main className="page home-page">
    <section className="hero card"><h2>Wedding trip.<br/>Packed with adventure.</h2><p>Let the fun begin.</p><div className="hero-actions"><button className="gold" onClick={()=>go('explore')}>Explore ideas →</button><button className="ghost" onClick={()=>go('chat')}>Chat</button></div></section>
    <div className="section-head"><h3>Trip overview</h3><button onClick={()=>go('trip')}>Details →</button></div>
    <div className="card overview-card">{OVERVIEW.map((item,index)=><button className="overview-row" key={`${item[0]}-${item[1]}`} onClick={()=>openOverview(index)}><b>{item[0]}</b><OverviewIcon type={overviewIcons[index]}/><strong>{item[1]}</strong></button>)}</div>
    <div className="section-head"><h3>Group favorites</h3><button onClick={()=>go('vote')}>Vote →</button></div>
    {ranked.slice(0,3).map((idea,index)=><button className="rank card rank-button" key={idea.id} onClick={()=>openIdea(idea)}><div className="rank-num">{index+1}</div><div><b>{idea.name}</b><p>{idea.day}</p></div><b>{score(idea.id)} pts</b></button>)}
  </main>;
}
