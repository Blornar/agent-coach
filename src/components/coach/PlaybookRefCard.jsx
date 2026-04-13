"use client";
import { useCoach } from "@/context/CoachContext";
import { IcoBook } from "@/components/icons";

const CAT_COLORS = {
  "WIP Overload": "bg-rose-50 text-rose-700 border-rose-200",
  "Slow Review Cycle": "bg-amber-50 text-amber-700 border-amber-200",
  "High Bug Load": "bg-amber-50 text-amber-700 border-amber-200",
  "Blocked Items": "bg-rose-50 text-rose-700 border-rose-200",
  "Low Velocity": "bg-sky-50 text-sky-700 border-sky-200",
  "Knowledge Silos": "bg-violet-50 text-violet-700 border-violet-200",
};

export default function PlaybookRefCard({ data }) {
  const { setTab } = useCoach();
  if (!data) return null;
  const catColor = CAT_COLORS[data.category] || "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#FFF4CC] flex items-center justify-center flex-shrink-0">
        <IcoBook size={14} className="text-[#1a1a1a]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium ${catColor}`}>{data.category}</span>
          <span className="text-xs text-emerald-600 font-medium">{data.successRate}% success rate</span>
        </div>
        <p className="text-xs font-medium text-slate-700 truncate">{data.title}</p>
      </div>
      <button onClick={() => setTab("playbook")} className="text-xs font-medium text-[#1a1a1a] bg-[#FFF4CC] border border-[#FFE066] hover:bg-[#FFE066] px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">
        View Playbook
      </button>
    </div>
  );
}
