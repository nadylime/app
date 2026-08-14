import {getStore} from '@netlify/blobs';

const KEY='magstadt-colorado-chat-2026';
const ALLOWED=new Set(['Dan','Emily','Lyssie','Ashton','Alec','Addison']);

export default async req=>{
  const store=getStore({name:'magstadt-trip',consistency:'strong'});
  const current=await store.get(KEY,{type:'json'})||{messages:[]};

  if(req.method==='GET'){
    return Response.json({messages:current.messages||[]},{headers:{'cache-control':'no-store'}});
  }

  if(req.method==='POST'){
    const body=await req.json().catch(()=>null);
    const author=String(body?.author||'');
    const text=String(body?.text||'').trim().slice(0,500);
    if(!ALLOWED.has(author)||!text)return Response.json({error:'Invalid message'},{status:400});
    const message={id:crypto.randomUUID(),author,text,createdAt:Date.now()};
    const messages=[...(current.messages||[]),message].slice(-250);
    await store.setJSON(KEY,{messages});
    return Response.json({messages});
  }

  return new Response('Method not allowed',{status:405});
};
