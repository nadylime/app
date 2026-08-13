import React from 'react';

const people = [
  {name:'Dan', age:46, home:'Austin'}, {name:'Emily', age:46, home:'Austin'},
  {name:'Lyssie', age:16, home:'Austin'}, {name:'Ashton', age:19, home:'Austin'},
  {name:'Alec', age:24, home:'Atlanta'}, {name:'Addison', age:23, home:'Atlanta'}
];

const activities = [
  {id:'rafting', icon:'🛶', name:"Brown's Canyon rafting", type:'ADVENTURE', cost:'$$', desc:'Class III–IV whitewater through spectacular canyon scenery. One of the strongest fits for this group.', fit:'Friday or Sunday'},
  {id:'zipline', icon:'🪂', name:'Captain Zipline + aerial course', type:'ADVENTURE', cost:'$$', desc:'Ziplines, ropes, bridges and challenge elements near Salida. Courses range from entry level to very challenging.', fit:'Friday or Monday'},
  {id:'atv', icon:'🏎️', name:'Guided ATV / UTV tour', type:'ADVENTURE', cost:'$$$', desc:'Off-road Colorado terrain with a guide. Great option if the group wants speed and a little controlled chaos.', fit:'Monday'},
  {id:'monarch', icon:'🚠', name:'Monarch Crest Tramway', type:'SCENIC', cost:'$', desc:'Ride to 12,012 feet on the Continental Divide for huge mountain views without committing to a full-day hike.', fit:'Monday'},
  {id:'hot', icon:'♨️', name:'Mt. Princeton Hot Springs', type:'RECOVERY', cost:'$$', desc:'A good counterbalance to the adventure days. The resort is about 20 minutes from Salida.', fit:'Sunday or Monday'},
  {id:'royal', icon:'🏔️', name:'Royal Gorge adventure day', type:'BIG DAY', cost:'$$$', desc:'Longer day trip: combine high-adrenaline rafting, ziplining and the Royal Gorge area.', fit:'Monday'},
  {id:'hike', icon:'🥾', name:'Big mountain hike', type:'OUTDOORS', cost:'$', desc:'Choose a challenging trail based on weather, altitude and the group’s energy after the wedding.', fit:'Monday'},
  {id:'salida', icon:'🌊', name:'Salida + Arkansas River', type:'EASY', cost:'$', desc:'Downtown Salida, river walk, shops, galleries and food. Best as a flexible half-day rather than the main event.', fit:'Friday or Monday'}
];

const schedule = [
  {date:'Thu, Sep 3', label:'ARRIVAL', title:'Everyone gets to Denver', tone:'blue', items:[
    ['4:10 PM','✈️','Dan, Emily, Ashton & Lyssie depart Austin','AUS → DEN · Delta DL3669 · times are local'],
    ['6:45 PM','🛬','Austin group arrives Denver','Denver is 1 hour behind Austin'],
    ['8:30 PM','✈️','Alec & Addison depart Atlanta','ATL → DEN · Frontier · times are local'],
    ['10:05 PM','🛬','Alec & Addison arrive Denver','Denver local time'],
    ['Night','🏨','First night at Courtyard by Marriott','Denver Airport at Gateway Park · 4343 Airport Way']
  ]},
  {date:'Fri, Sep 4', label:'DAY 1', title:'Denver → Salida + first adventure', tone:'green', items:[
    ['Morning','☕','Breakfast + regroup','No need to rush the morning after travel'],
    ['Late AM','🚙','Drive Denver → Salida','Plan roughly 2½–3 hours with a stop'],
    ['3:00 PM','🏡','Airbnb check-in','306 Shepherd Road · hosted by Anne'],
    ['Afternoon','🔥','Adventure block','Vote in the app. Rafting or zipline are the leading concepts.'],
    ['Evening','🍽️','Dinner in Salida','Keep it relaxed and protect Saturday morning']
  ]},
  {date:'Sat, Sep 5', label:'WEDDING', title:'Wedding day', tone:'pink', items:[
    ['Morning','🥞','Family breakfast','No major activity scheduled'],
    ['Day','💍','WEDDING','Protected calendar block'],
    ['Evening','🥂','Wedding celebration','Enjoy the night. No early adventure scheduled Sunday.']
  ]},
  {date:'Sun, Sep 6', label:'DAY 2', title:'Adventure + recovery', tone:'orange', items:[
    ['11:00 AM','🏡','Airbnb checkout','306 Shepherd Road'],
    ['Late AM','🛶','Main adventure','Brown’s Canyon rafting is the leading candidate'],
    ['Afternoon','♨️','Recovery option','Mt. Princeton Hot Springs or free time'],
    ['Evening','🍽️','Final Salida-area dinner','Group dinner before the final activity day']
  ]},
  {date:'Mon, Sep 7', label:'DAY 3', title:'Choose-your-own Colorado day', tone:'purple', items:[
    ['Morning','🏎️','Big adventure option','ATV/UTV, zipline, big hike or Royal Gorge'],
    ['Afternoon','🚠','Scenic / flexible block','Monarch Crest Tramway, Salida or free time'],
    ['Evening','🌙','Last night','Pack and confirm Tuesday airport plan']
  ]},
  {date:'Tue, Sep 8', label:'DEPARTURE', title:'Head home', tone:'gray', items:[
    ['Morning','✈️','Alec & Addison depart Denver','Frontier · 10:43 AM DEN → ATL'],
    ['3:49 PM','🛬','Alec & Addison arrive Atlanta','Atlanta local time'],
    ['TBD','✈️','Austin group departs Denver','You provided DL3669, but current schedule data needs confirmation for this date']
  ]}
];

