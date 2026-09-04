import React from 'react';
import Wedding from './Wedding.jsx';
import StayDetails from './StayDetails.jsx';
import FlightStatus from './FlightStatus.jsx';

const days=[
  {id:'thu-3',d:'Thu, Sep 3',t:'Arrive Denver',s:'Flights + airport hotel',flights:'outbound',i:['Night · Courtyard by Marriott Denver Airport']},
  {id:'fri-4',planKey:'Friday',d:'Fri, Sep 4',t:'Breakfast, shopping & Salida',s:'Denver morning, then drive to Salida',i:['Breakfast in Denver','Shopping in Denver','Drive to Salida','Optional hike along the way']},
  {id:'sat-5-adventure',planKey:'Saturday',d:'Sat, Sep 5',t:'UTV riding',s:'Saturday morning',i:['Morning · UTV riding','Late morning / early afternoon · Lunch and free time','Afternoon · Shower, relax and get ready for the wedding']},
  {id:'sat-5-wedding',d:'Sat, Sep 5',t:'Saturday Evening + Wedding',s:'Doors open at 5:00 PM',w:true},
  {id:'sun-6',planKey:'Sunday',d:'Sun, Sep 6',t:'Adventure or chill day',s:'Keep the day flexible',i:['11:00 AM · Airbnb checkout','Day · Group-selected adventure or intentional chill/free time','Evening · Dinner + Sunday night stay still to book']},
  {id:'mon-7',planKey:'Monday',d:'Mon, Sep 7',t:'Adventure or slow day',s:'One last open day',i:['Day · Group-selected adventure or a slower free day','Afternoon · Leave room to relax and pack','Evening · Monday night stay still to book']},
  {id:'tue-8',d:'Tue, Sep 8',t:'Fly home',s:'Denver departures',flights:'return',i:[]}
];

export default function Trip({person,itinerary={},setItineraryPlan}){
  const [open,setOpen]=React.useState('');
  const [stay,setStay]=React.useState(null);
  const [editing,setEditing]=React.useState(null);
  const isOrganizer=person==='Dan'||person==='Emily';

  return <main className="page">
    <div className="page-title"><div><div className="overline">DETAILS</div><h2>Trip itinerary</h2></div></div>
    {days.map(day=>{
      const plan=day.planKey?itinerary[day.planKey]:null;
      return <section className={`card itinerary-card ${plan?.locked?'has-locked-plan':''}`} key={day.id}>
      <button className="itinerary-toggle" onClick={()=>setOpen(open===day.id?'':day.id)} aria-expanded={open===day.id}>
        <div><small>{day.d}</small><div className="itinerary-title-row"><h3>{plan?.title||day.t}</h3>{plan?.locked&&<em>PLAN SET</em>}</div><span>{plan?.locked?'Confirmed itinerary':day.s}</span></div><b>{open===day.id?'−':'+'}</b>
      </button>
      {open===day.id&&<div className="itinerary-details">{day.w?<WeddingDetails/>:<>{day.flights&&<FlightStatus journey={day.flights}/>} {(plan?.details||day.i).map((item,index)=><div className={`itinerary-line ${plan?.locked?'confirmed-line':''}`} key={index}>{plan?.locked&&<span aria-hidden="true">✓</span>}{item}</div>)}{isOrganizer&&day.planKey&&<button className="plan-edit-button" onClick={()=>setEditing({day:day.planKey,plan})}>{plan?.locked?'Edit confirmed plan':'Lock in this day'}</button>}</>}</div>}
    </section>})}

    <div className="section-head"><h3>Stays</h3></div>
    <button className="stay card stay-button" onClick={()=>setStay('hotel')}><div className="stay-icon">🏨</div><div><h3>Courtyard by Marriott Denver Airport at Gateway Park</h3><small>Thu Sep 3 → Fri Sep 4 · 4343 Airport Way, Denver</small><p>Tap for full details and map.</p></div></button>
    <button className="stay card stay-button" onClick={()=>setStay('airbnb')}><div className="stay-icon">🏡</div><div><h3>Home in Salida</h3><small>306 Shepherd Road, Unit A · Salida, CO 81201</small><p>Fri Sep 4 · 3:00 PM → Sun Sep 6 · 11:00 AM</p><p>Tap for full details and map.</p></div></button>
    <div className="stay card stay-needed"><div className="stay-icon">🛏️</div><div><h3>Sunday night stay</h3><small>Sunday, Sep 6 → Monday, Sep 7</small><p>Location and property still need to be booked.</p></div><span className="booking-status">STILL TO BOOK</span></div>
    <div className="stay card stay-needed"><div className="stay-icon">🛏️</div><div><h3>Monday night stay</h3><small>Monday, Sep 7 → Tuesday, Sep 8</small><p>Location and property still need to be booked.</p></div><span className="booking-status">STILL TO BOOK</span></div>
    {stay&&<StayDetails type={stay} close={()=>setStay(null)}/>} 
    {editing&&<PlanEditor day={editing.day} plan={editing.plan} close={()=>setEditing(null)} save={setItineraryPlan} person={person}/>} 
  </main>;
}

function PlanEditor({day,plan,close,save,person}){
  const [title,setTitle]=React.useState(plan?.title||'');
  const [details,setDetails]=React.useState((plan?.details||[]).join('\n'));
  const [saving,setSaving]=React.useState(false);
  const submit=async event=>{
    event.preventDefault();
    const items=details.split('\n').map(item=>item.trim()).filter(Boolean);
    if(!title.trim()||!items.length)return;
    setSaving(true);
    if(await save(person,day,{title:title.trim(),details:items}))close();
    setSaving(false);
  };
  return <div className="modal-backdrop" onClick={()=>!saving&&close()}><form className="modal-card plan-editor" onSubmit={submit} onClick={event=>event.stopPropagation()}>
    <button type="button" className="modal-close" onClick={close} aria-label="Close">×</button>
    <div className="overline">{day.toUpperCase()}</div><h2>{plan?.locked?'Edit confirmed plan':'Lock in this day'}</h2>
    <label><span>Plan name</span><input value={title} maxLength={100} onChange={event=>setTitle(event.target.value)} placeholder="What are we doing?"/></label>
    <label><span>Schedule</span><textarea value={details} maxLength={1200} onChange={event=>setDetails(event.target.value)} placeholder={'Add one item per line\nMorning · Activity\nAfternoon · Lunch'}/><small>Enter one itinerary item per line.</small></label>
    <button className="btn btn-primary" disabled={saving||!title.trim()||!details.trim()}>{saving?'Saving…':'Confirm this plan'}</button>
  </form></div>;
}

function WeddingDetails(){
  return <section className="wedding-block">
    <div className="vote-instructions"><b>Doors open at 5:00 PM.</b><br/>Everyone should be seated by 5:20 PM. The ceremony begins at 5:30 PM.</div>
    <Wedding/>
  </section>;
}
