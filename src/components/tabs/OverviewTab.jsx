"use client";
import { useState, Fragment } from "react";
import { SQUAD_HEALTH as SQUAD_HEALTH_SEED } from "@/data/constants";
import { heatCell } from "@/data/helpers";

export default function OverviewTab() {
  const [squadHealth, setSquadHealth] = useState(SQUAD_HEALTH_SEED);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [health, setHealth] = useState(null);
  const [healthNote, setHealthNote] = useState("");

  const handleSaveHealth = () => {
    if (!selectedSquad || health == null) return;
    setSquadHealth(prev => prev.map(s =>
      s.id === selectedSquad ? { ...s, health, healthNote } : s
    ));
    setSelectedSquad(null);
    setHealth(null);
    setHealthNote("");
  };

  const crews = {};
  squadHealth.forEach(s => {
    if (!crews[s.crew]) crews[s.crew] = [];
    crews[s.crew].push(s);
  });

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-800">Squad Health Overview</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Real-time metrics across all squads</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-x-auto mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Squad", "Flow Time", "Velocity", "Efficiency", "WIP", "Team Health"].map(h => (
                <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {Object.entries(crews).map(([crew, squads]) => (
              <Fragment key={crew}>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <td colSpan="6" className="px-4 py-2 text-xs font-semibold text-slate-600">{crew}</td>
                </tr>
                {squads.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3"><span className="font-medium text-slate-700">{s.squad}</span></td>
                    <td className={`px-4 py-3 font-medium ${heatCell('flowTime', s.flowTime)}`}>{s.flowTime}d</td>
                    <td className={`px-4 py-3 font-medium ${heatCell('velocity', s.velocity)}`}>{s.velocity}</td>
                    <td className={`px-4 py-3 font-medium ${heatCell('efficiency', s.efficiency)}`}>{s.efficiency}%</td>
                    <td className={`px-4 py-3 font-medium ${heatCell('wip', s.wip, s.wipLimit)}`}>{s.wip}/{s.wipLimit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i} className={`text-sm ${heatCell('health', s.health)}`}>{i < s.health ? '●' : '○'}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-tight">{s.healthNote}</p>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Update Team Health</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Squad</label>
            <select
              value={selectedSquad || ""}
              onChange={(e) => {
                setSelectedSquad(e.target.value);
                const s = squadHealth.find(sq => sq.id === e.target.value);
                if (s) {
                  setHealth(s.health);
                  setHealthNote(s.healthNote);
                }
              }}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
            >
              <option value="">Select a squad...</option>
              {squadHealth.map(s => (
                <option key={s.id} value={s.id}>{s.squad}</option>
              ))}
            </select>
          </div>

          {selectedSquad && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Health Score (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button
                      key={i}
                      onClick={() => setHealth(i)}
                      className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                        health === i ? 'bg-[#FFCC00] text-[#1a1a1a]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Notes</label>
                <textarea
                  value={healthNote}
                  onChange={(e) => setHealthNote(e.target.value)}
                  rows={3}
                  placeholder="Observations about team health, morale, blockers..."
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none"
                />
              </div>

              <button
                onClick={handleSaveHealth}
                className="w-full bg-[#FFCC00] text-[#1a1a1a] font-medium py-2 rounded-lg hover:bg-[#e6b800] transition-colors text-sm"
              >
                Save Health Update
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
