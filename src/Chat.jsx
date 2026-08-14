import React from 'react';

const timeLabel=value=>new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));

export default function Chat({person,messages,send,sending,error,refresh}){
  const [text,setText]=React.useState('');
  const endRef=React.useRef(null);

  React.useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[messages.length]);

  const submit=async event=>{
    event.preventDefault();
    if(await send(text))setText('');
  };

  return <main className="page chat-page">
    <div className="page-title chat-title"><div><div className="overline">FAMILY CHAT</div><h2>Trip talk</h2></div><button className="refresh-chat" onClick={refresh} aria-label="Refresh chat">↻</button></div>
    <div className="vote-instructions">Posting as <b>{person}</b>. Messages are shared with everyone and will still be here the next time you open the app.</div>
    <section className="chat-thread card" aria-live="polite">
      {!messages.length&&<div className="empty-chat"><span>💬</span><h3>Start the conversation</h3><p>“I’m so excited to see everyone!” and “No hiking!” are both acceptable opening statements.</p></div>}
      {messages.map(message=>{
        const own=message.author===person;
        return <article className={`chat-message ${own?'own':''}`} key={message.id}>
          {!own&&<div className="chat-avatar">{message.author.slice(0,1)}</div>}
          <div className="chat-bubble"><b>{own?'You':message.author}</b><p>{message.text}</p><time>{timeLabel(message.createdAt)}</time></div>
        </article>;
      })}
      <div ref={endRef}/>
    </section>
    {error&&<p className="chat-error">{error}</p>}
    <form className="chat-compose card" onSubmit={submit}>
      <textarea value={text} maxLength={500} onChange={event=>setText(event.target.value)} placeholder={`Leave a note as ${person}...`} aria-label="Message"/>
      <button className="send-chat" disabled={!text.trim()||sending}>{sending?'Sending…':'Send'}</button>
    </form>
  </main>;
}
