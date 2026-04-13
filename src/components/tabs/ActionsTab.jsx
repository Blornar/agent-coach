"use client";
import { useState } from "react";
import { IcoCheck, IcoX, IcoOk } from "@/components/icons";
import { JIRA_ACTIONS, RISK_C } from "@/data/constants";

export default function ActionsTab() {
  const [actions, setActions] = useState(JIRA_ACTIONS);
  const act = (id, s) => setActions((a) => a.map((x) => x.id === id ? { ...x, status: s } : x));
  const pending = actions.filter((a) => a.status === "pending");
  const done    = actions.filter((a) => a.status !== "pending");

  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-800">Jira Action Queue</h2>
            <p className="text-xs text-neutral-400 mt-0.5">{pending.length} pending — all require your approval before execution in Jira</p>
          </div>
        </div>
      </div>

      {pending.length === 0 && (
        <div className="text-center py-12">
          <IcoOk size={36} className="mx-auto mb-3 text-emerald-400" />
          <p className="text-sm text-slate-500 font-medium">All caught up</p>
          <p className="text-xs text-slate-400 mt-1">No pending Jira actions</p>
        </div>
      )}

      <div className="space-y-3">
        {pending.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{a.type}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${RISK_C[a.risk]}`}>{a.risk} risk</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1.5">{a.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {a.issues.map((i) => <span key={i} className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{i}</span>)}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{a.reason}</p>
                </div>
              </div>
            </div>
            <div className="flex border-t border-slate-100">
              <button onClick={() => act(a.id, "approved")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
                <IcoCheck size={14} /> Approve & execute
              </button>
              <div className="w-px bg-slate-100" />
              <button onClick={() => act(a.id, "rejected")} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-50 transition-colors">
                <IcoX size={14} /> Reject
              </button>
            </div>
          </div>
        ))}

        {done.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Completed</p>
            {done.map((a) => (
              <div key={a.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm opacity-60 ${a.status === "approved" ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                <span>{a.icon}</span>
                <p className="flex-1 text-slate-600 text-xs">{a.description}</p>
                {a.status === "approved"
                  ? <span className="flex items-center gap-1 text-xs font-medium text-emerald-600"><IcoCheck size={12} /> Executed</span>
                  : <span className="flex items-center gap-1 text-xs font-medium text-slate-400"><IcoX size={12} /> Rejected</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
