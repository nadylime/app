import React from 'react';
import { useApp } from './store.jsx';
import { toICS, download } from './utils.js';

export default function Settings(){
  const { settings, setSettings } = useApp();
  const toggle = ()=> setSettings({ ...settings, reminders: !settings.reminders });
  const setFreq = (e)=> setSettings({ ...settings, frequency: e.target.value });
  const setHour = (e)=> setSettings({ ...settings, hour: Number(e.target.value) });
  const setMinute = (e)=> setSettings({ ...settings, minute: Number(e.target.value) });

  const requestNotification = async ()=>{
    if (!('Notification' in window)) return alert('Notifications not supported in this browser.');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return alert('Permission denied');
    setTimeout(()=> new Notification('Couple Check-In', { body: 'Time for a 60-second check-in 💙' }), 3000);
  };

  const downloadICS = ()=>{
    const ics = toICS('Couple Check-In', 'Gentle reminder', undefined, settings.hour, settings.minute);
    download('couple-reminder.ics', ics);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">Notifications</h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="accent-indigo-600" checked={!!settings.reminders} onChange={toggle} />
          <span className="text-sm">Enable gentle reminders (demo)</span>
        </label>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div><label className="text-sm">Frequency</label>
            <select className="w-full rounded-xl border p-2 mt-1" value={settings.frequency} onChange={setFreq}>
              <option value="daily">Daily</option>
              <option value="3days">Every 3 days</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div><label className="text-sm">Time</label>
            <div className="flex gap-2 mt-1">
              <input type="number" min="0" max="23" className="w-full rounded-xl border p-2" value={settings.hour} onChange={setHour}/>
              <input type="number" min="0" max="59" className="w-full rounded-xl border p-2" value={settings.minute} onChange={setMinute}/>
            </div>
          </div>
        </div>
        <div className="grid-2 mt-3">
          <button className="btn btn-primary" onClick={requestNotification}>Test Local Notification</button>
          <button className="btn btn-primary" onClick={downloadICS}>Download Calendar (.ics)</button>
        </div>
      </div>
      <div className="text-xs text-slate-500 text-center">Reminders in this demo use local notifications or calendar downloads.</div>
    </div>
  );
}
