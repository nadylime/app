import React from 'react';

export function useSharedTrip(defaultIdeas){
  const [ideas,setIdeas]=React.useState(defaultIdeas);
  const [votes,setVotes]=React.useState({});
  const [voteDays,setVoteDays]=React.useState({});
  const [ready,setReady]=React.useState(false);

  React.useEffect(()=>{
    fetch('/.netlify/functions/trip-state')
      .then(r=>r.ok?r.json():null)
      .then(data=>{
        if(data?.ideas?.length){
          const current=new Map(defaultIdeas.map(idea=>[idea.id,idea]));
          const merged=data.ideas.map(idea=>current.has(idea.id)?{...idea,...current.get(idea.id)}:idea);
          defaultIdeas.forEach(idea=>{if(!merged.some(saved=>saved.id===idea.id))merged.push(idea)});
          setIdeas(merged);
        }
        if(data?.votes)setVotes(data.votes);
        if(data?.voteDays)setVoteDays(data.voteDays);
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
        body:JSON.stringify({ideas,votes,voteDays})
      }).catch(()=>{});
    },300);
    return()=>clearTimeout(timer);
  },[ideas,votes,voteDays,ready]);

  return {ideas,setIdeas,votes,setVotes,voteDays,setVoteDays};
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
      const items=Array.isArray(data.messages)?data.messages:[];
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
      const items=Array.isArray(data.messages)?data.messages:[];
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
