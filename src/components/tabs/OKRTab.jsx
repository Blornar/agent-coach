"use client";
import { IcoTarget } from "@/components/icons";
import { OKRS, CONF } from "@/data/constants";

export default function OKRTab() {
  return (
    <div className="p-5 space-y-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-800">OKR Tracking</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Q2 2026 · Payments Platform · 2 objectives</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {Object.entries({ high: "On track", medium: "At risk", low: "Low confidence" }).map(([k, l]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-slate-500">
              <div className={`w-2 h-2 rounded-full ${CONF[k].dot}`} />{l}
            </div>
          ))}
        </div>
      </div>

      {OKRS.map((okr) => {
        const c = CONF[okr.confidence];
        return (
          <div key={okr.id} className={`rounded-xl border overflow-hidden ${c.ring}`}>
            <div className="flex items-start gap-3 px-4 py-3 bg-slate-50">
              <IcoTarget size={16} className={`flex-shrink-0 mt-0.5 ${c.badge.split(" ")[1]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{okr.objective}</p>
                <p className="text-xs text-slate-400 mt-0.5">{okr.owner}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${c.badge}`}>{c.label} confidence</span>
            </div>
            <div className="bg-white divide-y divide-slate-100">
              {okr.keyResults.map((kr) => {
                const kc = CONF[kr.confidence];
                return (
                  <div key={kr.id} className="px-4 py-3">
                    <div className="flex items-start gap-2 mb-2.5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${kc.dot}`} />
                      <p className="text-sm text-slate-700 flex-1 leading-snug">{kr.text}</p>
                      <span className={`text-xs font-medium flex-shrink-0 ml-2 ${kc.badge.split(" ")[1]}`}>{kc.label}</span>
                    </div>
                    <div className="flex items-center gap-3 pl-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${kc.bar}`} style={{ width: `${kr.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-600 w-8 text-right">{kr.progress}%</span>
                      <div className="flex gap-1">
                        {kr.epics.map((e) => (
                          <span key={e} className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">{e}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
