"use client";
import { useState } from "react";
import { IcoCheck } from "@/components/icons";

export default function SprintPlanCard({ data }) {
  const [step, setStep] = useState(0);
  const [wipTarget, setWipTarget] = useState(data?.wipLimit || 6);
  const [included, setIncluded] = useState(() => new Set((data?.carryForward || []).map(i => i.id)));
  const [goal, setGoal] = useState("");
  const [done, setDone] = useState(false);

  if (!data) return null;

  const toggle = (id) => {
    setIncluded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const summary = `Sprint Plan for ${data.squadName}:
\u2022 WIP limit: ${wipTarget} items
\u2022 Carry-forward: ${included.size} items
\u2022 Sprint goal: ${goal || "(not set)"}
\u2022 Available capacity: ${Math.max(0, wipTarget - included.size)} new items`;

  if (done) {
    return (
      <div className="mt-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <IcoCheck size={14} className="text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-700">Sprint Plan Saved</p>
        </div>
        <pre className="text-xs text-emerald-800 whitespace-pre-wrap leading-relaxed">{summary}</pre>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border-2 border-[#FFE066] bg-[#FFF9E0] p-4">
      <h3 className="font-semibold text-neutral-800 mb-1">Sprint Planning — {data.squadName}</h3>
      <p className="text-xs text-neutral-500 mb-4">Step {step + 1} of 3</p>

      {/* Step indicators */}
      <div className="flex gap-2 mb-4">
        {["WIP Limit", "Carry-forward", "Sprint Goal"].map((label, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${step === i ? "bg-[#FFCC00] text-[#1a1a1a]" : "bg-white text-slate-500 border border-slate-200"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Step 0: WIP limit */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-xs text-neutral-600">Current WIP: <span className="font-bold text-neutral-800">{data.currentWip}</span> items (limit: {data.wipLimit})</p>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-neutral-700">Target WIP limit:</label>
            <input type="range" min="2" max="12" value={wipTarget} onChange={e => setWipTarget(+e.target.value)} className="flex-1" />
            <span className="text-sm font-bold text-neutral-800 w-8 text-center">{wipTarget}</span>
          </div>
          {wipTarget < data.currentWip && (
            <p className="text-xs text-emerald-600">This would require moving {data.currentWip - wipTarget} items out of the sprint.</p>
          )}
          <button onClick={() => setStep(1)} className="w-full bg-[#FFCC00] text-[#1a1a1a] font-medium py-2 rounded-lg hover:bg-[#e6b800] transition-colors text-sm">Next: Carry-forward items</button>
        </div>
      )}

      {/* Step 1: Carry-forward */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-xs text-neutral-600">Select items to carry forward into the next sprint ({included.size}/{wipTarget} slots used):</p>
          <div className="max-h-40 overflow-y-auto space-y-1.5">
            {data.carryForward.map(item => (
              <label key={item.id} className="flex items-center gap-2 text-xs cursor-pointer bg-white rounded-lg p-2 border border-slate-100 hover:border-[#FFE066] transition-colors">
                <input type="checkbox" checked={included.has(item.id)} onChange={() => toggle(item.id)}
                  className="accent-[#FFCC00] rounded" />
                <span className="font-medium text-slate-700">{item.id}</span>
                <span className="text-slate-400">{item.age}d in progress</span>
                <span className="text-slate-400">{"\u00B7"}</span>
                <span className="text-slate-400">{["", "Dev", "Review", "Test"][item.stage]}</span>
              </label>
            ))}
          </div>
          {included.size > wipTarget && (
            <p className="text-xs text-rose-600 font-medium">Over WIP limit — deselect {included.size - wipTarget} item{included.size - wipTarget > 1 ? "s" : ""}</p>
          )}
          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="flex-1 bg-white text-slate-600 font-medium py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">Back</button>
            <button onClick={() => setStep(2)} className="flex-1 bg-[#FFCC00] text-[#1a1a1a] font-medium py-2 rounded-lg hover:bg-[#e6b800] transition-colors text-sm">Next: Sprint Goal</button>
          </div>
        </div>
      )}

      {/* Step 2: Sprint goal */}
      {step === 2 && (
        <div className="space-y-3">
          <p className="text-xs text-neutral-600">Define a single sprint goal the whole squad can articulate:</p>
          <textarea
            value={goal} onChange={e => setGoal(e.target.value)}
            rows={2} placeholder="e.g. Complete payment failure remediation to unblock KR1..."
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFF4CC] outline-none"
          />
          <div className="bg-white rounded-lg p-3 border border-[#FFE066] text-xs text-neutral-700">
            <p className="font-semibold mb-1">Sprint Summary:</p>
            <pre className="whitespace-pre-wrap leading-relaxed">{summary}</pre>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 bg-white text-slate-600 font-medium py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm">Back</button>
            <button onClick={() => setDone(true)} className="flex-1 bg-[#FFCC00] text-[#1a1a1a] font-medium py-2 rounded-lg hover:bg-[#e6b800] transition-colors text-sm flex items-center justify-center gap-1.5">
              <IcoCheck size={13} /> Looks Good
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
