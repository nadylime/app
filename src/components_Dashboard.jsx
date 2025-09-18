import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApp } from './store.jsx';
import { formatShort } from './utils.js';

export default function Dashboard(){
  const { entries, streak, health } = useApp();
  const data = entries.slice(-14).map(e => ({
    date: formatShort(e.date),
    you: e.you.relationship,
    partner: e.partnerB.relationship
  }));

  return (
    <div className="p-4 space-y-4">
      <div className="grid-2">
        <div className="card">
          <div className="text-slate-500 text-sm">Streak</div>
          <div className="text-3xl font-bold">{streak} <span className="text-base font-medium">days</span></div>
          <div className="text-xs text-slate-500 mt-1">Consecutive days with a check-in</div>
        </div>
        <div className="card">
          <div className="text-slate-500 text-sm">Health Score</div>
          <div className="text-3xl font-bold">{health}</div>
          <div className="text-xs text-slate-500 mt-1">Based on satisfaction, stress, communication</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Relationship Trend (14 days)</h3>
          <span className="pill">You vs Partner B</span>
        </div>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0,10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="you" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="partner" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
