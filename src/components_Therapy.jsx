import React from 'react';
import { useApp } from './store.jsx';

export default function Therapy(){
  const { entries, journal, reflections, discussions } = useApp();

  const exportReport = ()=>{
    const report = { generatedAt: new Date().toISOString(), entries, journal, reflections, discussions };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'couple-checkin-report.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Therapy Mode</h3>
        <p className="text-sm text-slate-700">Export a private report you can optionally share with a counselor.</p>
        <button className="btn btn-primary mt-3" onClick={exportReport}>Export JSON Report</button>
      </div>
      <div className="card text-sm text-slate-600">
        Tip: You decide what to share. Notes and entries stay on your device unless you export them.
      </div>
    </div>
  );
}
