import {getStore} from '@netlify/blobs';
import {getTripFirestore,isFirestoreConfigured} from './_firebase.js';

const LEGACY_KEY='magstadt-colorado-2026';
const TRIP_ID='colorado-2026';
const ALLOWED_USERS=new Set(['Dan','Emily','Lyssie','Ashton','Alec','Alexis']);
const TRAVELERS=new Set(['Dan','Emily','Lyssie','Ashton','Alec']);
const VALID_DAYS=new Set(['Friday','Saturday','Sunday','Monday']);
const VALID_CHOICES=new Set(['yes','maybe','no']);

const cleanId=value=>{
  const id=String(value||'');
  return /^[A-Za-z0-9_-]{1,120}$/.test(id)?id:'';
};

const cleanIdea=value=>{
  const id=cleanId(value?.id);
  const name=String(value?.name||'').trim().slice(0,100);
  const day=VALID_DAYS.has(value?.day)?value.day:'Friday';
  const by=ALLOWED_USERS.has(value?.by)?value.by:'';
  if(!id||!name||!by)return null;
  return {
    id,
    name,
    day,
    where:String(value?.where||'').trim().slice(0,100),
    desc:String(value?.desc||'').trim().slice(0,1000),
    icon:String(value?.icon||'').slice(0,12),
    by,
    createdAt:Number(value?.createdAt)||Date.now()
  };
};

const store=()=>getStore({name:'magstadt-trip',consistency:'strong'});

async function legacyState(){
  return await store().get(LEGACY_KEY,{type:'json'})||{ideas:[],votes:{},voteDays:{}};
}

async function updateLegacy(action){
  const current=await legacyState();
  if(action.type==='addIdea')current.ideas=[...(current.ideas||[]),action.idea];
  if(action.type==='setVote'){
    current.votes={...(current.votes||{}),[action.person]:{...(current.votes?.[action.person]||{}),[action.activityId]:action.choice}};
  }
  if(action.type==='setPreferredDay'){
    current.voteDays={...(current.voteDays||{}),[action.person]:{...(current.voteDays?.[action.person]||{}),[action.activityId]:action.day}};
  }
  await store().setJSON(LEGACY_KEY,current);
  return current;
}

async function migrateLegacyState(db){
  const trip=db.collection('trips').doc(TRIP_ID);
  const marker=trip.collection('migrations').doc('netlify-blobs-state-v1');
  if((await marker.get()).exists)return;

  const legacy=await legacyState();
  const batch=db.batch();
  (legacy.ideas||[]).forEach((idea,index)=>{
    const id=cleanId(idea.id);
    if(!id)return;
    batch.set(trip.collection('ideas').doc(id),{
      id,
      name:String(idea.name||'').trim().slice(0,100),
      day:VALID_DAYS.has(idea.day)?idea.day:'Friday',
      where:String(idea.where||'').trim().slice(0,100),
      desc:String(idea.desc||'').trim().slice(0,1000),
      icon:String(idea.icon||'').slice(0,12),
      by:ALLOWED_USERS.has(idea.by)?idea.by:'',
      sortOrder:index,
      createdAt:Number(idea.createdAt)||0
    },{merge:true});
  });

  for(const [person,selections] of Object.entries(legacy.votes||{})){
    if(!TRAVELERS.has(person)||!selections||typeof selections!=='object')continue;
    for(const [activityId,choice] of Object.entries(selections)){
      const id=cleanId(activityId);
      if(!id||!VALID_CHOICES.has(choice))continue;
      batch.set(trip.collection('votes').doc(`${person}__${id}`),{person,activityId:id,choice,updatedAt:Date.now()},{merge:true});
    }
  }

  for(const [person,selections] of Object.entries(legacy.voteDays||{})){
    if(!TRAVELERS.has(person)||!selections||typeof selections!=='object')continue;
    for(const [activityId,day] of Object.entries(selections)){
      const id=cleanId(activityId);
      if(!id||!VALID_DAYS.has(day))continue;
      batch.set(trip.collection('votes').doc(`${person}__${id}`),{person,activityId:id,preferredDay:day,updatedAt:Date.now()},{merge:true});
    }
  }

  batch.set(marker,{completedAt:Date.now(),source:LEGACY_KEY});
  await batch.commit();
}

async function firestoreState(){
  const db=getTripFirestore();
  await migrateLegacyState(db);
  const trip=db.collection('trips').doc(TRIP_ID);
  const [ideasSnapshot,votesSnapshot]=await Promise.all([
    trip.collection('ideas').get(),
    trip.collection('votes').get()
  ]);
  const ideas=ideasSnapshot.docs.map(document=>document.data()).sort((a,b)=>(a.sortOrder??9999)-(b.sortOrder??9999)||(a.createdAt||0)-(b.createdAt||0));
  const votes={};
  const voteDays={};
  votesSnapshot.docs.forEach(document=>{
    const item=document.data();
    if(!TRAVELERS.has(item.person)||!cleanId(item.activityId))return;
    if(VALID_CHOICES.has(item.choice))votes[item.person]={...(votes[item.person]||{}),[item.activityId]:item.choice};
    if(VALID_DAYS.has(item.preferredDay))voteDays[item.person]={...(voteDays[item.person]||{}),[item.activityId]:item.preferredDay};
  });
  return {ideas,votes,voteDays,storage:'firestore'};
}

async function writeFirestore(action){
  const db=getTripFirestore();
  await migrateLegacyState(db);
  const trip=db.collection('trips').doc(TRIP_ID);
  if(action.type==='addIdea'){
    await trip.collection('ideas').doc(action.idea.id).set({...action.idea,sortOrder:9999},{merge:false});
  }
  if(action.type==='setVote'){
    await trip.collection('votes').doc(`${action.person}__${action.activityId}`).set({
      person:action.person,
      activityId:action.activityId,
      choice:action.choice,
      updatedAt:Date.now()
    },{merge:true});
  }
  if(action.type==='setPreferredDay'){
    await trip.collection('votes').doc(`${action.person}__${action.activityId}`).set({
      person:action.person,
      activityId:action.activityId,
      preferredDay:action.day,
      updatedAt:Date.now()
    },{merge:true});
  }
}

const parseAction=async req=>{
  const body=await req.json().catch(()=>null);
  const type=String(body?.action||'');
  if(type==='addIdea'){
    const idea=cleanIdea(body?.idea);
    return idea?{type,idea}:null;
  }
  const person=String(body?.person||'');
  const activityId=cleanId(body?.activityId);
  if(!TRAVELERS.has(person)||!activityId)return null;
  if(type==='setVote'&&VALID_CHOICES.has(body?.choice))return {type,person,activityId,choice:body.choice};
  if(type==='setPreferredDay'&&VALID_DAYS.has(body?.day))return {type,person,activityId,day:body.day};
  return null;
};

export default async req=>{
  try{
    if(req.method==='GET'){
      const data=isFirestoreConfigured()?await firestoreState():await legacyState();
      return Response.json(data,{headers:{'cache-control':'no-store'}});
    }

    if(req.method==='POST'){
      const action=await parseAction(req);
      if(!action)return Response.json({error:'Invalid trip update.'},{status:400});
      if(isFirestoreConfigured())await writeFirestore(action);
      else await updateLegacy(action);
      return Response.json({ok:true,storage:isFirestoreConfigured()?'firestore':'netlify-blobs'});
    }

    return new Response('Method not allowed',{status:405});
  }catch(error){
    console.error('Trip storage failed',error?.message||'unknown');
    return Response.json({error:'Trip information is temporarily unavailable.'},{status:503});
  }
};
