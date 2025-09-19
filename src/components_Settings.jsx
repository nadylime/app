import React from 'react';
import { useApp } from './store.jsx';
import { toICS, download } from './utils.js';

export default function Settings(){
  const { settings, setSettings } = useApp();
  const toggle = ()=> setSettings({ ...settings, reminders: !settings.reminders });
  const setFreq = (e)=> setSettings({ ...settings, frequency: e.target.value });
  const setHour = (e)=> setSettings({ ...settings, hour: Number(e.target.value) });
  const setMinute = (e)=> setSettings({ ...settings, minute: Number(e.target.value) });

  const downloadICS = ()=>{
    const ics = toICS('Togetherly Check-In', 'Gentle reminder', undefined, settings.hour, settings.minute);
    download('togetherly-reminder.ics', ics);
  };

  return (
    <div className="section">
      <div className="card">
        <h3 className="font-semibold mb-2">Notifications</h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-brandInk" checked={!!settings.reminders} onChange={toggle} />
          <span className="text-sm">Enable reminders (demo)</span>
        </label>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div><label className="text-sm">Frequency</label>
            <select className="w-full rounded-full glass p-2 mt-1" value={settings.frequency} onChange={setFreq}>
              <option value="daily">Daily</option>
              <option value="3days">Every 3 days</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div><label className="text-sm">Time</label>
            <div className="flex gap-2 mt-1">
              <input type="number" min="0" max="23" className="w-full rounded-full glass p-2" value={settings.hour} onChange={setHour}/>
              <input type="number" min="0" max="59" className="w-full rounded-full glass p-2" value={settings.minute} onChange={setMinute}/>
            </div>
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={downloadICS}>Download Calendar (.ics)</button>
      </div>
    </div>
  );
}
