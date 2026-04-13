"use client";
import { IcoWarn, IcoBell } from "@/components/icons";

const SEV = {
  critical: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", dot: "bg-rose-500", Icon: IcoWarn },
  warning:  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-400", Icon: IcoWarn },
  info:     { bg: "bg-sky-50",   border: "border-sky-200",   text: "text-sky-700",   dot: "bg-sky-400",   Icon: IcoBell },
};

export default function AlertCard({ data }) {
  if (!data) return null;
  const s = SEV[data.severity] || SEV.info;
  return (
    <div className={`mt-2 rounded-xl border overflow-hidden ${s.bg} ${s.border}`}>
      <div className="flex items-start gap-2.5 px-4 py-3">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${s.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-semibold uppercase ${s.text}`}>{data.severity}</span>
            <span className="text-xs text-slate-400">{data.squad}</span>
            <span className="text-xs text-slate-300">{"\u00B7"}</span>
            <span className="text-xs text-slate-400">{data.metric}</span>
          </div>
          <p className={`text-xs leading-relaxed ${s.text}`}>{data.message}</p>
          {data.time && <p className="text-xs text-slate-400 mt-1">{data.time}</p>}
        </div>
      </div>
    </div>
  );
}
