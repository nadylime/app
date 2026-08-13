import React from 'react';
import Home from './Home.jsx';
import Trip from './Trip.jsx';
import {PEOPLE} from './tripPeople.js';

const START=[
{id:'f1',icon:'🛶',name:'Buena Vista rafting',day:'Friday',where:'US-285 / Buena Vista',desc:'A real adventure that works with the drive from Denver to Salida.'},
{id:'f2',icon:'🏎️',name:'High-country ATV / UTV',day:'Friday',where:'Buena Vista',desc:'Guided off-road adventure along the route south.'},
{id:'s1',icon:'🌊',name:"Brown's Canyon rafting",day:'Sunday',where:'Salida / Buena Vista',desc:'Classic Arkansas River adventure close to Salida.'},
{id:'s2',icon:'🪂',name:'Zipline / aerial course',day:'Sunday',where:'Salida / Buena Vista',desc:'High-energy half-day option.'},
{id:'m1',icon:'🌉',name:'Royal Gorge adventure day',day:'Monday',where:'Cañon City',desc:'A bigger excursion for the full open day.'},
{id:'m2',icon:'🏔️',name:'Mountain ATV / UTV day',day:'Monday',where:'Salida region',desc:'A longer off-road day with no schedule pressure.'}
];
const get=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};

export default function App(){
 const[tab,setTab]=React.useState('home');
 const[person,setPerson]=React.useState(localStorage.getItem('trip-person')||'Dan');
 const[ideas,setIdeas]=React.useState(()=>get('trip-ideas-v3',START));
 const[votes,setVotes]=React.useState(()=>get('trip-votes-v3',{}));
 React.useEffect(()=>localStorage.setItem('trip-person',person),[person]);
 React.useEffect(()=>localStorage.setItem('trip-ideas-v3',JSON.stringify(ideas)),[ideas]);
 React.useEffect(()=>localStorage.setItem('trip-votes-v3',JSON.stringify(votes)),[votes]);
 const add=x=>setIdeas(v=>[...v,{...x,id:'i'+Date.now(),icon:'💡',by:person}]);
 const vote=(id,val)=>setVotes(v=>({...v,[person]:{...(v[person]||{}),[id]:val}}));
 const score=id=>PEOPLE.reduce((n,p)=>n+(votes[p]?.[id]==='yes'?2:votes[p]?.[id]==='maybe'?1:0),0);
 const ranked=[...ideas].sort((a,b)=>score(b.id)-score(a.id));
 return <div className="app-shell"><header className="topbar"><div className="brand"><div className="mark">M</div><div><div className="overline">MAGSTADT · SEP 3–8</div><h1>Colorado Family Trip</h1></div></div><select className="group-btn" value={person} onChange={e=>setPerson(e.target.value)}>{PEOPLE.map(p=><option key={p}>{p}</option>)}</select></header>
 {tab==='home'&&<Home go={setTab} ranked={ranked} score={score}/>} {tab==='explore'&&<Explore ideas={ideas} add={add}/>} {tab==='vote'&&<Vote ideas={ideas} votes={votes} person={person} vote={vote} score={score} add={add}/>} {tab==='trip'&&<Trip/>}
 <nav className="bottom-nav">{[['home','⌂','Home'],['explore','⌕','Explore'],['vote','♥','Vote'],['trip','☷','Trip']].map(x=><button key={x[0]} className={tab===x[0]?'active':''} onClick={()=>setTab(x[0])}><span>{x[1]}</span><small>{x[2]}</small></button>)}</nav></div>
}

function Explore({ideas,add}){const[q,setQ]=React.useState(''),[day,setDay]=React.useState('Friday');const shown=ideas.filter(a=>a.day===day&&(!q||(`${a.name} ${a.where} ${a.desc}`).toLowerCase().includes(q.toLowerCase())));return <main className="page"><div className="page-title"><div><div className="overline">EXPLORE</div><h2>Find something to do</h2></div></div><div className="vote-person card"><input style={{border:0,outline:0,width:'65%'}} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search ideas..."/><select value={day} onChange={e=>setDay(e.target.value)}><option>Friday</option><option>Sunday</option><option>Monday</option></select></div><div className="vote-instructions">{day==='Friday'?'Friday is a full adventure day. Prioritize great experiences that still work with the Denver → Salida route.':day==='Sunday'?'Sunday centers on Salida and Buena Vista.':'Monday can use a wider radius because the full day is open.'}</div>{shown.map(a=><div className="activity card" key={a.id}><div className="activity-head"><div className="activity-icon">{a.icon}</div><div><h3>{a.name}</h3><span className="pill">{a.where}</span></div></div><p>{a.desc}</p></div>)}<QuickAdd add={add}/></main>}
function QuickAdd({add}){const[open,setOpen]=React.useState(false),[name,setName]=React.useState(''),[day,setDay]=React.useState('Friday'),[note,setNote]=React.useState('');return <div style={{marginTop:14}}><button className="btn btn-primary" onClick={()=>setOpen(!open)}>＋ Add your own recommendation</button>{open&&<form className="card" style={{padding:14,marginTop:10,display:'grid',gap:8}} onSubmit={e=>{e.preventDefault();if(!name)return;add({name,day,where:'Family suggestion',desc:note});setName('');setNote('');setOpen(false)}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Activity or place"/><select value={day} onChange={e=>setDay(e.target.value)}><option>Friday</option><option>Sunday</option><option>Monday</option></select><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional note"/><button className="gold">Add idea</button></form>}</div>}
function Vote({ideas,votes,person,vote,score,add}){return <main className="page"><div className="page-title"><div><div className="overline">FAMILY PICKS</div><h2>What sounds good?</h2></div></div>{ideas.map(a=><div className="activity card" key={a.id}><div className="activity-head"><div className="activity-icon">{a.icon}</div><div><h3>{a.name}</h3><span className="pill">{a.day}</span> <span className="cost">{a.where}</span>{a.by&&<p>Added by {a.by}</p>}</div></div><div className="vote-buttons">{[['yes','❤️ Yes'],['maybe','👍 Maybe'],['no','👎 No']].map(x=><button key={x[0]} className={votes[person]?.[a.id]===x[0]?'chosen':''} onClick={()=>vote(a.id,x[0])}>{x[1]}</button>)}</div><div className="vote-count">Group score: {score(a.id)}</div></div>)}<QuickAdd add={add}/></main>}
