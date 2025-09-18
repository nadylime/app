import React from 'react';
import { useApp } from './store.jsx';
import jsPDF from 'jspdf';

export default function Therapy(){
  const { entries, journal, reflections, discussions } = useApp();

  const exportJSON = ()=>{
    const report = { generatedAt:new Date().toISOString(), entries, journal, reflections, discussions };
    const blob = new Blob([JSON.stringify(report, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='couple-checkin-report.json'; a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = ()=>{
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Couple Check-In — Therapy Report', 10, 16);
    doc.setFontSize(11); doc.text(`Generated: ${new Date().toLocaleString()}`, 10, 24);
    const e = entries.slice(-7);
    const avg = (arr,sel)=> Math.round(arr.reduce((s,x)=>s+sel(x),0)/Math.max(1,arr.length));
    doc.text(`Last 7 days — Relationship avg: ${avg(e,x=>x.you.relationship)}, Stress avg: ${avg(e,x=>x.you.stress)}, Communication avg: ${avg(e,x=>x.you.communication)}`, 10, 34);
    doc.text(`Discussions flagged: ${discussions.length}`, 10, 42);
    doc.text(`Journal entries: ${journal.length}`, 10, 50);
    doc.text(`Reflections: ${reflections.length}`, 10, 58);
    doc.save('couple-checkin-report.pdf');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Therapy Mode</h3>
        <p className="text-sm text-slate-700">Export a private report you can optionally share with a counselor.</p>
        <div className="grid-2 mt-2">
          <button className="btn btn-primary" onClick={exportJSON}>Export JSON</button>
          <button className="btn btn-primary" onClick={exportPDF}>Export PDF</button>
        </div>
      </div>
      <div className="card text-sm text-slate-600">
        Tip: You decide what to share. Notes and entries stay on your device unless you export them.
      </div>
    </div>
  );
}
