import React from 'react';
import Home from './Home.jsx';
import Trip from './Trip.jsx';
import Chat from './Chat.jsx';
import GoogleMapsLink from './GoogleMapsLink.jsx';
import {PEOPLE} from './tripPeople.js';
import {useSharedChat,useSharedTrip} from './shared.js';

const START=[
  {id:'f1',icon:'🛶',name:'White Water Rafting',day:'Friday',where:'Buena Vista',desc:'Turn the drive from Denver into a half-day river adventure through Browns Canyon on the Arkansas River. Expect a safety briefing, helmets and life jackets, several miles of Class II–III rapids, and time to change before continuing to Salida.'},
  {id:'f2',icon:'🏎️',name:'High-Country ATV / UTV Ride',day:'Friday',where:'Buena Vista',desc:'Join a guided off-road ride into the mountains near Buena Vista. The experience typically includes equipment and instruction, then several hours on rocky trails with overlooks, dust, and plenty of bumps before the group continues to Salida.'},
  {id:'a1',icon:'🥾',name:'Scenic Saturday Hike',day:'Saturday',where:'Salida area',desc:'Use the open morning for a scenic trail close to Salida, with a route selected for mountain views and enough time to return, shower, eat, and get ready. This would be a shorter outing rather than an all-day or remote hike.'},
  {id:'a2',icon:'♨️',name:'Hot Springs Morning',day:'Saturday',where:'Salida / Buena Vista area',desc:'Spend the morning soaking in natural hot-springs pools with mountain views. This is the lowest-stress Saturday option and leaves a generous buffer to return to the house, have lunch, and get ready for the wedding.'},
  {id:'s1',icon:'🌊',name:"Brown's Canyon White Water Rafting",day:'Sunday',where:'Salida / Buena Vista',desc:'Take a classic half-day rafting trip through Browns Canyon, one of the area’s signature adventures. The group would receive gear and instruction before paddling Class II–III rapids, with splashes, scenery, and active teamwork.'},
  {id:'s2',icon:'🪂',name:'Zipline / Aerial Course',day:'Sunday',where:'Salida / Buena Vista',desc:'Spend several hours moving through a guided aerial course with ziplines, suspended bridges, and elevated obstacles. This is a high-energy option that involves heights, harnesses, climbing stairs, and short walks between course sections.'},
  {id:'s3',icon:'😌',name:'Chill / Free Time',day:'Sunday',where:'Flexible',desc:'Keep part or all of Sunday unscheduled for sleeping in, a relaxed meal, walking around Salida, enjoying the hot tub, or simply spending time together. This option intentionally protects downtime instead of filling every open hour with another organized activity.'},
  {id:'m1',icon:'🌉',name:'Royal Gorge Adventure Day',day:'Monday',where:'Cañon City',desc:'Use the full open day for the Royal Gorge area, including the bridge, canyon overlooks, and the option to add a thrill activity such as the gondola, sky coaster, zipline, or rafting. This is the longest excursion and includes a substantial round-trip drive.'},
  {id:'m2',icon:'🏔️',name:'Mountain ATV / UTV Day',day:'Monday',where:'Salida region',desc:'Book a longer guided off-road ride with no wedding or checkout deadline. Expect mountain trails, uneven terrain, dust, scenic stops, and several hours outdoors, with the exact route and vehicle chosen for the group’s comfort level.'},
  {id:'m3',icon:'☕',name:'Slow Day + Free Time',day:'Monday',where:'Flexible',desc:'Plan a slower final day with a late breakfast, casual exploring, shopping, a scenic drive, and time to relax before the trip home. The group can still choose one easy activity without committing the entire day to a fixed excursion.'}
];

function TripLogo(){return <img className="mark" src="/colorado-trip-logo.png" alt="Magstadt Colorado trip logo"/>}

