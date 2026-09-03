import {getStore} from '@netlify/blobs';
import {getTripFirestore,isFirestoreConfigured} from './_firebase.js';

const LEGACY_KEY='magstadt-colorado-chat-2026';
const TRIP_ID='colorado-2026';
const ALLOWED=new Set(['Dan','Emily','Lyssie','Ashton','Alec','Alexis']);

const store=()=>getStore({name:'magstadt-trip',consistency:'strong'});

async function legacyChat(){
  return await store().get(LEGACY_KEY,{type:'json'})||{messages:[]};
}

async function migrateLegacyChat(db){
  const trip=db.collection('trips').doc(TRIP_ID);
  const marker=trip.collection('migrations').doc('netlify-blobs-chat-v1');
  if((await marker.get()).exists)return;
  const legacy=await legacyChat();
  const batch=db.batch();
  (legacy.messages||[]).slice(-250).forEach(message=>{
    const id=String(message?.id||'');
    const author=String(message?.author||'');
    const text=String(message?.text||'').trim().slice(0,500);
    if(!/^[A-Za-z0-9_-]{1,120}$/.test(id)||!ALLOWED.has(author)||!text)return;
    batch.set(trip.collection('messages').doc(id),{
      id,
      author,
      text,
      createdAt:Number(message.createdAt)||Date.now()
    });
  });
  batch.set(marker,{completedAt:Date.now(),source:LEGACY_KEY});
  await batch.commit();
}

async function firestoreMessages(){
  const db=getTripFirestore();
  await migrateLegacyChat(db);
  const snapshot=await db.collection('trips').doc(TRIP_ID).collection('messages').orderBy('createdAt','desc').limit(250).get();
  return snapshot.docs.map(document=>document.data()).reverse();
}

export default async req=>{
  try{
    if(req.method==='GET'){
      const messages=isFirestoreConfigured()?await firestoreMessages():(await legacyChat()).messages||[];
      return Response.json({messages,storage:isFirestoreConfigured()?'firestore':'netlify-blobs'},{headers:{'cache-control':'no-store'}});
    }

    if(req.method==='POST'){
      const body=await req.json().catch(()=>null);
      const author=String(body?.author||'');
      const text=String(body?.text||'').trim().slice(0,500);
      if(!ALLOWED.has(author)||!text)return Response.json({error:'Invalid message'},{status:400});
      const message={id:crypto.randomUUID(),author,text,createdAt:Date.now()};
      if(isFirestoreConfigured()){
        const db=getTripFirestore();
        await migrateLegacyChat(db);
        await db.collection('trips').doc(TRIP_ID).collection('messages').doc(message.id).set(message);
      }else{
        const current=await legacyChat();
        const messages=[...(current.messages||[]),message].slice(-250);
        await store().setJSON(LEGACY_KEY,{messages});
      }
      return Response.json({message});
    }

    if(req.method==='DELETE'){
      const body=await req.json().catch(()=>null);
      const author=String(body?.author||'');
      const id=String(body?.id||'');
      if(!ALLOWED.has(author)||!/^[A-Za-z0-9_-]{1,120}$/.test(id))return Response.json({error:'Invalid request'},{status:400});
      if(isFirestoreConfigured()){
        const db=getTripFirestore();
        await migrateLegacyChat(db);
        const reference=db.collection('trips').doc(TRIP_ID).collection('messages').doc(id);
        const snapshot=await reference.get();
        if(!snapshot.exists)return Response.json({error:'Message not found'},{status:404});
        if(snapshot.data().author!==author)return Response.json({error:'You can only delete your own messages'},{status:403});
        await reference.delete();
      }else{
        const current=await legacyChat();
        const target=(current.messages||[]).find(message=>message.id===id);
        if(!target)return Response.json({error:'Message not found'},{status:404});
        if(target.author!==author)return Response.json({error:'You can only delete your own messages'},{status:403});
        const messages=(current.messages||[]).filter(message=>message.id!==id);
        await store().setJSON(LEGACY_KEY,{messages});
      }
      return Response.json({deletedId:id});
    }

    return new Response('Method not allowed',{status:405});
  }catch(error){
    console.error('Chat storage failed',error?.message||'unknown');
    return Response.json({error:'Chat is temporarily unavailable.'},{status:503});
  }
};
