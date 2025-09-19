import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function simulateWearable(){
  const out=[]; for(let i=13;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i);
    out.push({ date: d.toISOString().slice(0,10), steps: 6000 + Math.round(Math.random()*6000), sleep: 6 + Math.random()*3, stress: 3 + Math.random()*5 });
  } return out;
}

export default function Integrations(){
  const data = simulateWearable().map(d=>({ date:d.date.slice(5), steps:d.steps, sleep:Math.round(d.sleep*10)/10, stress:Math.round(d.stress) }));
  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Wellness (Simulated)</h3>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="steps" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="sleep" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="stress" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-xs text-brandInk/70 mt-2">Illustrative only. Real device integrations would require account linking.</div>
      </div>
    </div>
  );
}
