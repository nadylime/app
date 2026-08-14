import React from 'react';

export default function Chat({person,messages,send,remove,sending,deleting,error,refresh}){
  const [text,setText]=React.useState('');
  const [actionMessage,setActionMessage]=React.useState(null);
  const endRef=React.useRef(null);
  const holdTimer=React.useRef(null);

  React.useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[messages.length]);
  React.useEffect(()=>()=>clearTimeout(holdTimer.current),[]);

  const submit=async event=>{
    event.preventDefault();
    if(await send(text))setText('');
  };

  const startHold=message=>{
    if(message.author!==person)return;
    clearTimeout(holdTimer.current);
    holdTimer.current=setTimeout(()=>setActionMessage(message),550);
  };
  const cancelHold=()=>clearTimeout(holdTimer.current);
  const openActions=(event,message)=>{
    if(message.author!==person)return;
    event.preventDefault();
    setActionMessage(message);
  };
  const confirmDelete=async()=>{
    if(await remove(actionMessage.id))setActionMessage(null);
  };

  return <main className="page chat-page">
    <div className="page-title chat-title"><div><div className="overline">FAMILY CHAT</div><h2>Trip talk</h2></div><button className="refresh-chat" onClick={refresh} aria-label="Refresh chat">↻</button></div>
    <section className="chat-thread card" aria-live="polite">
      {!messages.length&&<div className="empty-chat"><span>💬</span><h3>Start the conversation</h3><p>“I’m so excited to see everyone!” and “No hiking!” are both acceptable opening statements.</p></div>}
      {messages.map(message=>{
        const own=message.author===person;
        return <article className={`chat-message ${own?'own':''}`} key={message.id}>
          {!own&&<div className="chat-avatar">{message.author.slice(0,1)}</div>}
          <div className="chat-message-content">
            {!own&&<span className="chat-author">{message.author}</span>}
            <div className="chat-bubble" onPointerDown={()=>startHold(message)} onPointerUp={cancelHold} onPointerLeave={cancelHold} onPointerCancel={cancelHold} onContextMenu={event=>openActions(event,message)} aria-label={own?'Your message. Hold for options.':`${message.author}'s message.`}><p>{message.text}</p></div>
          </div>
        </article>;
      })}
      <div ref={endRef}/>
    </section>
    {error&&<p className="chat-error">{error}</p>}
    <form className="chat-compose card" onSubmit={submit}>
      <textarea value={text} maxLength={500} onChange={event=>setText(event.target.value)} placeholder={`Leave a note as ${person}...`} aria-label="Message"/>
      <button className="send-chat" disabled={!text.trim()||sending}>{sending?'Sending…':'Send'}</button>
    </form>
    {actionMessage&&<div className="message-actions-backdrop" onClick={()=>!deleting&&setActionMessage(null)}><section className="message-actions card" role="dialog" aria-modal="true" aria-labelledby="message-actions-title" onClick={event=>event.stopPropagation()}><div className="overline">YOUR MESSAGE</div><h3 id="message-actions-title">Message options</h3><p>“{actionMessage.text}”</p><button className="delete-message" disabled={deleting} onClick={confirmDelete}>{deleting?'Deleting…':'Delete message'}</button><button className="cancel-message-action" disabled={deleting} onClick={()=>setActionMessage(null)}>Cancel</button></section></div>}
  </main>;
}
