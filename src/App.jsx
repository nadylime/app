import React from 'react';
import Home from './Home.jsx';
import Trip from './Trip.jsx';
import Chat from './Chat.jsx';
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

export default function App(){
  const [tab,setTab]=React.useState('home');
  const [person,setPerson]=React.useState(()=>localStorage.getItem('trip-person')||'');
  const [selected,setSelected]=React.useState(null);
  const [exploreDay,setExploreDay]=React.useState('Friday');
  const {ideas,setIdeas,votes,setVotes,voteDays,setVoteDays}=useSharedTrip(START);
  const chat=useSharedChat(person,tab==='chat');

  React.useEffect(()=>{
    if(person)localStorage.setItem('trip-person',person);
  },[person]);

  React.useEffect(()=>{
    document.title=chat.unread?`(${chat.unread}) Colorado Family Trip`:'Colorado Family Trip';
    if('setAppBadge' in navigator){
      if(chat.unread)navigator.setAppBadge(chat.unread).catch(()=>{});
      else navigator.clearAppBadge?.().catch(()=>{});
    }
  },[chat.unread]);

  const add=x=>setIdeas(current=>[...current,{...x,id:'i'+Date.now(),icon:'💡',by:person}]);
  const vote=(id,val)=>setVotes(current=>({...current,[person]:{...(current[person]||{}),[id]:val}}));
  const chooseVoteDay=(id,day)=>setVoteDays(current=>({...current,[person]:{...(current[person]||{}),[id]:day}}));
  const score=id=>PEOPLE.reduce((total,name)=>total+(votes[name]?.[id]==='yes'?2:votes[name]?.[id]==='maybe'?1:0),0);
  const ranked=[...ideas].sort((a,b)=>score(b.id)-score(a.id));
  const openDay=day=>{setExploreDay(day);setTab('explore')};

  const nav=[['home','⌂','Home'],['explore','⌕','Explore'],['chat','◌','Chat'],['vote','♥','Vote'],['trip','☷','Trip']];

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><TripLogo/><div><h1>Colorado Family Trip</h1><div className="trip-date">September 3–8, 2026 · Salida, Colorado</div></div></div>
      <select className="group-btn" value={person} onChange={event=>setPerson(event.target.value)} aria-label="Who is using the app?">
        {!person&&<option value="" disabled>Choose name</option>}
        {PEOPLE.map(name=><option key={name}>{name}</option>)}
      </select>
    </header>

    {tab==='home'&&<Home go={setTab} ranked={ranked} score={score} openIdea={setSelected} openDay={openDay}/>} 
    {tab==='explore'&&<Explore ideas={ideas} add={add} openIdea={setSelected} initialDay={exploreDay}/>} 
    {tab==='chat'&&<Chat person={person} messages={chat.messages} send={chat.send} sending={chat.sending} error={chat.error} refresh={chat.refresh}/>} 
    {tab==='vote'&&<Vote ideas={ideas} votes={votes} voteDays={voteDays} person={person} vote={vote} chooseVoteDay={chooseVoteDay} score={score} add={add}/>} 
    {tab==='trip'&&<Trip/>}

    <nav className="bottom-nav five" aria-label="Main navigation">
      {nav.map(item=><button key={item[0]} className={tab===item[0]?'active':''} onClick={()=>setTab(item[0])}>
        <span className="nav-icon">{item[1]}{item[0]==='chat'&&chat.unread>0&&<em className="nav-badge">{chat.unread>9?'9+':chat.unread}</em>}</span>
        <small>{item[2]}</small>
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

function Explore({ideas,add,openIdea,initialDay}){
  const [query,setQuery]=React.useState('');
  const [day,setDay]=React.useState(initialDay||'Friday');
  React.useEffect(()=>setDay(initialDay||'Friday'),[initialDay]);
  const shown=ideas.filter(idea=>idea.day===day&&(!query||(`${idea.name} ${idea.where} ${idea.desc}`).toLowerCase().includes(query.toLowerCase())));
  return <main className="page">
    <div className="page-title"><div><div className="overline">EXPLORE</div><h2>Find something to do</h2></div></div>
    <div className="vote-person card"><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search ideas..."/><select value={day} onChange={event=>setDay(event.target.value)}><option>Friday</option><option>Saturday</option><option>Sunday</option><option>Monday</option></select></div>
    {shown.map(idea=><button className="activity card activity-button" key={idea.id} onClick={()=>openIdea(idea)}><div className="activity-head"><div className="activity-icon">{idea.icon}</div><div><h3>{idea.name}</h3><span className="pill">{idea.where}</span></div></div><p>{idea.desc}</p></button>)}
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
  return <main className="page">
    <div className="page-title"><div><div className="overline">FAMILY PICKS</div><h2>What sounds fun?</h2></div></div>
    {ideas.map(idea=><div className="activity card" key={idea.id}>
      <div className="activity-detail-static">
        <div className="activity-head"><div className="activity-icon">{idea.icon}</div><div><h3>{idea.name}</h3><span className="pill">{idea.day}</span> <span className="cost">{idea.where}</span>{idea.by&&<p>Added by {idea.by}</p>}</div></div>
        <p className="activity-description">{idea.desc}</p>
      </div>
      <label className="vote-day"><span>Preferred day <small>Suggested: {idea.day}</small></span><select value={voteDays[person]?.[idea.id]||''} onChange={event=>chooseVoteDay(idea.id,event.target.value)} aria-label={`Preferred day for ${idea.name}`}><option value="">Choose day</option><option>Friday</option><option>Saturday</option><option>Sunday</option><option>Monday</option></select></label>
      <div className="vote-buttons">{[['yes','❤️ Yes'],['maybe','👍 Maybe'],['no','👎 No']].map(option=><button key={option[0]} className={votes[person]?.[idea.id]===option[0]?'chosen':''} onClick={()=>vote(idea.id,option[0])}>{option[1]}</button>)}</div>
      <div className="vote-count">Group score: {score(idea.id)}</div>
    </div>)}
    <QuickAdd add={add}/>
  </main>;
}

function IdeaModal({idea,close}){
  return <div className="modal-backdrop" onClick={close}><div className="modal-card" onClick={event=>event.stopPropagation()}><button className="modal-close" onClick={close} aria-label="Close">×</button><div className="activity-icon big-icon">{idea.icon}</div><div className="overline">{idea.day} · {idea.where}</div><h2>{idea.name}</h2><p>{idea.desc}</p><a className="map-link" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(idea.name+' '+idea.where+' Colorado')}`}>Open in Google Maps ↗</a></div></div>;
}
