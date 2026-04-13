"use client";
import { useState } from "react";
import { IcoMail, IcoClock, IcoOk, IcoPlay } from "@/components/icons";
import { generateReportOutput, scheduleLabel } from "@/data/helpers";
import EmailPreview from "./EmailPreview";
import TeamsPreview from "./TeamsPreview";

export default function ReportPreviewPanel({ report, onBack }) {
  const [sent, setSent] = useState(false);
  const output = generateReportOutput(report.prompt);
  const isEmail = report.delivery.channel === "email";

  return (
    <div className="p-5 overflow-y-auto h-full">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-4 transition-colors font-medium">
        ← Back
      </button>

      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-slate-800">{report.name}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${isEmail ? "bg-sky-50 text-sky-700 border border-sky-200" : "bg-[#FFF4CC] text-amber-800 border border-[#FFE066]"}`}>
              {isEmail ? <IcoMail size={10} /> : <span className="font-black text-xs">T</span>}
              {isEmail ? `Email · ${report.delivery.address}` : `Microsoft Teams`}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <IcoClock size={10} /> {scheduleLabel(report.schedule)}
            </span>
          </div>
        </div>
        {sent ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex-shrink-0">
            <IcoOk size={13} /> Sent successfully
          </div>
        ) : (
          <button
            onClick={() => setSent(true)}
            className="flex items-center gap-1.5 text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-3.5 py-2 rounded-lg hover:bg-[#e6b800] transition-colors shadow-sm flex-shrink-0"
          >
            <IcoPlay size={12} /> Send now
          </button>
        )}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-4 text-xs text-slate-500">
        <span className="font-semibold text-slate-600 uppercase tracking-wide text-xs">Prompt: </span>
        {report.prompt}
      </div>

      {isEmail
        ? <EmailPreview output={output} report={report} />
        : <TeamsPreview output={output} report={report} />
      }
    </div>
  );
}
