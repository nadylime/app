import React from 'react';

const FALLBACK_FLIGHTS=[
  {
    id:'DL3669',airline:'Delta',number:'DL 3669',traveler:'Dan, Emily, Lyssie & Ashton',
    departure:{airport:'AUS',city:'Austin',time:'4:50 PM',gate:'8'},
    arrival:{airport:'DEN',city:'Denver',time:'6:15 PM',gate:'A52'},
    status:'Scheduled',trackingUrl:'https://www.flightaware.com/live/flight/DAL3669'
  },
  {
    id:'F93599',airline:'Frontier',number:'F9 3599',traveler:'Alec',
    departure:{airport:'ATL',city:'Atlanta',time:'8:30 PM',terminal:'N',gate:'E4'},
    arrival:{airport:'DEN',city:'Denver',time:'10:05 PM'},
    status:'Departing on time',trackingUrl:'https://www.flightaware.com/live/flight/FFT3599'
  }
];

const flightTime=(value,timeZone,fallback)=>{
  if(!value)return fallback;
  try{return new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone}).format(new Date(value))}
  catch{return fallback}
};

function FlightCard({flight}){
  const departureTime=flightTime(flight.departure?.timeIso,flight.departure?.timeZone,flight.departure?.time);
  const arrivalTime=flightTime(flight.arrival?.timeIso,flight.arrival?.timeZone,flight.arrival?.time);
  return <article className="flight-card">
    <div className="flight-card-head">
      <div><span className="flight-airline">{flight.airline}</span><h4>{flight.number}</h4></div>
      <span className={`flight-status ${flight.statusTone||''}`}>{flight.status}</span>
    </div>
    <div className="flight-route">
      <div><b>{departureTime}</b><strong>{flight.departure.airport}</strong><small>{flight.departure.city}</small></div>
      <span className="flight-route-line" aria-hidden="true">✈</span>
      <div className="flight-arrival"><b>{arrivalTime}</b><strong>{flight.arrival.airport}</strong><small>{flight.arrival.city}</small></div>
    </div>
    <div className="flight-details">
      <span>{flight.traveler}</span>
      {(flight.departure?.terminal||flight.departure?.gate)&&<span>Departs {flight.departure.terminal?`Terminal ${flight.departure.terminal}`:''}{flight.departure.terminal&&flight.departure.gate?', ':''}{flight.departure.gate?`Gate ${flight.departure.gate}`:''}</span>}
      {(flight.arrival?.terminal||flight.arrival?.gate)&&<span>Arrives {flight.arrival.terminal?`Terminal ${flight.arrival.terminal}`:''}{flight.arrival.terminal&&flight.arrival.gate?', ':''}{flight.arrival.gate?`Gate ${flight.arrival.gate}`:''}</span>}
    </div>
    <a className="flight-track-link" href={flight.trackingUrl} target="_blank" rel="noreferrer">Track flight ↗</a>
  </article>;
}

export default function FlightStatus(){
  const [flights,setFlights]=React.useState(FALLBACK_FLIGHTS);
  const [live,setLive]=React.useState(false);
  const [updatedAt,setUpdatedAt]=React.useState(null);

  const refresh=React.useCallback(async()=>{
    try{
      const response=await fetch(`/.netlify/functions/flight-status?t=${Date.now()}`,{cache:'no-store'});
      if(!response.ok)return;
      const data=await response.json();
      if(Array.isArray(data.flights)&&data.flights.length)setFlights(data.flights);
      setLive(Boolean(data.live));
      setUpdatedAt(data.updatedAt||null);
    }catch{
      // Keep the confirmed itinerary details available if live tracking is offline.
    }
  },[]);

  React.useEffect(()=>{
    refresh();
    const timer=setInterval(()=>{if(document.visibilityState==='visible')refresh()},5*60*1000);
    return()=>clearInterval(timer);
  },[refresh]);

  return <section className="flight-status-block">
    <div className="flight-status-heading"><b>Arrival flights</b><span className={live?'live':''}>{live?'Live updates':'Latest confirmed details'}</span></div>
    {flights.map(flight=><FlightCard key={flight.id} flight={flight}/>)}
    <p className="flight-update-note">{live&&updatedAt?`Updated ${new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit'}).format(new Date(updatedAt))}. Status refreshes automatically.`:'Use Track flight for the latest airline and airport changes.'}</p>
  </section>;
}
