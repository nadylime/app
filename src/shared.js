import React from 'react';

export function useSharedTrip(defaultIdeas){
  const [ideas,setIdeas]=React.useState(defaultIdeas);
  const [votes,setVotes]=React.useState({});
  const [ready,setReady]=React.useState(false);

  React.useEffect(()=>{
    fetch('/.netlify/functions/trip-state')
      .then(r=>r.ok?r.json():null)
      .then(data=>{
        if(data?.ideas?.length)setIdeas(data.ideas);
        if(data?.votes)setVotes(data.votes);
      })
      .catch(()=>{})
      .finally(()=>setReady(true));
  },[]);

  React.useEffect(()=>{
    if(!ready)return;
    const timer=setTimeout(()=>{
      fetch('/.netlify/functions/trip-state',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({ideas,votes})
      }).catch(()=>{});
    },300);
    return()=>clearTimeout(timer);
  },[ideas,votes,ready]);

  return {ideas,setIdeas,votes,setVotes};
}
