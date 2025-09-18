import React from 'react';
import { useApp } from './store.jsx';

export default function Settings(){
  const { settings, setSettings } = useApp();
  const toggle = ()=> setSettings({ ...settings, reminders: !settings.reminders });
  const setFreq = (e)=> setSettings({ ...settings, frequency: e.target.value });

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Notifications</h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-indigo-600" checked={!!settings.reminders} onChange={toggle} />
          <span className="text-sm">Enable gentle reminders (demo only)</span>
        </label>
        <div className="mt-3">
          <label className="text-sm">Frequency</label>
          <select className="w-full rounded-xl border p-2 mt-1" value={settings.frequency} onChange={setFreq}>
            <option value="daily">Daily</option>
            <option value="3days">Every 3 days</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
      <div className="text-xs text-slate-500 text-center">Reminders are not sent in this demo; settings are saved locally.</div>
    </div>
  );
}
