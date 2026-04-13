"use client";
import { IcoMail, IcoClock, IcoPlay, IcoPause, IcoTrash } from "@/components/icons";
import { scheduleLabel } from "@/data/helpers";

export default function ReportCard({ report, onPreview, onToggle, onDelete }) {
  const isEmail = report.delivery.channel === "email";
  const isActive = report.status === "active";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isEmail ? "bg-sky-50" : "bg-[#FFF4CC]"}`}>
            {isEmail
              ? <IcoMail size={15} className="text-sky-600" />
              : <span className="text-amber-800 font-black text-sm">T</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <p className="text-sm font-semibold text-slate-800 flex-1 leading-snug">{report.name}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                {isActive ? "Active" : "Paused"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-1 italic">"{report.prompt.slice(0, 80)}{report.prompt.length > 80 ? "\u2026" : ""}"</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <IcoClock size={10} className="text-slate-400" />
                {scheduleLabel(report.schedule)}
              </span>
              <span className="text-slate-200">·</span>
              <span className={`flex items-center gap-1 text-xs font-medium ${isEmail ? "text-sky-600" : "text-amber-700"}`}>
                {isEmail ? <IcoMail size={10} /> : <span className="font-black text-xs">T</span>}
                {isEmail ? report.delivery.address : "Microsoft Teams"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
        <div className="flex-1 flex items-center gap-4 text-xs text-slate-400">
          {report.lastSent && (
            <span>Last sent <span className="font-medium text-slate-600">{report.lastSent}</span></span>
          )}
          {report.nextSend && (
            <span>Next <span className="font-medium text-slate-600">{report.nextSend}</span></span>
          )}
          {!report.lastSent && <span className="italic">Never sent</span>}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onPreview(report)} title="Run now & preview"
            className="flex items-center gap-1 text-xs text-amber-700 hover:bg-[#FFF4CC] px-2 py-1.5 rounded-lg transition-colors font-medium">
            <IcoPlay size={11} /> Run now
          </button>
          <button onClick={() => onToggle(report.id)} title={isActive ? "Pause" : "Resume"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            {isActive ? <IcoPause size={13} /> : <IcoPlay size={13} />}
          </button>
          <button onClick={() => onDelete(report.id)} title="Delete"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
            <IcoTrash size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
