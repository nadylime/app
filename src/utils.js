export const clamp01=(n)=>Math.max(0,Math.min(10,n));
export const todayKey=(d=new Date())=>d.toISOString().slice(0,10);
