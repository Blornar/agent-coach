"use client";
import { useState } from "react";
import { IcoBook, IcoDown, IcoRight, IcoCheck } from "@/components/icons";

const CAT_COLORS = {
  "WIP Overload": "bg-rose-50 text-rose-700 border-rose-200",
  "Slow Review Cycle": "bg-amber-50 text-amber-700 border-amber-200",
  "High Bug Load": "bg-amber-50 text-amber-700 border-amber-200",
  "Blocked Items": "bg-rose-50 text-rose-700 border-rose-200",
  "Low Velocity": "bg-sky-50 text-sky-700 border-sky-200",
  "Knowledge Silos": "bg-violet-50 text-violet-700 border-violet-200",
};

export default function PlaybookActionCard({ data, onUsePlay }) {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;
  const catColor = CAT_COLORS[data.category] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
            <IcoBook size={14} className="text-[#1a1a1a]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800">{data.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${catColor}`}>{data.category}</span>
              <span className="text-xs text-emerald-600 font-medium">{data.successRate}% success rate</span>
              <span className="text-xs text-slate-400">{"\u00B7"}</span>
              <span className="text-xs text-slate-400">Used {data.usedCount} times</span>
              <span className="text-xs text-slate-400">{"\u00B7"}</span>
              <span className="text-xs text-slate-400">Avg {data.avgImprovementSprints} sprint{data.avgImprovementSprints !== 1 ? "s" : ""} to impact</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mt-2">{data.description}</p>
      </div>

      {/* Expandable steps */}
      <div className="border-b border-slate-100">
        <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
          {expanded ? <IcoDown size={11} /> : <IcoRight size={11} />}
          <span>{expanded ? "Hide steps" : "View implementation steps"}</span>
        </button>
        {expanded && (
          <div className="px-4 pb-3 space-y-2">
            {data.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-xs font-bold text-[#FFCC00] bg-[#1a1a1a] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-xs text-slate-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => onUsePlay?.(data)}
          className="flex items-center gap-1.5 text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#e6b800] transition-colors shadow-sm"
        >
          <IcoCheck size={13} />
          Use this play
        </button>
        <p className="text-xs text-slate-400">Creates a tracked intervention you can monitor</p>
      </div>
    </div>
  );
}
