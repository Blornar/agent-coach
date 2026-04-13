"use client";
import { STATUS, CONF } from "@/data/constants";

export default function EntityCard({ data }) {
  if (!data) return null;

  if (data.type === "epic") {
    const st = STATUS[data.status] || STATUS["on-track"];
    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">{data.id}</span>
          <span className="text-sm font-semibold text-slate-800 flex-1">{data.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.badge}`}>{st.label}</span>
        </div>
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Squad: <span className="font-medium text-slate-700">{data.squad}</span></span>
            <span>Target: <span className="font-medium text-slate-700">{data.target}</span></span>
            <span>P70: <span className="font-medium text-slate-700">{data.p70}</span></span>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">Progress</span>
              <span className="text-xs font-bold text-slate-700">{data.pct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${st.bar}`} style={{ width: `${data.pct}%` }} />
            </div>
          </div>
          {data.linkedOkr?.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-1">Linked Key Results:</p>
              {data.linkedOkr.map((kr, i) => {
                const c = CONF[kr.confidence] || CONF.medium;
                return (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                    <span className="flex-1">{kr.text}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-xs border ${c.badge}`}>{c.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* KR card */
  if (data.type === "kr") {
    const c = CONF[data.confidence] || CONF.medium;
    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-white shadow-sm p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${c.badge}`}>{c.label}</span>
          <span className="text-sm font-semibold text-slate-800">{data.text}</span>
        </div>
        <p className="text-xs text-slate-500 mb-2">Objective: {data.objective} ({data.owner})</p>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${data.progress}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1">{data.progress}% complete</p>
      </div>
    );
  }

  return null;
}