function ChatNavIcon(){return <svg className="footer-chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/></svg>}
function ExploreNavIcon(){return <svg className="footer-explore-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8Z"/></svg>}
function HomeNavIcon(){return <svg className="footer-home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5.5 9.5V21h13V9.5M9.5 21v-7h5v7"/></svg>}
function VoteNavIcon(){return <svg className="footer-vote-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z"/></svg>}
function TripNavIcon(){return <svg className="footer-trip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".75" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r=".75" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r=".75" fill="currentColor" stroke="none"/></svg>}
function SparkleIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z"/></svg>}

export default function App(){
  const [tab,setTab]=React.useState('home');
  const [person,setPerson]=React.useState(()=>localStorage.getItem('trip-person')||'');
  const [selected,setSelected]=React.useState(null);
  const [exploreDay,setExploreDay]=React.useState('Friday');
  const {ideas,votes,voteDays,error:tripError,addIdea,setVoteChoice,setPreferredDay}=useSharedTrip(START);
  const chat=useSharedChat(person,tab==='chat');

  React.useEffect(()=>{
    if(person)localStorage.setItem('trip-person',person);
  },[person]);

  React.useEffect(()=>{
    window.scrollTo({top:0,left:0,behavior:'auto'});
  },[tab]);

  React.useEffect(()=>{
    let stopped=false;
    const checkForUpdate=async()=>{
      try{
        const response=await fetch(`/version.json?t=${Date.now()}`,{cache:'no-store'});
        const latest=(await response.json()).version;
        if(stopped||!latest||latest===__APP_VERSION__)return;
        const url=new URL(window.location.href);
        if(url.searchParams.get('app-version')===latest)return;
        url.searchParams.set('app-version',latest);
        window.location.replace(url.toString());
      }catch{
        // Stay on the current version when the app is temporarily offline.
      }
    };
    const checkWhenVisible=()=>{if(document.visibilityState==='visible')checkForUpdate()};
    checkForUpdate();
    document.addEventListener('visibilitychange',checkWhenVisible);
    return()=>{stopped=true;document.removeEventListener('visibilitychange',checkWhenVisible)};
  },[]);

  React.useEffect(()=>{
    document.title=chat.unread?`(${chat.unread}) Colorado Family Trip`:'Colorado Family Trip';
    if('setAppBadge' in navigator){
      if(chat.unread)navigator.setAppBadge(chat.unread).catch(()=>{});
      else navigator.clearAppBadge?.().catch(()=>{});
    }
  },[chat.unread]);

  const add=x=>addIdea({...x,id:`i${Date.now()}${Math.random().toString(36).slice(2,7)}`,icon:x.icon??'💡',by:person,createdAt:Date.now()});
  const vote=(id,val)=>setVoteChoice(person,id,val);
  const chooseVoteDay=(id,day)=>setPreferredDay(person,id,day);
  const score=id=>PEOPLE.reduce((total,name)=>total+(votes[name]?.[id]==='yes'?2:votes[name]?.[id]==='maybe'?1:0),0);
  const ranked=[...ideas].sort((a,b)=>score(b.id)-score(a.id));
  const openDay=day=>{setExploreDay(day);setTab('explore')};

  const nav=[['home','Home'],['explore','Explore'],['chat','Chat'],['vote','Vote'],['trip','Trip']];
  const navIcon=id=>id==='home'?<HomeNavIcon/>:id==='explore'?<ExploreNavIcon/>:id==='chat'?<ChatNavIcon/>:id==='vote'?<VoteNavIcon/>:<TripNavIcon/>;

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><TripLogo/><div><h1>Colorado Family Trip</h1><div className="trip-date">September 3–8, 2026 · Salida, Colorado</div></div></div>
      <select className="group-btn" value={person} onChange={event=>setPerson(event.target.value)} aria-label="Who is using the app?">
        {!person&&<option value="" disabled>Choose name</option>}
        {PEOPLE.map(name=><option key={name}>{name}</option>)}
      </select>
    </header>

    {tab==='home'&&<Home go={setTab} ranked={ranked} score={score} openIdea={setSelected} openDay={openDay}/>} 
    {tripError&&<div className="shared-data-error" role="status">{tripError}</div>}
    {tab==='explore'&&<Explore ideas={ideas} votes={votes} voteDays={voteDays} add={add} openIdea={setSelected} initialDay={exploreDay}/>} 
    {tab==='chat'&&<Chat person={person} messages={chat.messages} send={chat.send} remove={chat.remove} sending={chat.sending} deleting={chat.deleting} error={chat.error} refresh={chat.refresh}/>} 
    {tab==='vote'&&<Vote ideas={ideas} votes={votes} voteDays={voteDays} person={person} vote={vote} chooseVoteDay={chooseVoteDay} score={score} add={add}/>} 
    {tab==='trip'&&<Trip/>}

    <nav className="bottom-nav five" aria-label="Main navigation">
      {nav.map(item=><button key={item[0]} className={tab===item[0]?'active':''} onClick={()=>{window.scrollTo({top:0,left:0,behavior:'auto'});setTab(item[0])}}>
        <span className="nav-icon">{navIcon(item[0])}{item[0]==='chat'&&chat.unread>0&&<em className="nav-badge">{chat.unread>9?'9+':chat.unread}</em>}</span>
        <small>{item[1]}</small>
      </button>)}
    </nav>

    {selected&&<IdeaModal idea={selected} close={()=>setSelected(null)}/>} 
    {!person&&<IdentityGate choose={setPerson}/>} 
  </div>;
}

function IdentityGate({choose}){
  return <div className="identity-backdrop"><section className="identity-card card" role="dialog" aria-modal="true" aria-labelledby="identity-title">
    <img src="/colorado-trip-logo.png" alt=""/>
    <div className="overline">WELCOME TO THE TRIP</div>
    <h2 id="identity-title">Who are you?</h2>
    <p>Choose your name once. This device will remember you for votes, ideas, and family chat.</p>
    <div className="identity-grid">{PEOPLE.map(name=><button key={name} onClick={()=>choose(name)}>{name}</button>)}</div>
  </section></div>;
}

function Explore({ideas,votes,voteDays,add,openIdea,initialDay}){
  const [day,setDay]=React.useState(initialDay||'Friday');
  const [claudeQuestion,setClaudeQuestion]=React.useState('');
  const [claudeIntro,setClaudeIntro]=React.useState('');
  const [claudeResults,setClaudeResults]=React.useState([]);
  const [addedResults,setAddedResults]=React.useState({});
  const [claudeError,setClaudeError]=React.useState('');
  const [askingClaude,setAskingClaude]=React.useState(false);
  React.useEffect(()=>setDay(initialDay||'Friday'),[initialDay]);
  React.useEffect(()=>{
    setClaudeIntro('');
    setClaudeResults([]);
    setAddedResults({});
    setClaudeError('');
  },[day]);
  const shown=ideas.filter(idea=>idea.day===day);
  const askClaude=async event=>{
    event.preventDefault();
    if(!claudeQuestion.trim()||askingClaude)return;
    setAskingClaude(true);
    setClaudeError('');
    try{
      const response=await fetch('/.netlify/functions/claude',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({question:claudeQuestion.trim(),day,ideas,votes,voteDays})
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(data.error||'Claude is temporarily unavailable.');
      setClaudeIntro(data.intro||'Here are a few possibilities to consider.');
      setClaudeResults(data.ideas||[]);
      setAddedResults({});
    }catch(error){
      setClaudeError(error.message||'Claude is temporarily unavailable.');
    }finally{
      setAskingClaude(false);
    }
  };
  const addClaudeResult=(result,index)=>{
    add({name:result.name,day:result.day||day,where:result.area||'Colorado',desc:`${result.summary}${result.whyItFits?` Why it fits: ${result.whyItFits}`:''}`,icon:''});
    setAddedResults(current=>({...current,[index]:true}));
  };
  return <main className="page">
    <div className="page-title explore-title"><div><div className="overline">EXPLORE</div><h2>Find your next adventure</h2></div></div>
    <div className="explore-days" role="group" aria-label="Explore by day">{['Friday','Saturday','Sunday','Monday'].map(option=><button key={option} className={day===option?'active':''} onClick={()=>setDay(option)}>{option}</button>)}</div>
    <section className="claude-panel card"><div className="claude-panel-head"><span className="claude-spark"><SparkleIcon/></span><div><div className="overline">ASK CLAUDE</div><h3>Discover something new</h3></div></div><form onSubmit={askClaude}><textarea value={claudeQuestion} maxLength={500} onChange={event=>setClaudeQuestion(event.target.value)} placeholder={`Try: fun hikes for ${day}, rafting options, or an easy afternoon`}/><button className="btn btn-primary" disabled={!claudeQuestion.trim()||askingClaude}>{askingClaude?'Finding ideas…':'Find ideas'}</button></form>{claudeError&&<p className="claude-error">{claudeError}</p>}</section>
    {claudeResults.length>0&&<section className="claude-results"><div className="section-head explore-section-head"><div><div className="overline">CLAUDE SUGGESTS</div><h3>Ideas worth exploring</h3></div></div>{claudeIntro&&<p className="claude-intro">{claudeIntro}</p>}{claudeResults.map((result,index)=><article className="claude-result card" key={`${result.name}-${index}`}><div className="claude-result-number">{String(index+1).padStart(2,'0')}</div><div className="claude-result-body"><div className="claude-result-meta"><span>{result.day||day}</span>{result.area&&<span>{result.area}</span>}</div><h3>{result.name}</h3><p>{result.summary}</p>{result.whyItFits&&<div className="why-fit"><b>Why it fits</b><span>{result.whyItFits}</span></div>}<button className="add-result" disabled={addedResults[index]} onClick={()=>addClaudeResult(result,index)}>{addedResults[index]?'Added to ideas ✓':'＋ Add to our ideas'}</button></div></article>)}</section>}
    <div className="section-head explore-section-head"><div><div className="overline">CURRENT IDEAS</div><h3>{day}</h3></div><span>{shown.length}</span></div>
    <div className="explore-idea-list">{shown.map((idea,index)=><button className="explore-idea-card card" key={idea.id} onClick={()=>openIdea(idea)}><span className="idea-index">{String(index+1).padStart(2,'0')}</span><span><b>{idea.name}</b><small>{idea.where}</small></span><strong aria-hidden="true">→</strong></button>)}</div>
    <QuickAdd add={add}/>
  </main>;
}

function QuickAdd({add}){
  const [open,setOpen]=React.useState(false);
  const [name,setName]=React.useState('');
  const [day,setDay]=React.useState('Friday');
  const [note,setNote]=React.useState('');
  return <div className="quick-add"><button className="btn btn-primary" onClick={()=>setOpen(!open)}>＋ Add your own recommendation</button>{open&&<form className="card quick-add-form" onSubmit={event=>{event.preventDefault();if(!name.trim())return;add({name:name.trim(),day,where:'Family suggestion',desc:note.trim()||'A family suggestion. Add more details in the chat so everyone knows what the activity would involve.'});setName('');setNote('');setOpen(false)}}><input value={name} onChange={event=>setName(event.target.value)} placeholder="Activity or place"/><select value={day} onChange={event=>setDay(event.target.value)}><option>Friday</option><option>Saturday</option><option>Sunday</option><option>Monday</option></select><textarea value={note} onChange={event=>setNote(event.target.value)} placeholder="Describe what the activity entails"/><button className="gold">Add idea</button></form>}</div>;
}

function Vote({ideas,votes,voteDays,person,vote,chooseVoteDay,score,add}){
  const [expanded,setExpanded]=React.useState('');
  return <main className="page">
    <div className="page-title"><div><div className="overline">FAMILY PICKS</div><h2>What sounds fun?</h2></div></div>
    {ideas.map((idea,index)=><div className="activity card vote-card" key={idea.id}>
      <button className="vote-activity-toggle" onClick={()=>setExpanded(expanded===idea.id?'':idea.id)} aria-expanded={expanded===idea.id}>
        <span className="vote-number">{String(index+1).padStart(2,'0')}</span><div><h3>{idea.name}</h3>{idea.by&&<small>Added by {idea.by}</small>}<span className="vote-details-label">{expanded===idea.id?'Hide details':'View details'}</span></div><span className="vote-header-score">{score(idea.id)} pts</span><b aria-hidden="true">{expanded===idea.id?'−':'+'}</b>
      </button>
      {expanded===idea.id&&<p className="activity-description vote-description">{idea.desc}</p>}
      <label className="vote-day"><span>Preferred day</span><select value={voteDays[person]?.[idea.id]||''} onChange={event=>chooseVoteDay(idea.id,event.target.value)} aria-label={`Preferred day for ${idea.name}`}><option value="">Choose day</option><option>Friday</option><option>Saturday</option><option>Sunday</option><option>Monday</option></select></label>
      <div className="vote-buttons">{[['yes','Yes'],['maybe','Maybe'],['no','No']].map(option=><button key={option[0]} className={votes[person]?.[idea.id]===option[0]?'chosen':''} onClick={()=>vote(idea.id,option[0])}>{option[1]}</button>)}</div>
    </div>)}
    <QuickAdd add={add}/>
  </main>;
}

function IdeaModal({idea,close}){
  return <div className="modal-backdrop" onClick={close}><div className="modal-card" onClick={event=>event.stopPropagation()}><button className="modal-close" onClick={close} aria-label="Close">×</button><div className="overline">{idea.day} · {idea.where}</div><h2>{idea.name}</h2><p>{idea.desc}</p><GoogleMapsLink className="map-link" query={`${idea.name} ${idea.where} Colorado`}>Open in Google Maps ↗</GoogleMapsLink></div></div>;
}
