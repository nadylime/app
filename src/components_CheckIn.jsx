// src/components_CheckIn.jsx
import React from "react";
import { useApp } from "./store.jsx";

// Map numbers to friendly partner mood text (demo)
function partnerMoodFrom(entry) {
  if (!entry) return "—";
  const avg =
    (entry.partnerB.relationship + entry.partnerB.communication - entry.partnerB.stress + 10) /
    3;
  if (avg >= 8) return "Feeling delighted";
  if (avg >= 6.5) return "Feeling happy";
  if (avg >= 5) return "Feeling okay";
  if (avg >= 3.5) return "Feeling low";
  return "Needs support";
}

export default function CheckIn() {
  const { entries, addEntry, streak, health } = useApp();
  const latest = entries[entries.length - 1];

  // Form state (you can keep this minimal per the design)
  const [relationship, setRelationship] = React.useState(7);
  const [stress, setStress] = React.useState(4);
  const [communication, setCommunication] = React.useState(7);

  const handleStart = () => {
    addEntry({ relationship, stress, communication, note: "" });
    // Optionally navigate to the sliders page if you separate the flow
    alert("Check-in started! (Demo saves instantly; Partner B is simulated.)");
  };

  return (
    <div className="min-h-screen bg-[#FFF6E7] text-[#4B2E16]">
      {/* Top status bar spacing (safe area) */}
      <div className="h-3" />

      {/* App Title */}
      <div className="px-6 pb-4">
        <div className="text-center text-sm font-semibold opacity-90">Togetherly</div>
      </div>

      {/* Main peach panel with large rounded corners */}
      <div className="rounded-[32px] mx-3 pb-8 pt-4 px-4"
           style={{ background: "linear-gradient(180deg,#FFD9AE 0%, #FFC48F 100%)" }}>
        {/* Greeting */}
        <h1 className="text-3xl leading-tight font-extrabold mt-2 mb-5">
          Hi Katie, how are you feeling today?
        </h1>

        {/* Big pill CTA */}
        <button
          onClick={handleStart}
          className="w-full rounded-[28px] py-4 font-semibold text-white text-base shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
          style={{ backgroundColor: "#E58F86" }}
        >
          Start Check-In
        </button>

        {/* 3 stat cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {/* Streak */}
          <div className="bg-white/95 rounded-2xl py-4 px-3 text-center shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm opacity-80">Streak</div>
            <div className="text-3xl font-extrabold mt-1">{streak || 0}</div>
            <div className="text-xs opacity-70 mt-0.5">days</div>
          </div>

          {/* Relationship Health */}
          <div className="bg-white/95 rounded-2xl py-4 px-3 text-center shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
            <div className="text-2xl mb-1">💚</div>
            <div className="text-sm opacity-80 leading-tight">Relationship{"\n"}Health</div>
            <div className="text-3xl font-extrabold mt-1">{Math.max(0, Math.min(100, health))}%</div>
          </div>

          {/* Partner status */}
          <div className="bg-white/95 rounded-2xl py-4 px-3 text-center shadow-[0_6px_18px_rgba(0,0,0,0.06)]">
            <div className="text-2xl mb-1">😊</div>
            <div className="text-sm opacity-80 leading-tight">Partner’s{"\n"}status</div>
            <div className="text-[13px] font-semibold mt-1">
              {partnerMoodFrom(latest)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav — reuse your existing nav; this is just a visual shim if needed */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="mx-3 mb-3 rounded-[28px] bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.1)] px-6 py-3">
          <div className="grid grid-cols-4 text-xs font-medium text-[#4B2E16]/80">
            <div className="flex flex-col items-center gap-1">
              <div className="text-[18px]">✅</div>
              <div>Check-In</div>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-60">
              <div className="text-[18px]">📊</div>
              <div>Dashboard</div>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-60">
              <div className="text-[18px]">📓</div>
              <div>Journal</div>
            </div>
            <div className="flex flex-col items-center gap-1 opacity-60">
              <div className="text-[18px]">⋯</div>
              <div>More</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