function useVotes(){
  const [votes,setVotes] = React.useState(()=>{try{return JSON.parse(localStorage.getItem('colorado-votes')||'{}')}catch{return {}}});
  React.useEffect(()=>localStorage.setItem('colorado-votes',JSON.stringify(votes)),[votes]);
  const setVote=(person,id,value)=>setVotes(v=>({...v,[person]:{...(v[person]||{}),[id]:value}}));
  return [votes,setVote];
}

export default function App(){
  const [tab,setTab]=React.useState('home');
  const [current,setCurrent]=React.useState('Dan');
  const [votes,setVote]=useVotes();
  const [groupOpen,setGroupOpen]=React.useState(false);
  const counts=activities.map(a=>({id:a.id,name:a.name,yes:people.filter(p=>votes[p.name]?.[a.id]==='yes').length,maybe:people.filter(p=>votes[p.name]?.[a.id]==='maybe').length,no:people.filter(p=>votes[p.name]?.[a.id]==='no').length}));
  const top=[...counts].sort((a,b)=>(b.yes+b.maybe*.35)-(a.yes+a.maybe*.35));
  return <div className="app-shell">
    <header className="topbar"><div className="brand"><div className="mark">CO</div><div><div className="overline">FAMILY TRIP</div><h1>Colorado 2026</h1></div></div><button className="group-btn" onClick={()=>setGroupOpen(!groupOpen)}>👥 6</button></header>
    {groupOpen && <div className="group-pop card"><div className="pop-title"><b>Trip group</b><button onClick={()=>setGroupOpen(false)}>×</button></div><div className="people-grid">{people.map(p=><button className={current===p.name?'person selected':'person'} key={p.name} onClick={()=>{setCurrent(p.name);setGroupOpen(false)}}><b>{p.name}</b><span>{p.age} · {p.home}</span></button>)}</div></div>}
    {tab==='home' && <Home go={setTab} top={top}/>} 
    {tab==='plan' && <Plan/>}
    {tab==='vote' && <Vote current={current} setCurrent={setCurrent} votes={votes} setVote={setVote} counts={counts}/>} 
    {tab==='travel' && <Travel/>}
    <nav className="bottom-nav">{[['home','⌂','Overview'],['plan','☷','Plan'],['vote','♥','Vote'],['travel','✈','Travel']].map(n=><button key={n[0]} className={tab===n[0]?'active':''} onClick={()=>setTab(n[0])}><span>{n[1]}</span><small>{n[2]}</small></button>)}</nav>
  </div>
}

function Home({go,top}){return <main className="page">
  <section className="hero card"><div className="overline light">SEP 3–8 · SALIDA, COLORADO</div><h2>Wedding weekend.<br/>Adventure trip.</h2><p>Six people. One wedding. Three days to make the Colorado part unforgettable.</p><div className="hero-actions"><button className="gold" onClick={()=>go('vote')}>Start voting →</button><button className="ghost" onClick={()=>go('plan')}>View plan</button></div></section>
  <section className="time-note card"><span>🕐</span><div><b>Time zones handled</b><p>Austin is 1 hour ahead of Denver. Atlanta is 2 hours ahead of Denver. Flight times shown in the app are local airport times.</p></div></section>
  <div className="section-head"><h3>Trip at a glance</h3><span>6 travelers</span></div>
  <div className="stats"><div className="stat card"><b>3</b><span>adventure days</span></div><div className="stat card"><b>1</b><span>wedding day</span></div><div className="stat card"><b>2</b><span>stays</span></div></div>
  <div className="section-head"><h3>What the group is leaning toward</h3><button onClick={()=>go('vote')}>Vote →</button></div>
  {top.slice(0,3).map((a,i)=><div className="rank card" key={a.id}><div className="rank-num">{i+1}</div><div><b>{a.name}</b><p>{a.yes} yes · {a.maybe} maybe</p></div><div className="bar"><i style={{width:`${Math.max(4,a.yes/6*100)}%`}}/></div></div>)}
  <div className="section-head"><h3>Next up</h3><button onClick={()=>go('plan')}>Full itinerary →</button></div>
  {schedule.slice(0,3).map(d=><div className="next card" key={d.date}><div className={`dot ${d.tone}`}/><div><small>{d.date} · {d.label}</small><b>{d.title}</b><p>{d.items[0][2]}</p></div></div>)}
  <div className="adventure-note"><b>🔥 Adventure setting: 10/10</b><p>The app will prioritize rafting, ziplining, ATV/UTV, challenging hikes and other memorable experiences.</p></div>
</main>}

