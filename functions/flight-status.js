import {getStore} from '@netlify/blobs';

const CACHE_KEY='colorado-2026-flight-status';
const CACHE_MS=40*60*1000;
const TRACKING_WINDOWS={
  outbound:[Date.parse('2026-09-03T15:30:00Z'),Date.parse('2026-09-04T07:30:00Z')],
  return:[Date.parse('2026-09-08T09:30:00Z'),Date.parse('2026-09-08T23:00:00Z')]
};
const FLIGHTS=[
  {
    id:'DL3669',journey:'outbound',date:'2026-09-03',airline:'Delta',number:'DL 3669',iata:'DL3669',traveler:'Dan, Emily, Lyssie & Ashton',
    departure:{airport:'AUS',city:'Austin',time:'4:50 PM',timeZone:'America/Chicago',gate:'8'},
    arrival:{airport:'DEN',city:'Denver',time:'6:15 PM',timeZone:'America/Denver',gate:'A52'},
    status:'Scheduled',trackingUrl:'https://www.flightaware.com/live/flight/DAL3669'
  },
  {
    id:'F93599',journey:'outbound',date:'2026-09-03',airline:'Frontier',number:'F9 3599',iata:'F93599',traveler:'Alec',
    departure:{airport:'ATL',city:'Atlanta',time:'8:30 PM',timeZone:'America/New_York',terminal:'N',gate:'E4'},
    arrival:{airport:'DEN',city:'Denver',time:'10:05 PM',timeZone:'America/Denver'},
    status:'Departing on time',trackingUrl:'https://www.flightaware.com/live/flight/FFT3599'
  },
  {
    id:'DL3876',journey:'return',date:'2026-09-08',airline:'Delta',number:'DL 3876',iata:'DL3876',traveler:'Dan, Emily, Lyssie & Ashton',
    departure:{airport:'DEN',city:'Denver',time:'9:30 AM',timeZone:'America/Denver'},
    arrival:{airport:'AUS',city:'Austin',time:'12:43 PM',timeZone:'America/Chicago'},
    status:'Scheduled',trackingUrl:'https://www.flightaware.com/live/flight/DAL3876'
  },
  {
    id:'F93600',journey:'return',date:'2026-09-08',airline:'Frontier',number:'F9 3600',iata:'F93600',traveler:'Alec',
    departure:{airport:'DEN',city:'Denver',time:'10:43 AM',timeZone:'America/Denver'},
    arrival:{airport:'ATL',city:'Atlanta',time:'3:49 PM',timeZone:'America/New_York'},
    status:'Scheduled',trackingUrl:'https://www.flightaware.com/live/flight/FFT3600'
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
  url.searchParams.set('flight_date',flight.date);
  url.searchParams.set('flight_iata',flight.iata);
  const response=await fetch(url,{headers:{accept:'application/json'}});
  if(!response.ok)throw new Error(`Flight provider returned ${response.status}`);
  const data=await response.json();
  if(data?.error)throw new Error(data.error.message||'Flight provider error');
  return mergeFlight(flight,selectFlight(data?.data||[],flight));
};

export default async req=>{
  if(req.method!=='GET')return new Response('Method not allowed',{status:405});
  const journey=new URL(req.url).searchParams.get('journey')==='return'?'return':'outbound';
  const confirmedFlights=FLIGHTS.filter(flight=>flight.journey===journey);
  const [trackingStart,trackingEnd]=TRACKING_WINDOWS[journey];
  const cacheKey=`${CACHE_KEY}-${journey}`;
  const key=process.env.AVIATIONSTACK_API_KEY;
  if(!key)return Response.json({flights:confirmedFlights,live:false,updatedAt:null},{headers:{'cache-control':'no-store'}});

  try{
    const cached=await store().get(cacheKey,{type:'json'});
    if(Date.now()<trackingStart||Date.now()>trackingEnd)return Response.json(cached?{...cached,live:true,trackingComplete:Date.now()>trackingEnd}:{flights:confirmedFlights,live:false,updatedAt:null},{headers:{'cache-control':'no-store'}});
    if(cached?.updatedAt&&Date.now()-new Date(cached.updatedAt).getTime()<CACHE_MS)return Response.json({...cached,live:true},{headers:{'cache-control':'no-store'}});
    const flights=await Promise.all(confirmedFlights.map(flight=>fetchFlight(flight,key)));
    const result={flights,live:true,updatedAt:new Date().toISOString()};
    await store().setJSON(cacheKey,result);
    return Response.json(result,{headers:{'cache-control':'no-store'}});
  }catch(error){
    console.error('Flight status refresh failed',error?.message||'unknown');
    const cached=await store().get(cacheKey,{type:'json'}).catch(()=>null);
    return Response.json(cached?{...cached,live:true,stale:true}:{flights:confirmedFlights,live:false,updatedAt:null},{headers:{'cache-control':'no-store'}});
  }
};
