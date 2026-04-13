"use client";
import { useState } from "react";
import { IcoZap, IcoDown, IcoRight, IcoUsers } from "@/components/icons";
import { ORG, NAV } from "@/data/constants";

export default function Sidebar({ tab, setTab, squad, setSquad, onScopeChange, open, onToggle }) {
  const [crewOpen, setCrewOpen] = useState({ checkout: true, wallet: false });
  const toggleCrew = (id) => setCrewOpen((o) => ({ ...o, [id]: !o[id] }));

  const handleSquadClick = (sqId) => {
    setSquad(sqId);
    onScopeChange?.("squad", sqId);
    if (tab !== "coach") setTab("coach");
  };

  const handleCrewClick = (crewId) => {
    onScopeChange?.("crew", crewId);
    if (tab !== "coach") setTab("coach");
  };

  const handleOrgClick = () => {
    onScopeChange?.("org", "org");
    if (tab !== "coach") setTab("coach");
  };

  if (!open) {
    return (
      <div className="hidden md:flex w-14 flex-shrink-0 bg-[#1a1a1a] flex-col h-full items-center py-3 transition-all duration-200">
        <div className="w-8 h-8 rounded-xl bg-[#FFCC00] flex items-center justify-center shadow mb-4">
          <IcoZap size={15} className="text-[#1a1a1a]" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto">
          {NAV.map(({ id, Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              title={id}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${tab === id ? "bg-[#FFCC00] text-[#1a1a1a]" : "text-neutral-400 hover:text-white hover:bg-[#2d2d2d]"}`}>
              <Icon size={16} />
              {badge && (
                <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center leading-none ${tab === id ? "bg-[#1a1a1a] text-[#FFCC00]" : "bg-neutral-700 text-neutral-400"}`} style={{fontSize:9}}>{badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex w-56 flex-shrink-0 bg-[#1a1a1a] flex-col h-full transition-all duration-200">
      <div className="px-4 py-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFCC00] flex items-center justify-center shadow">
            <IcoZap size={15} className="text-[#1a1a1a]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Agent Coach</p>
            <p className="text-neutral-500 text-xs mt-0.5">AI Delivery Intelligence</p>
          </div>
        </div>
      </div>

      <div className="px-2 py-3 border-b border-[#2d2d2d] space-y-0.5">
        {NAV.map(({ id, Icon, label, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? "bg-[#FFCC00] text-[#1a1a1a]" : "text-neutral-400 hover:text-white hover:bg-[#2d2d2d]"}`}>
            <Icon size={15} />
            <span className="flex-1 text-left">{label}</span>
            {badge && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === id ? "bg-[#1a1a1a] text-[#FFCC00]" : "bg-neutral-700 text-neutral-400"}`}>{badge}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <button onClick={handleOrgClick} className="w-full px-3 mb-2 text-xs font-semibold text-neutral-600 uppercase tracking-wide text-left hover:text-neutral-300 transition-colors">
          {ORG.name}
        </button>
        {ORG.crews.map((crew) => (
          <div key={crew.id} className="mb-1">
            <div className="flex items-center">
              <button onClick={() => toggleCrew(crew.id)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
                {crewOpen[crew.id] ? <IcoDown size={11} /> : <IcoRight size={11} />}
              </button>
              <button onClick={() => handleCrewClick(crew.id)}
                className="flex items-center gap-2 px-1 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-[#2d2d2d] rounded-lg transition-colors flex-1 text-left">
                <IcoUsers size={11} />
                <span>{crew.name}</span>
              </button>
            </div>
            {crewOpen[crew.id] && (
              <div className="ml-5 mt-0.5 space-y-0.5">
                {crew.squads.map((sq) => (
                  <button key={sq.id} onClick={() => handleSquadClick(sq.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${squad === sq.id ? "bg-[#2d2d2d] text-white" : "text-neutral-500 hover:text-neutral-300 hover:bg-[#2d2d2d]"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sq.id === "phoenix" ? "bg-[#FFCC00]" : "bg-emerald-400"}`} />
                    {sq.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-[#2d2d2d]">
        <p className="text-xs text-neutral-500 font-medium">James</p>
        <p className="text-xs text-neutral-700 mt-0.5">Last sync: 2 min ago {"\u00B7"} Enterprise</p>
      </div>
    </div>
  );
}
