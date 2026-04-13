"use client";
import { IcoZap } from "@/components/icons";
import { SECTION_STYLE } from "@/data/constants";
import { scheduleLabel } from "@/data/helpers";

export default function TeamsPreview({ output, report }) {
  const now = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-black">T</span>
        </div>
        <span className="text-sm text-white font-semibold">Microsoft Teams</span>
        <span className="text-xs text-slate-500 ml-1">· #engineering-delivery</span>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0">
            <IcoZap size={13} className="text-[#1a1a1a]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">Agent Coach</span>
              <span className="text-xs text-slate-400">{now}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 italic">"{report.prompt.slice(0, 70)}..."</p>
          </div>
        </div>
        <div className="ml-10 border-l-4 border-[#FFCC00] pl-4 rounded-sm">
          <p className="text-sm font-bold text-slate-900 mb-3">{output.title}</p>
          <div className="space-y-3">
            {output.sections.map((sec) => {
              const s = SECTION_STYLE[sec.style] || SECTION_STYLE.neutral;
              return (
                <div key={sec.heading} className={`rounded-lg px-3 py-2.5 border ${s.bg} ${s.border}`}>
                  <p className={`text-xs font-bold mb-1.5 ${s.heading}`}>{sec.heading}</p>
                  <ul className="space-y-1">
                    {sec.items.map((item) => (
                      <li key={item} className="text-xs text-slate-700 leading-relaxed flex gap-1.5">
                        <span className={`${s.dot} w-1 h-1 rounded-full mt-1.5 flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <IcoZap size={10} className="text-[#FFCC00]" /> Scheduled by Agent Coach · {scheduleLabel(report.schedule)}
          </p>
        </div>
      </div>
    </div>
  );
}