function Plan(){return <main className="page"><div className="page-title"><div><div className="overline">MASTER ITINERARY</div><h2>Colorado trip</h2></div><span className="pill">Sep 3–8</span></div>{schedule.map(d=><section className="day" key={d.date}><div className="day-title"><div className={`dot ${d.tone}`}/><div><small>{d.date} · {d.label}</small><h3>{d.title}</h3></div></div><div className="timeline">{d.items.map((x,i)=><div className="timeline-row" key={i}><div className="time">{x[0]}</div><div className="timeline-icon">{x[1]}</div><div><b>{x[2]}</b><p>{x[3]}</p></div></div>)}</div></section>)}</main>}

function Vote({current,setCurrent,votes,setVote,counts}){return <main className="page"><div className="page-title"><div><div className="overline">GROUP DECISIONS</div><h2>Build the adventure</h2></div></div><div className="vote-person card"><span>Voting as</span><select value={current} onChange={e=>setCurrent(e.target.value)}>{people.map(p=><option key={p.name}>{p.name}</option>)}</select></div><div className="vote-instructions">❤️ Pick your favorites. 👍 Mark maybes. 👎 Skip anything you don't want. You can change your vote anytime.</div>{activities.map(a=>{const v=votes[current]?.[a.id];const c=counts.find(x=>x.id===a.id);return <div className="activity card" key={a.id}><div className="activity-head"><div className="activity-icon">{a.icon}</div><div><h3>{a.name}</h3><span className="pill">{a.type}</span> <span className="cost">{a.cost}</span></div></div><p>{a.desc}</p><div className="fit">📅 Best fit: <b>{a.fit}</b></div><div className="vote-buttons">{[['yes','❤️ Want it'],['maybe','👍 Maybe'],['no','👎 Skip']].map(x=><button className={v===x[0]?'chosen':''} key={x[0]} onClick={()=>setVote(current,a.id,x[0])}>{x[1]}</button>)}</div><div className="vote-count">{c.yes} want it · {c.maybe} maybe · {c.no} skip</div></div>})}</main>}

function Travel(){return <main className="page"><div className="page-title"><div><div className="overline">TRAVEL + LODGING</div><h2>Everyone's logistics</h2></div></div><div className="travel-card card"><div className="travel-head"><span>✈️</span><div><h3>Dan · Emily · Ashton · Lyssie</h3><p>Austin → Denver</p></div></div><div className="flight"><div><small>THU SEP 3</small><strong>4:10 PM</strong><span>AUS · Austin</span></div><div className="route"><b>DL3669</b><span>→</span><small>3h 35m</small></div><div className="right"><small>LOCAL</small><strong>6:45 PM</strong><span>DEN · Denver</span></div></div><div className="confirmed">✓ User-provided flight details · 6:45 PM Denver time is 7:45 PM Austin time.</div></div>
  <div className="travel-card card"><div className="travel-head"><span>✈️</span><div><h3>Alec · Addison</h3><p>Atlanta ↔ Denver · Frontier</p></div></div><div className="flight"><div><small>THU SEP 3</small><strong>8:30 PM</strong><span>ATL · Atlanta</span></div><div className="route"><b>F9</b><span>→</span><small>3h 35m</small></div><div className="right"><small>LOCAL</small><strong>10:05 PM</strong><span>DEN · Denver</span></div></div><div className="flight"><div><small>TUE SEP 8</small><strong>10:43 AM</strong><span>DEN · Denver</span></div><div className="route"><b>F9</b><span>→</span><small>3h 06m</small></div><div className="right"><small>LOCAL</small><strong>3:49 PM</strong><span>ATL · Atlanta</span></div></div><div className="confirmed">✓ Confirmed from the flight screenshot you provided. Atlanta is 2 hours ahead of Denver.</div></div>
  <div className="stay card"><div className="stay-icon">🏨</div><div><h3>Courtyard by Marriott Denver Airport at Gateway Park</h3><p>4343 Airport Way, Denver, CO 80239</p><small>Thu Sep 3 → Fri Sep 4</small></div></div>
  <div className="stay card"><div className="stay-icon">🏡</div><div><h3>Home in Salida</h3><p>306 Shepherd Road · Hosted by Anne</p><small>Fri Sep 4 at 3:00 PM → Sun Sep 6 at 11:00 AM</small></div></div>
  <div className="warning"><b>⚠️ One flight still needs verification</b><p>You said the Austin group flies home Tuesday on DL3669. Current public schedule data shows DL3669 operating DEN → AUS, but I cannot verify the exact Sep 8 departure time from the information available. The app intentionally leaves that flight as TBD rather than inventing a time.</p></div>
  <div className="time-note card"><span>🕐</span><div><b>Quick time-zone cheat sheet</b><p>Denver → Austin: add 1 hour. Denver → Atlanta: add 2 hours. Austin → Denver: subtract 1 hour. Atlanta → Denver: subtract 2 hours.</p></div></div>
</main>}
