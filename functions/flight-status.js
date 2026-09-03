import {getStore} from '@netlify/blobs';

const CACHE_KEY='colorado-2026-arrival-flights';
const CACHE_MS=30*60*1000;
const FLIGHTS=[
  {
    id:'DL3669',airline:'Delta',number:'DL 3669',iata:'DL3669',traveler:'Dan, Emily, Lyssie & Ashton',
    departure:{airport:'AUS',city:'Austin',time:'4:50 PM',timeZone:'America/Chicago',gate:'8'},
    arrival:{airport:'DEN',city:'Denver',time:'6:15 PM',timeZone:'America/Denver',gate:'A52'},
    status:'Scheduled',trackingUrl:'https://www.flightaware.com/live/flight/DAL3669'
  },
  {
    id:'F93599',airline:'Frontier',number:'F9 3599',iata:'F93599',traveler:'Alec',
    departure:{airport:'ATL',city:'Atlanta',time:'8:30 PM',timeZone:'America/New_York',terminal:'N',gate:'E4'},
    arrival:{airport:'DEN',city:'Denver',time:'10:05 PM',timeZone:'America/Denver'},
    status:'Departing on time',trackingUrl:'https://www.flightaware.com/live/flight/FFT3599'
  }
];

const store=()=>getStore({name:'magstadt-trip',consistency:'strong'});
const titleCase=value=>String(value||'').replace(/_/g,' ').replace(/\b\w/g,character=>character.toUpperCase());

const liveStatus=record=>{
  const raw=record?.flight_status;
  if(raw==='active')return {status:'In flight',statusTone:'active'};
  if(raw==='landed')return {status:'Landed',statusTone:'landed'};
  if(raw==='cancelled')return {status:'Cancelled',statusTone:'alert'};
  if(raw==='diverted'||raw==='incident')return {status:titleCase(raw),statusTone:'alert'};
  const delay=Number(record?.departure?.delay||0);
  if(delay>0)return {status:`Delayed ${delay} min`,statusTone:'alert'};
  if(raw==='scheduled')return {status:'On time',statusTone:'on-time'};
  return {status:titleCase(raw)||'Scheduled',statusTone:''};
};

const selectFlight=(records,flight)=>records.find(record=>
  String(record?.flight?.iata||'').replace(/\s/g,'')===flight.iata&&
  record?.departure?.iata===flight.departure.airport&&record?.arrival?.iata===flight.arrival.airport
);

const mergeFlight=(flight,record)=>{
  if(!record)return flight;
  return {
    ...flight,
    ...liveStatus(record),
    departure:{...flight.departure,terminal:record.departure?.terminal||flight.departure.terminal,gate:record.departure?.gate||flight.departure.gate,timeZone:record.departure?.timezone||flight.departure.timeZone,timeIso:record.departure?.actual||record.departure?.estimated||record.departure?.scheduled},
    arrival:{...flight.arrival,terminal:record.arrival?.terminal||flight.arrival.terminal,gate:record.arrival?.gate||flight.arrival.gate,timeZone:record.arrival?.timezone||flight.arrival.timeZone,timeIso:record.arrival?.actual||record.arrival?.estimated||record.arrival?.scheduled}
  };
};

const fetchFlight=async(flight,key)=>{
  const url=new URL('https://api.aviationstack.com/v1/flights');
  url.searchParams.set('access_key',key);
  url.searchParams.set('flight_date','2026-09-03');
  url.searchParams.set('flight_iata',flight.iata);
  const response=await fetch(url,{headers:{accept:'application/json'}});
  if(!response.ok)throw new Error(`Flight provider returned ${response.status}`);
  const data=await response.json();
  if(data?.error)throw new Error(data.error.message||'Flight provider error');
  return mergeFlight(flight,selectFlight(data?.data||[],flight));
};

export default async req=>{
  if(req.method!=='GET')return new Response('Method not allowed',{status:405});
  const key=process.env.AVIATIONSTACK_API_KEY;
  if(!key)return Response.json({flights:FLIGHTS,live:false,updatedAt:null},{headers:{'cache-control':'no-store'}});

  try{
    const cached=await store().get(CACHE_KEY,{type:'json'});
    if(cached?.updatedAt&&Date.now()-new Date(cached.updatedAt).getTime()<CACHE_MS)return Response.json({...cached,live:true},{headers:{'cache-control':'no-store'}});
    const flights=await Promise.all(FLIGHTS.map(flight=>fetchFlight(flight,key)));
    const result={flights,live:true,updatedAt:new Date().toISOString()};
    await store().setJSON(CACHE_KEY,result);
    return Response.json(result,{headers:{'cache-control':'no-store'}});
  }catch(error){
    console.error('Flight status refresh failed',error?.message||'unknown');
    const cached=await store().get(CACHE_KEY,{type:'json'}).catch(()=>null);
    return Response.json(cached?{...cached,live:true,stale:true}:{flights:FLIGHTS,live:false,updatedAt:null},{headers:{'cache-control':'no-store'}});
  }
};
