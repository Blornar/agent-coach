"use client";
import { useState } from "react";
import { IcoPlus, IcoClock } from "@/components/icons";
import { SCHEDULED_REPORTS_SEED } from "@/data/constants";
import ReportCard from "@/components/reports/ReportCard";
import ReportPreviewPanel from "@/components/reports/ReportPreviewPanel";
import CreateReportForm from "@/components/reports/CreateReportForm";

export default function ReportsTab() {
  const [view,     setView]    = useState("list");
  const [reports,  setReports] = useState(SCHEDULED_REPORTS_SEED);
  const [preview,  setPreview] = useState(null);

  const handleSave = (r) => {
    setReports(prev => [...prev, r]);
    setView("list");
  };
  const handleToggle = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "active" ? "paused" : "active" } : r));
  };
  const handleDelete = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };
  const handlePreview = (report) => {
    setPreview(report);
    setView("preview");
  };

  if (view === "preview" && preview) {
    return (
      <ReportPreviewPanel
        report={preview}
        onBack={() => { setPreview(null); setView("list"); }}
      />
    );
  }
  if (view === "create") {
    return <CreateReportForm onSave={handleSave} onCancel={() => setView("list")} />;
  }

  const active = reports.filter(r => r.status === "active").length;
  return (
    <div className="p-5 overflow-y-auto h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-800">Scheduled Reports</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {reports.length} report{reports.length !== 1 ? "s" : ""}
            {active > 0 && <span className="text-emerald-600 font-medium"> · {active} active</span>}
            {" · "}delivered via email or Microsoft Teams
          </p>
        </div>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-1.5 text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-3.5 py-2 rounded-lg hover:bg-[#e6b800] transition-colors shadow-sm flex-shrink-0"
        >
          <IcoPlus size={13} /> New Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4CC] flex items-center justify-center mx-auto mb-3">
            <IcoClock size={22} className="text-[#FFCC00]" />
          </div>
          <p className="text-sm font-medium text-slate-500">No scheduled reports yet</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Schedule a recurring AI coaching report and receive it in your inbox or Teams channel automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <ReportCard
              key={r.id}
              report={r}
              onPreview={handlePreview}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
