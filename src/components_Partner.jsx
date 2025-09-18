import React from 'react';
import { useApp } from './store.jsx';
import { base64Json, fromBase64Json } from './utils.js';

export default function Partner(){
  const app = useApp();
  const share = ()=>{
    const payload = { entries: app.entries, discussions: app.discussions, journal: app.journal, reflections: app.reflections };
    const hash = base64Json(payload);
    const url = location.origin + location.pathname + '#import=' + hash;
    navigator.clipboard.writeText(url).then(()=>alert('Share link copied to clipboard'));
  };
  const importFromHash = ()=>{
    const match = location.hash.match(/#import=([^&]+)/);
    if(!match) return alert('No data found in URL');
    const data = fromBase64Json(match[1]);
    if(!data) return alert('Invalid data');
    app.importPaired(data);
    alert('Partner data imported (demo).');
  };
  const clear = ()=> app.importPaired(null);
  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Partner Sync (Demo)</h3>
        <p className="text-sm text-slate-700">Create a share link that encodes your latest data into the URL hash. Your partner can open the link to import.</p>
        <div className="grid-2 mt-2">
          <button className="btn btn-primary" onClick={share}>Copy Share Link</button>
          <button className="btn btn-primary" onClick={importFromHash}>Import From URL</button>
        </div>
        <button className="btn-ghost mt-2" onClick={clear}>Clear Imported Partner Data</button>
      </div>
      {app.pairedData && <div className="card text-sm">
        <div className="font-medium mb-1">Imported Partner Data Summary</div>
        <div>Entries: {app.pairedData.entries?.length || 0}</div>
        <div>Discussions: {app.pairedData.discussions?.length || 0}</div>
        <div>Journal: {app.pairedData.journal?.length || 0}</div>
        <div>Reflections: {app.pairedData.reflections?.length || 0}</div>
      </div>}
      <div className="text-xs text-slate-500">Note: This is a local demo-only sharing method. For real sync, a backend (e.g., Supabase) would be used.</div>
    </div>
  );
}
