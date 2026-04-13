"use client";
import { useState } from "react";
import { IcoX } from "@/components/icons";
import { useCoach } from "@/context/CoachContext";

export default function WhatIfPanel({ onClose }) {
  const { scope, healthData } = useCoach();
  const h = Array.isArray(healthData) ? healthData[0] : healthData;

  const currentWip = h?.wip || 9;
  const currentLimit = h?.wipLimit || 6;
  const currentFlowTime = h?.flowTime || 6.4;
  const currentEfficiency = h?.efficiency || 31;
  const currentVelocity = h?.velocity || 10;
  const name = scope?.name || "Squad Phoenix";

  const [wip, setWip] = useState(currentWip);
  const [teamDelta, setTeamDelta] = useState(0);
  const [bugReduction, setBugReduction] = useState(0);

  /* Projection models */
  const wipFactor = currentWip > 0 ? wip / currentWip : 1;
  const teamFactor = 1 + (teamDelta * 0.15); /* each engineer ~15% throughput */
  const bugFactor = 1 + (bugReduction / 100 * 0.3); /* bug reduction frees capacity */

  const projFlowTime = +(currentFlowTime * wipFactor / teamFactor).toFixed(1);
  const projEfficiency = +Math.min(85, currentEfficiency * Math.pow(1 / wipFactor, 1.2) * bugFactor).toFixed(0);
  const projVelocity = +Math.min(30, currentVelocity * teamFactor * (projEfficiency / currentEfficiency)).toFixed(0);

  const flowImprove = ((currentFlowTime - projFlowTime) / currentFlowTime * 100).toFixed(0);
  const improved = projFlowTime < currentFlowTime || projEfficiency > currentEfficiency;

  return (
    <div className="mt-4 p-4 rounded-xl border-2 border-[#FFE066] bg-[#FFF9E0]">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-neutral-800">What-if Simulator &mdash; {name}</h3>
          <p className="text-xs text-neutral-600 mt-1">Adjust levers to model predicted flow impact</p>
        </div>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <IcoX size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Lever 1: WIP */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-600">WIP in progress</label>
            <span className="text-sm font-bold text-neutral-800">{wip} items</span>
          </div>
          <input type="range" min="2" max="14" value={wip} onChange={e => setWip(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-neutral-500 mt-0.5">
            <span>2</span>
            <span className="text-emerald-600 font-medium">limit: {currentLimit}</span>
            <span>14</span>
          </div>
        </div>

        {/* Lever 2: Team size */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-600">Team size change</label>
            <span className="text-sm font-bold text-neutral-800">{teamDelta > 0 ? "+" : ""}{teamDelta} engineer{Math.abs(teamDelta) !== 1 ? "s" : ""}</span>
          </div>
          <input type="range" min="-3" max="3" value={teamDelta} onChange={e => setTeamDelta(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-neutral-500 mt-0.5">
            <span>-3</span>
            <span className="text-neutral-400 font-medium">current</span>
            <span>+3</span>
          </div>
        </div>

        {/* Lever 3: Bug reduction */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-neutral-600">Bug reduction target</label>
            <span className="text-sm font-bold text-neutral-800">{bugReduction}%</span>
          </div>
          <input type="range" min="0" max="50" step="5" value={bugReduction} onChange={e => setBugReduction(+e.target.value)} className="w-full" />
          <div className="flex justify-between text-xs text-neutral-500 mt-0.5">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Projected metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Flow Time", before: currentFlowTime + "d", after: projFlowTime + "d" },
            { label: "Efficiency", before: currentEfficiency + "%", after: projEfficiency + "%" },
            { label: "Velocity", before: currentVelocity, after: projVelocity },
          ].map(({ label, before, after }) => (
            <div key={label} className="bg-white rounded-lg p-3 text-center border border-[#FFE066]">
              <p className="text-xs text-neutral-600 font-medium mb-1">{label}</p>
              <p className="text-xs font-semibold text-neutral-700">{before}</p>
              <p className="text-xs text-neutral-400 my-1">{"\u2192"}</p>
              <p className={`text-xs font-bold ${improved ? "text-emerald-600" : wip > currentWip && teamDelta <= 0 ? "text-rose-600" : "text-neutral-600"}`}>{after}</p>
            </div>
          ))}
        </div>

        {improved && (
          <div className="bg-white rounded-lg p-3 border border-emerald-200 text-center">
            <p className="text-xs text-emerald-700">
              These changes are predicted to {flowImprove > 0 ? `cut flow time by ${flowImprove}%` : "improve metrics"} within 2{"\u2013"}3 sprints.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
