"use client";
import { useState } from "react";
import { IcoCheck, IcoDown, IcoRight } from "@/components/icons";

const SECTION_META = {
  problem:    { label: "Problem Statement", icon: "\u{1F3AF}", emptyHint: "Not defined yet" },
  users:      { label: "Target Users",      icon: "\u{1F465}", emptyHint: "No users specified" },
  stories:    { label: "User Stories",       icon: "\u{1F4DD}", emptyHint: "No stories yet" },
  acceptance: { label: "Acceptance Criteria", icon: "\u2705",   emptyHint: "No criteria defined" },
  edges:      { label: "Edge Cases",         icon: "\u26A0\uFE0F",    emptyHint: "None identified" },
};

function ProgressDots({ spec }) {
  const sections = ["problem", "users", "stories", "acceptance", "edges"];
  const filled = sections.filter(s => {
    if (s === "problem") return !!spec.problem;
    return spec[s]?.length > 0;
  });
  return (
    <div className="flex items-center gap-1.5">
      {sections.map(s => {
        const done = s === "problem" ? !!spec.problem : spec[s]?.length > 0;
        return (
          <div key={s} className={`w-2 h-2 rounded-full transition-colors ${done ? "bg-[#FFCC00]" : "bg-neutral-200"}`}
            title={SECTION_META[s].label} />
        );
      })}
      <span className="text-xs text-neutral-400 ml-2">{filled.length}/5</span>
    </div>
  );
}

function SectionBlock({ sectionKey, spec }) {
  const [open, setOpen] = useState(true);
  const meta = SECTION_META[sectionKey];
  const data = spec[sectionKey];
  const isEmpty = sectionKey === "problem" ? !data : !data?.length;

  return (
    <div className="border-t border-neutral-100 first:border-t-0">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-neutral-50 transition-colors">
        <span className="text-sm">{meta.icon}</span>
        <span className="text-xs font-semibold text-neutral-700 flex-1">{meta.label}</span>
        {!isEmpty && <IcoCheck size={12} className="text-emerald-500" />}
        {open ? <IcoDown size={10} className="text-neutral-400" /> : <IcoRight size={10} className="text-neutral-400" />}
      </button>
      {open && (
        <div className="px-3 pb-3">
          {isEmpty ? (
            <p className="text-xs text-neutral-400 italic">{meta.emptyHint}</p>
          ) : sectionKey === "problem" ? (
            <p className="text-xs text-neutral-600 leading-relaxed">{data}</p>
          ) : (
            <ul className="space-y-1.5">
              {data.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-xs text-neutral-400 mt-0.5 flex-shrink-0 w-4 text-right">{i + 1}.</span>
                  <span className="text-xs text-neutral-600 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function SpecCard({ spec }) {
  if (!spec) return null;

  return (
    <div className="mt-3 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[#FFFDF5] border-b border-neutral-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-neutral-800">{spec.title || "Untitled Feature"}</h3>
          <span className="text-xs bg-[#FFF4CC] text-[#92400E] px-2 py-0.5 rounded-full font-medium">Draft</span>
        </div>
        <ProgressDots spec={spec} />
      </div>

      {/* Sections */}
      <div>
        <SectionBlock sectionKey="problem" spec={spec} />
        <SectionBlock sectionKey="users" spec={spec} />
        <SectionBlock sectionKey="stories" spec={spec} />
        <SectionBlock sectionKey="acceptance" spec={spec} />
        <SectionBlock sectionKey="edges" spec={spec} />
      </div>
    </div>
  );
}
