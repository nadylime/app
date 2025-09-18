import React from 'react';
import { useApp } from './store.jsx';
import { sha256 } from './utils.js';

export default function Security(){
  const { pinHash, setPinHash } = useApp();
  const [pin, setPin] = React.useState('');
  const [check, setCheck] = React.useState('');
  const [unlocked, setUnlocked] = React.useState(!pinHash);

  const setNew = async ()=>{
    if (pin.length < 4) return alert('Use at least 4 digits/characters.');
    const h = await sha256(pin); setPinHash(h); setPin(''); setUnlocked(true);
    alert('PIN set.');
  };
  const verify = async ()=>{
    const h = await sha256(check);
    if (h === pinHash){ setUnlocked(true); alert('Unlocked'); }
    else alert('Incorrect PIN');
  };
  const clear = ()=>{ setPinHash(''); setUnlocked(true); };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">App Lock (PIN)</h3>
        {!pinHash && <div className="space-y-2">
          <input className="w-full rounded-xl border p-2" placeholder="Create PIN" value={pin} onChange={e=>setPin(e.target.value)} />
          <button className="btn btn-primary" onClick={setNew}>Set PIN</button>
        </div>}
        {pinHash && !unlocked && <div className="space-y-2">
          <input className="w-full rounded-xl border p-2" placeholder="Enter PIN" value={check} onChange={e=>setCheck(e.target.value)} />
          <button className="btn btn-primary" onClick={verify}>Unlock</button>
        </div>}
        {pinHash && unlocked && <button className="btn-ghost" onClick={clear}>Remove PIN</button>}
      </div>
      <div className="text-xs text-slate-500">PIN stored as SHA-256 hash in localStorage; this is a basic privacy layer (not enterprise-grade security).</div>
    </div>
  );
}
