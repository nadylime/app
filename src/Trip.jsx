import React from 'react';
import Wedding from './Wedding.jsx';
import StayDetails from './StayDetails.jsx';

const days=[
  {d:'Thu, Sep 3',t:'Arrive Denver',s:'Flights + airport hotel',i:['4:10 PM · AUS → DEN · Delta DL3669','6:45 PM · Austin group arrives DEN','8:30 PM · ATL → DEN · Frontier','10:05 PM · Alec & Addison arrive DEN','Night · Courtyard by Marriott Denver Airport']},
  {d:'Fri, Sep 4',t:'Adventure + Salida',s:'Make the drive part of the adventure',i:['Morning · Leave Denver','Day · Adventure on or near US-285 / Buena Vista','3:00 PM+ · Airbnb check-in','Evening · Dinner in Salida']},
  {d:'Sat, Sep 5',t:'Saturday + Wedding',s:'Open morning · wedding evening',w:true},
  {d:'Sun, Sep 6',t:'Adventure day',s:'Salida / Buena Vista',i:['11:00 AM · Airbnb checkout','Day · Group-selected adventure','Evening · Dinner / flexible plans']},
  {d:'Mon, Sep 7',t:'Full adventure day',s:'Go big',i:['Day · Group-selected big adventure','Evening · Final night + pack']},
  {d:'Tue, Sep 8',t:'Fly home',s:'Denver departures',i:['9:30 AM · DEN → AUS · Delta DL3876','10:43 AM · DEN → ATL · Frontier','12:43 PM · Austin group arrives AUS','3:49 PM · Alec & Addison arrive ATL']}
];

export default function Trip(){
  const [open,setOpen]=React.useState('');
  const [stay,setStay]=React.useState(null);

  return <main className="page">
    <div className="page-title"><div><div className="overline">DETAILS</div><h2>Trip itinerary</h2></div></div>
    {days.map(day=><section className="card itinerary-card" key={day.d}>
      <button className="itinerary-toggle" onClick={()=>setOpen(open===day.d?'':day.d)} aria-expanded={open===day.d}>
        <div><small>{day.d}</small><h3>{day.t}</h3><span>{day.s}</span></div><b>{open===day.d?'−':'+'}</b>
      </button>
      {open===day.d&&<div className="itinerary-details">{day.w?<SaturdayDetails/>:day.i.map((item,index)=><div className="itinerary-line" key={index}>{item}</div>)}</div>}
    </section>)}

    <div className="section-head"><h3>Stays</h3></div>
    <button className="stay card stay-button" onClick={()=>setStay('hotel')}><div className="stay-icon">🏨</div><div><h3>Courtyard by Marriott Denver Airport at Gateway Park</h3><small>Thu Sep 3 → Fri Sep 4 · 4343 Airport Way, Denver</small><p>Tap for full details and map.</p></div></button>
    <button className="stay card stay-button" onClick={()=>setStay('airbnb')}><div className="stay-icon">🏡</div><div><h3>Home in Salida</h3><small>306 Shepherd Road, Unit A · Salida, CO 81201</small><p>Fri Sep 4 · 3:00 PM → Sun Sep 6 · 11:00 AM</p><p>Tap for full details and map.</p></div></button>
    {stay&&<StayDetails type={stay} close={()=>setStay(null)}/>} 
  </main>;
}

function SaturdayDetails(){
  return <>
    <section className="saturday-block">
      <div className="itinerary-section-label">Saturday</div>
      <h3>Morning + early afternoon</h3>
      <p>The day is open for a nearby activity, lunch, and time at the house. Plan to be back with enough time for everyone to shower and get ready before leaving for the venue.</p>
    </section>
    <section className="saturday-block wedding-block">
      <div className="itinerary-section-label">Saturday Evening + Wedding</div>
      <div className="vote-instructions"><b>Doors open at 5:00 PM.</b><br/>Everyone should be seated by 5:20 PM. The ceremony begins at 5:30 PM.</div>
      <Wedding/>
    </section>
  </>;
}
