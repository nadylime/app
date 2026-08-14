import React from 'react';
import Wedding from './Wedding.jsx';
import StayDetails from './StayDetails.jsx';

const days=[
  {id:'thu-3',d:'Thu, Sep 3',t:'Arrive Denver',s:'Flights + airport hotel',i:['4:10 PM · AUS → DEN · Delta DL3669','6:45 PM · Austin group arrives DEN','8:30 PM · ATL → DEN · Frontier','10:05 PM · Alec & Addison arrive DEN','Night · Courtyard by Marriott Denver Airport']},
  {id:'fri-4',d:'Fri, Sep 4',t:'Adventure + Salida',s:'Make the drive part of the adventure',i:['Morning · Leave Denver','Day · Adventure on the way to Salida','3:00 PM+ · Airbnb check-in','Evening · Dinner + chill time in Salida']},
  {id:'sat-5-adventure',d:'Sat, Sep 5',t:'Saturday adventures',s:'Morning activity + protected free time',i:['Morning · Group-selected nearby adventure','Late morning / early afternoon · Lunch + chill/free time','Afternoon · Shower, relax, and get ready for the wedding']},
  {id:'sat-5-wedding',d:'Sat, Sep 5',t:'Saturday Evening + Wedding',s:'Doors open at 5:00 PM',w:true},
  {id:'sun-6',d:'Sun, Sep 6',t:'Adventure or chill day',s:'Keep the day flexible',i:['11:00 AM · Airbnb checkout','Day · Group-selected adventure or intentional chill/free time','Evening · Dinner + Sunday night stay still to book']},
  {id:'mon-7',d:'Mon, Sep 7',t:'Adventure or slow day',s:'One last open day',i:['Day · Group-selected adventure or a slower free day','Afternoon · Leave room to relax and pack','Evening · Monday night stay still to book']},
  {id:'tue-8',d:'Tue, Sep 8',t:'Fly home',s:'Denver departures',i:['9:30 AM · DEN → AUS · Delta DL3876','10:43 AM · DEN → ATL · Frontier','12:43 PM · Austin group arrives AUS','3:49 PM · Alec & Addison arrive ATL']}
];

export default function Trip(){
  const [open,setOpen]=React.useState('');
  const [stay,setStay]=React.useState(null);

  return <main className="page">
    <div className="page-title"><div><div className="overline">DETAILS</div><h2>Trip itinerary</h2></div></div>
    {days.map(day=><section className="card itinerary-card" key={day.id}>
      <button className="itinerary-toggle" onClick={()=>setOpen(open===day.id?'':day.id)} aria-expanded={open===day.id}>
        <div><small>{day.d}</small><h3>{day.t}</h3><span>{day.s}</span></div><b>{open===day.id?'−':'+'}</b>
      </button>
      {open===day.id&&<div className="itinerary-details">{day.w?<WeddingDetails/>:day.i.map((item,index)=><div className="itinerary-line" key={index}>{item}</div>)}</div>}
    </section>)}

    <div className="section-head"><h3>Stays</h3></div>
    <button className="stay card stay-button" onClick={()=>setStay('hotel')}><div className="stay-icon">🏨</div><div><h3>Courtyard by Marriott Denver Airport at Gateway Park</h3><small>Thu Sep 3 → Fri Sep 4 · 4343 Airport Way, Denver</small><p>Tap for full details and map.</p></div></button>
    <button className="stay card stay-button" onClick={()=>setStay('airbnb')}><div className="stay-icon">🏡</div><div><h3>Home in Salida</h3><small>306 Shepherd Road, Unit A · Salida, CO 81201</small><p>Fri Sep 4 · 3:00 PM → Sun Sep 6 · 11:00 AM</p><p>Tap for full details and map.</p></div></button>
    <div className="stay card stay-needed"><div className="stay-icon">🛏️</div><div><h3>Sunday night stay</h3><small>Sunday, Sep 6 → Monday, Sep 7</small><p>Location and property still need to be booked.</p></div><span className="booking-status">STILL TO BOOK</span></div>
    <div className="stay card stay-needed"><div className="stay-icon">🛏️</div><div><h3>Monday night stay</h3><small>Monday, Sep 7 → Tuesday, Sep 8</small><p>Location and property still need to be booked.</p></div><span className="booking-status">STILL TO BOOK</span></div>
    {stay&&<StayDetails type={stay} close={()=>setStay(null)}/>} 
  </main>;
}

function WeddingDetails(){
  return <section className="wedding-block">
    <div className="vote-instructions"><b>Doors open at 5:00 PM.</b><br/>Everyone should be seated by 5:20 PM. The ceremony begins at 5:30 PM.</div>
    <Wedding/>
  </section>;
}
