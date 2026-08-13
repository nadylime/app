import { getStore } from '@netlify/blobs';

const KEY='magstadt-colorado-2026';

export default async (req)=>{
  const store=getStore({name:'magstadt-trip',consistency:'strong'});
  if(req.method==='GET'){
    const data=await store.get(KEY,{type:'json'});
    return Response.json(data||{ideas:[],votes:{}});
  }
  if(req.method==='POST'){
    const body=await req.json();
    await store.setJSON(KEY,body);
    return Response.json(body);
  }
  return new Response('Method not allowed',{status:405});
};
