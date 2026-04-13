"use client";
import { useState } from "react";
import { IcoStar, IcoCheck, IcoX, IcoOk } from "@/components/icons";
import { REC_P, SPRINT_LIST } from "@/data/constants";
import { uid } from "@/data/helpers";
import { useCoach } from "@/context/CoachContext";

export default function RecCard({ rec }) {
  const [state, setState] = useState("idle");
  const { scope, addIntervention } = useCoach();
  const p = REC_P[rec.priority] || REC_P.Medium;

  const handleAction = () => {
    setState("actioned");
    /* Feature 18: create an intervention from the recommendation */
    if (addIntervention) {
      addIntervention({
        id: `int-rec-${uid()}`,
        name: rec.title,
        targetId: scope?.id || "phoenix",
        targetName: scope?.name || "Squad Phoenix",
        targetType: scope?.type || "squad",
        startSprint: SPRINT_LIST[SPRINT_LIST.length - 1],
        metric: "flowTime",
        description: `Auto-created from coaching recommendation.\n\nEvidence: ${rec.metric}\nRoot Cause: ${rec.rootCause}\nAction: ${rec.action}\nExpected Impact: ${rec.impact}`,
      });
    }
  };

  return (
    <div className={`mt-3 rounded-xl border overflow-hidden ${p.wrap}`}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white border-opacity-50">
        <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${p.badge}`}>{rec.priority}</span>
        <IcoStar size={12} className={p.text} />
        <p className={`text-sm font-semibold ${p.text}`}>{rec.title}</p>
      </div>
      <div className="px-4 py-3 space-y-2.5 bg-white bg-opacity-60">
        {[["Evidence", rec.metric], ["Root Cause", rec.rootCause], ["Recommended Action", rec.action], ["Expected Impact", rec.impact]].map(([label, val]) => (
          <div key={label}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
            <p className="text-xs text-slate-700 leading-relaxed">{val}</p>
          </div>
        ))}
        {state === "idle" && (
          <div className="flex gap-2 pt-1">
            <button onClick={handleAction} className="flex items-center gap-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              <IcoCheck size={12} /> Mark as actioned
            </button>
            <button onClick={() => setState("dismissed")} className="flex items-center gap-1.5 text-xs text-slate-400 px-2 py-1.5 rounded-lg hover:text-slate-600 transition-colors">
              <IcoX size={12} /> Dismiss
            </button>
          </div>
        )}
        {state === "actioned"  && <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 pt-1"><IcoOk size={13} /> Actioned &mdash; logged as intervention. I'll track this metric and report back in 2 sprints.</p>}
        {state === "dismissed" && <p className="text-xs text-slate-400 pt-1">Dismissed</p>}
      </div>
    </div>
  );
}
