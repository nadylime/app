const MODEL=process.env.ANTHROPIC_MODEL||'claude-sonnet-5';

const cleanIdea=idea=>({
  name:String(idea?.name||'').slice(0,100),
  suggestedDay:String(idea?.day||'').slice(0,20),
  area:String(idea?.where||'').slice(0,100),
  description:String(idea?.desc||'').slice(0,700)
});

export default async req=>{
  if(req.method!=='POST')return new Response('Method not allowed',{status:405});
  if(!process.env.ANTHROPIC_API_KEY)return Response.json({error:'Claude is not configured yet.'},{status:503});

  const body=await req.json().catch(()=>null);
  const question=String(body?.question||'').trim().slice(0,500);
  const day=String(body?.day||'').slice(0,20);
  if(!question)return Response.json({error:'Please ask Claude a question.'},{status:400});

  const ideas=Array.isArray(body?.ideas)?body.ideas.slice(0,30).map(cleanIdea):[];
  const votes=body?.votes&&typeof body.votes==='object'?body.votes:{};
  const voteDays=body?.voteDays&&typeof body.voteDays==='object'?body.voteDays:{};
  const prompt=`The family is planning a Colorado wedding trip based in Salida from September 3 through 8, 2026. Friday includes travel from Denver to Salida. The wedding is Saturday evening, with doors opening at 5:00 PM and everyone seated by 5:20 PM. Sunday and Monday can include adventure or intentional free time. Sunday and Monday night stays are not booked yet.

Selected Explore day: ${day}
Current activity ideas: ${JSON.stringify(ideas)}
Group votes by person: ${JSON.stringify(votes).slice(0,8000)}
Preferred activity days by person: ${JSON.stringify(voteDays).slice(0,8000)}

Family question: ${question}`;

  try{
    const response=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'content-type':'application/json',
        'x-api-key':process.env.ANTHROPIC_API_KEY,
        'anthropic-version':'2023-06-01'
      },
      body:JSON.stringify({
        model:MODEL,
        max_tokens:700,
        system:'You are a concise family trip planner. Recommend a realistic, balanced plan using the supplied ideas, votes, preferred days, travel timing, wedding timing, and need for downtime. Do not claim that anything is booked or currently available. Use short paragraphs or bullets and keep the answer under 300 words.',
        messages:[{role:'user',content:prompt}]
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok){
      console.error('Claude API error',response.status,data?.error?.type||'unknown');
      return Response.json({error:'Claude could not make a recommendation right now.'},{status:502});
    }
    const answer=(data.content||[]).filter(item=>item.type==='text').map(item=>item.text).join('\n').trim();
    return Response.json({answer});
  }catch(error){
    console.error('Claude request failed',error?.message||'unknown');
    return Response.json({error:'Claude could not make a recommendation right now.'},{status:502});
  }
};
