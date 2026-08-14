const MODEL=process.env.ANTHROPIC_MODEL||'claude-sonnet-5';

const cleanIdea=idea=>({
  name:String(idea?.name||'').slice(0,100),
  suggestedDay:String(idea?.day||'').slice(0,20),
  area:String(idea?.where||'').slice(0,100),
  description:String(idea?.desc||'').slice(0,700)
});

const validDays=['Friday','Saturday','Sunday','Monday'];

const cleanResult=result=>({
  name:String(result?.name||'').trim().slice(0,100),
  day:validDays.find(day=>day.toLowerCase()===String(result?.day||'').toLowerCase())||'',
  area:String(result?.area||'').trim().slice(0,100),
  summary:String(result?.summary||'').trim().slice(0,500),
  whyItFits:String(result?.whyItFits||'').trim().slice(0,300)
});

const resultSchema={
  type:'object',
  properties:{
    intro:{type:'string'},
    ideas:{
      type:'array',
      items:{
        type:'object',
        properties:{
          name:{type:'string'},
          day:{type:'string'},
          area:{type:'string'},
          summary:{type:'string'},
          whyItFits:{type:'string'}
        },
        required:['name','day','area','summary','whyItFits'],
        additionalProperties:false
      }
    }
  },
  required:['intro','ideas'],
  additionalProperties:false
};

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

  const requestClaude=async maxTokens=>{
    const response=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'content-type':'application/json',
        'x-api-key':process.env.ANTHROPIC_API_KEY,
        'anthropic-version':'2023-06-01'
      },
      body:JSON.stringify({
        model:MODEL,
        max_tokens:maxTokens,
        system:'You are a concise family trip discovery assistant. Suggest 3 to 5 specific activities that answer the family question. You may suggest worthwhile options not already in the supplied ideas. Respect drive time, the Saturday evening wedding, and the need for downtime. Do not claim live availability, current pricing, or that anything is booked. Use one short introductory sentence. For every idea, use Friday, Saturday, Sunday, or Monday as the day; a short area label; two concise sentences explaining the activity; and one concise sentence explaining why it fits.',
        output_config:{format:{type:'json_schema',schema:resultSchema}},
        messages:[{role:'user',content:prompt}]
      })
    });
    return {response,data:await response.json().catch(()=>({}))};
  };

  try{
    let {response,data}=await requestClaude(1400);
    if(response.ok&&data.stop_reason==='max_tokens')({response,data}=await requestClaude(2200));
    if(!response.ok){
      console.error('Claude API error',response.status,data?.error?.type||'unknown');
      return Response.json({error:'Claude could not make a recommendation right now.'},{status:502});
    }
    if(data.stop_reason==='refusal')return Response.json({error:'Claude could not complete that search. Try asking in a different way.'},{status:422});
    if(data.stop_reason==='max_tokens')return Response.json({error:'Claude could not finish that search. Please try a more specific request.'},{status:502});
    const answer=(data.content||[]).filter(item=>item.type==='text').map(item=>item.text).join('\n').trim();
    const jsonText=answer.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
    let parsed;
    try{
      parsed=JSON.parse(jsonText);
    }catch{
      console.error('Claude returned invalid structured output');
      return Response.json({error:'Claude could not format those ideas. Please try again.'},{status:502});
    }
    const results=Array.isArray(parsed?.ideas)?parsed.ideas.map(cleanResult).filter(item=>item.name&&item.summary).slice(0,5):[];
    if(!results.length)return Response.json({error:'Claude did not find any usable ideas. Try a more specific search.'},{status:502});
    return Response.json({intro:String(parsed?.intro||'').trim().slice(0,220),ideas:results});
  }catch(error){
    console.error('Claude request failed',error?.message||'unknown');
    return Response.json({error:'Claude could not make a recommendation right now.'},{status:502});
  }
};
