import React from 'react';

export function useSharedTrip(defaultIdeas,defaultItinerary={}){
  const [ideas,setIdeas]=React.useState(defaultIdeas);
  const [votes,setVotes]=React.useState({});
  const [voteDays,setVoteDays]=React.useState({});
  const [itinerary,setItinerary]=React.useState(defaultItinerary);
  const [error,setError]=React.useState('');

  React.useEffect(()=>{
    fetch('/.netlify/functions/trip-state')
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>{
        const current=new Map(defaultIdeas.map(idea=>[idea.id,idea]));
        const merged=(data?.ideas||[]).map(idea=>current.has(idea.id)?{...idea,...current.get(idea.id)}:idea);
        defaultIdeas.forEach(idea=>{if(!merged.some(saved=>saved.id===idea.id))merged.push(idea)});
        setIdeas(merged);
        if(data?.votes)setVotes(data.votes);
        if(data?.voteDays)setVoteDays(data.voteDays);
        setItinerary({...defaultItinerary,...(data?.itinerary||{})});
        setError('');
      })
      .catch(()=>setError('Trip updates are temporarily unavailable.'));
  },[]);

  const post=async body=>{
    const response=await fetch('/.netlify/functions/trip-state',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(body)
    });
    if(!response.ok)throw new Error();
    setError('');
  };

  const addIdea=async idea=>{
    setIdeas(current=>[...current,idea]);
    try{
      await post({action:'addIdea',idea});
      return true;
    }catch{
      setIdeas(current=>current.filter(item=>item.id!==idea.id));
      setError('That idea could not be saved. Please try again.');
      return false;
    }
  };

  const setVoteChoice=async(person,activityId,choice)=>{
    const previous=votes[person]?.[activityId];
    setVotes(current=>({...current,[person]:{...(current[person]||{}),[activityId]:choice}}));
    try{
      await post({action:'setVote',person,activityId,choice});
      return true;
    }catch{
      setVotes(current=>({...current,[person]:{...(current[person]||{}),[activityId]:previous}}));
      setError('That vote could not be saved. Please try again.');
      return false;
    }
  };

  const setPreferredDay=async(person,activityId,day)=>{
    const previous=voteDays[person]?.[activityId];
    setVoteDays(current=>({...current,[person]:{...(current[person]||{}),[activityId]:day}}));
    try{
      await post({action:'setPreferredDay',person,activityId,day});
      return true;
    }catch{
      setVoteDays(current=>({...current,[person]:{...(current[person]||{}),[activityId]:previous}}));
      setError('That preferred day could not be saved. Please try again.');
      return false;
    }
  };

  const setItineraryPlan=async(person,day,plan)=>{
    const previous=itinerary[day];
    const next={...plan,day,locked:true,updatedBy:person,updatedAt:Date.now()};
    setItinerary(current=>({...current,[day]:next}));
    try{
      await post({action:'setItinerary',person,day,plan:next});
      return true;
    }catch{
      setItinerary(current=>({...current,[day]:previous}));
      setError('That itinerary change could not be saved. Please try again.');
      return false;
    }
  };

  const refresh=React.useCallback(async()=>{
    try{
      const response=await fetch('/.netlify/functions/trip-state',{cache:'no-store'});
      if(!response.ok)throw new Error();
      const data=await response.json();
      const current=new Map(defaultIdeas.map(idea=>[idea.id,idea]));
      const merged=(data?.ideas||[]).map(idea=>current.has(idea.id)?{...idea,...current.get(idea.id)}:idea);
      defaultIdeas.forEach(idea=>{if(!merged.some(saved=>saved.id===idea.id))merged.push(idea)});
      setIdeas(merged);
      setVotes(data?.votes||{});
      setVoteDays(data?.voteDays||{});
      setItinerary({...defaultItinerary,...(data?.itinerary||{})});
      setError('');
    }catch{
      setError('Trip updates are temporarily unavailable.');
    }
  },[defaultIdeas,defaultItinerary]);

  React.useEffect(()=>{
    const timer=setInterval(refresh,15000);
    return()=>clearInterval(timer);
  },[refresh]);

  return {ideas,votes,voteDays,itinerary,error,addIdea,setVoteChoice,setPreferredDay,setItineraryPlan,refresh};
}

export function useSharedChat(person,isOpen){
  const [messages,setMessages]=React.useState([]);
  const [unread,setUnread]=React.useState(0);
  const [sending,setSending]=React.useState(false);
  const [deleting,setDeleting]=React.useState(false);
  const [error,setError]=React.useState('');
  const lastReadKey=person?`trip-chat-last-read-${person}`:'';

  const markRead=React.useCallback((items)=>{
    if(!person||!items.length)return;
    const newest=items[items.length-1].createdAt;
    localStorage.setItem(lastReadKey,String(newest));
    setUnread(0);
  },[lastReadKey,person]);

  const refresh=React.useCallback(async()=>{
    if(!person)return;
    try{
      const response=await fetch('/.netlify/functions/chat',{cache:'no-store'});
      if(!response.ok)throw new Error('Chat is temporarily unavailable.');
      const data=await response.json();
      const items=Array.isArray(data.messages)?data.messages:[];
      setMessages(items);
      if(isOpen){markRead(items)}else{
        const lastRead=Number(localStorage.getItem(lastReadKey)||0);
        setUnread(items.filter(item=>item.author!==person&&item.createdAt>lastRead).length);
      }
      setError('');
    }catch{
      setError('Chat is temporarily unavailable. Please try again.');
    }
  },[isOpen,lastReadKey,markRead,person]);

  React.useEffect(()=>{
    refresh();
    const timer=setInterval(refresh,10000);
    return()=>clearInterval(timer);
  },[refresh]);

  React.useEffect(()=>{if(isOpen)markRead(messages)},[isOpen,markRead,messages]);

  const send=async text=>{
    const clean=text.trim();
    if(!clean||!person||sending)return false;
    setSending(true);
    try{
      const response=await fetch('/.netlify/functions/chat',{
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({author:person,text:clean})
      });
      if(!response.ok)throw new Error();
      const data=await response.json();
      const message=data?.message;
      const items=message?[...messages.filter(item=>item.id!==message.id),message].sort((a,b)=>a.createdAt-b.createdAt):messages;
      setMessages(items);
      markRead(items);
      setError('');
      return true;
    }catch{
      setError('Your message did not send. Please try again.');
      return false;
    }finally{
      setSending(false);
    }
  };

  const remove=async id=>{
    if(!id||!person||deleting)return false;
    setDeleting(true);
    try{
      const response=await fetch('/.netlify/functions/chat',{
        method:'DELETE',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({id,author:person})
      });
      if(!response.ok)throw new Error();
      const data=await response.json();
      const deletedId=data?.deletedId||id;
      const items=messages.filter(message=>message.id!==deletedId);
      setMessages(items);
      markRead(items);
      setError('');
      return true;
    }catch{
      setError('That message could not be deleted. Please try again.');
      return false;
    }finally{
      setDeleting(false);
    }
  };

  return {messages,unread,sending,deleting,error,send,remove,refresh};
}
