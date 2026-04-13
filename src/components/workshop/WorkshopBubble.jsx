"use client";
import { useState } from "react";
import { IcoBot, IcoCheck } from "@/components/icons";
import SpecCard from "./SpecCard";
import PhoneMockup from "./PhoneMockup";

function CopyButton({ msg }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const parts = [];
    if (msg.text) parts.push(msg.text);
    if (msg.specCard) {
      parts.push(`# ${msg.specCard.title}`);
      if (msg.specCard.problem) parts.push(`## Problem\n${msg.specCard.problem}`);
      if (msg.specCard.users?.length) parts.push(`## Users\n${msg.specCard.users.join("\n")}`);
      if (msg.specCard.stories?.length) parts.push(`## User Stories\n${msg.specCard.stories.join("\n")}`);
      if (msg.specCard.acceptance?.length) parts.push(`## Acceptance Criteria\n${msg.specCard.acceptance.join("\n")}`);
      if (msg.specCard.edges?.length) parts.push(`## Edge Cases\n${msg.specCard.edges.join("\n")}`);
    }
    navigator.clipboard.writeText(parts.join("\n\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 absolute -top-2 right-2 text-xs bg-white border border-slate-200 text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded-md shadow-sm transition-all"
      title="Copy">
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function WorkshopBubble({ msg, selected, onSelect }) {
  if (msg.role === "user") return (
    <div className={`flex justify-end mb-5 ${selected ? "ring-2 ring-[#FFCC00] rounded-2xl" : ""}`}
      onClick={() => onSelect?.(msg.id)}>
      <div className="max-w-md bg-[#1a1a1a] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
      </div>
    </div>
  );

  return (
    <div className={`flex gap-3 mb-5 group relative ${selected ? "ring-2 ring-[#FFCC00] rounded-2xl p-1" : ""}`}
      onClick={() => onSelect?.(msg.id)}>
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#FFCC00] flex items-center justify-center mt-0.5 shadow">
        <IcoBot size={14} className="text-[#1a1a1a]" />
      </div>
      <div className="flex-1 min-w-0">
        <CopyButton msg={msg} />
        {msg.text && (
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-200 shadow-sm">
            <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-line">{msg.text}</p>
          </div>
        )}
        {msg.specCard && <SpecCard spec={msg.specCard} />}
        {msg.phoneMockup && <PhoneMockup html={msg.phoneMockup} />}
        {msg.reviewCard && (
          <div className="mt-3 bg-amber-50 rounded-xl border border-amber-200 px-4 py-3">
            <p className="text-xs font-semibold text-amber-800 mb-2">Spec Review</p>
            {msg.reviewCard.issues.map((iss, i) => (
              <p key={i} className="text-xs text-amber-700 mb-1">{i + 1}. {iss}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
