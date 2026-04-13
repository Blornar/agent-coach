"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { IcoSend, IcoCheck } from "@/components/icons";
import { CHIPS, SQUAD_HEALTH, OKRS, EPICS, PLAYBOOK } from "@/data/constants";
import { uid } from "@/data/helpers";
import { respond } from "@/data/respond";
import { useCoach } from "@/context/CoachContext";
import Bubble from "./Bubble";
import Typing from "./Typing";
import WhatIfPanel from "./WhatIfPanel";
import Breadcrumb from "./Breadcrumb";

/* Build a greeting + proactive alerts for a given scope */
function buildInitialMessages(scope, alerts) {
  const msgs = [];

  /* Greeting */
  msgs.push({
    id: uid(), role: "ai", intent: "greeting",
    text: `Hi, I'm Agent Coach \u2014 your AI delivery intelligence assistant. I'm here to help you understand and improve ${scope.name}'s delivery health.

I can analyse flow metrics, OKR progress, epic forecasts, and work patterns. I can diagnose systemic issues, recommend evidence-based interventions from the playbook, compare squads, run what-if simulations, and help plan your next sprint.

What would you like to explore?`,
  });

  /* Proactive alerts */
  const scopeAlerts = alerts.filter(a => {
    if (a.read) return false;
    if (scope.type === "squad") return a.squad === scope.name;
    return true;
  }).filter(a => a.severity === "critical" || a.severity === "warning");

  if (scopeAlerts.length) {
    scopeAlerts.forEach(a => {
      msgs.push({
        id: uid(), role: "ai", intent: "proactiveAlert",
        text: `\u26A0\uFE0F Alert \u2014 ${a.squad}: ${a.message}`,
        alert: a,
      });
    });
  }

  return msgs;
}

export default function CoachTab() {
  const { scope, squadData, healthData, alerts, interventions, conversations, setConversations } = useCoach();

  /* ── Conversation persistence keyed by scope ──────── */
  const scopeKey = `${scope.type}-${scope.id}`;
  const savedMsgs = conversations.get(scopeKey);

  const [msgs, setMsgs]             = useState(() => savedMsgs || buildInitialMessages(scope, alerts));
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [input, setInput]           = useState("");
  const [busy, setBusy]             = useState(false);
  const [dynamicChips, setDynamicChips] = useState(CHIPS);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected]     = useState(new Set());
  const bottom = useRef(null);
  const prevScopeKey = useRef(scopeKey);

  /* Save conversation when msgs change */
  useEffect(() => {
    if (msgs.length) {
      setConversations(prev => {
        const next = new Map(prev);
        next.set(scopeKey, msgs);
        return next;
      });
    }
  }, [msgs, scopeKey, setConversations]);

  /* Load conversation when scope changes */
  useEffect(() => {
    if (scopeKey !== prevScopeKey.current) {
      prevScopeKey.current = scopeKey;
      const saved = conversations.get(scopeKey);
      setMsgs(saved || buildInitialMessages(scope, alerts));
      setDynamicChips(CHIPS);
      setShowWhatIf(false);
      setSelectMode(false);
      setSelected(new Set());
    }
  }, [scopeKey, conversations, scope, alerts]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const buildContext = useCallback(() => ({
    scope, squadData,
    history: msgs,
    interventions,
    allSquadHealth: SQUAD_HEALTH,
    epics: EPICS, okrs: OKRS, playbook: PLAYBOOK,
  }), [scope, squadData, msgs, interventions]);

  const send = useCallback((text) => {
    if (!text.trim() || busy) return;
    setMsgs(m => [...m, { id: uid(), role: "user", text }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      const ctx = buildContext();
      ctx.history = [...ctx.history, { role: "user", text }];
      const result = respond(text, ctx);
      const newMsgs = result.messages.map(r => ({ id: uid(), ...r }));
      setMsgs(m => [...m, ...newMsgs]);
      if (result.chips) setDynamicChips(result.chips);
      setBusy(false);
    }, 900);
  }, [busy, buildContext]);

  const handleChipClick = (c) => {
    if (c === "What-if simulator") { setShowWhatIf(true); return; }
    if (c === "Sprint planning help") { send("Help me plan the next sprint"); return; }
    send(c);
  };

  const handleSelect = (id) => {
    if (!selectMode) return;
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCopySelected = () => {
    const selectedMsgs = msgs.filter(m => selected.has(m.id));
    const text = selectedMsgs.map(m => {
      if (m.role === "user") return `> ${m.text}`;
      let parts = [];
      if (m.text) parts.push(m.text);
      if (m.rec) parts.push(`[${m.rec.priority}] ${m.rec.title}`);
      return parts.join("\n");
    }).join("\n\n");
    navigator.clipboard.writeText(text);
    setSelectMode(false);
    setSelected(new Set());
  };

  return (
    <div className="flex flex-col h-full">
      <Breadcrumb />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 bg-neutral-50/50">
        {msgs.map(m => (
          <Bubble key={m.id} msg={m} selected={selected.has(m.id)} onSelect={handleSelect} />
        ))}
        {busy && <Typing />}
        {showWhatIf && <WhatIfPanel onClose={() => setShowWhatIf(false)} />}
        <div ref={bottom} />
      </div>

      {/* Select mode toolbar */}
      {selectMode && (
        <div className="px-4 py-2 bg-[#FFF4CC] border-t border-[#FFE066] flex items-center gap-3">
          <span className="text-xs font-medium text-[#1a1a1a]">{selected.size} message{selected.size !== 1 ? "s" : ""} selected</span>
          <button onClick={handleCopySelected} disabled={!selected.size}
            className="text-xs font-medium bg-[#FFCC00] text-[#1a1a1a] px-3 py-1 rounded-lg disabled:opacity-40 hover:bg-[#e6b800] transition-colors flex items-center gap-1">
            <IcoCheck size={11} /> Copy
          </button>
          <button onClick={() => { setSelectMode(false); setSelected(new Set()); }}
            className="text-xs text-slate-500 hover:text-slate-700 ml-auto">Cancel</button>
        </div>
      )}

      {/* Dynamic chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-neutral-100">
        {dynamicChips.map(c => (
          <button key={c} onClick={() => handleChipClick(c)} disabled={busy}
            className="flex-shrink-0 text-xs text-[#1a1a1a] bg-[#FFF4CC] border border-[#FFE066] hover:bg-[#FFE066] disabled:opacity-40 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap font-medium">
            {c}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <div className="flex gap-2 items-center bg-white border border-neutral-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-[#FFCC00] focus-within:ring-2 focus-within:ring-[#FFF4CC] transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
            placeholder="Ask about flow metrics, OKRs, epics, or coaching..."
            className="flex-1 text-sm text-neutral-800 placeholder-neutral-400 bg-transparent outline-none"
          />
          <button onClick={() => setSelectMode(m => !m)} className="text-neutral-300 hover:text-neutral-500 transition-colors p-1" title="Select messages to copy">
            <IcoCheck size={14} />
          </button>
          <button onClick={() => send(input)} disabled={!input.trim() || busy}
            className="w-8 h-8 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-[#e6b800] transition-colors shadow-sm">
            <IcoSend size={13} className="text-[#1a1a1a]" />
          </button>
        </div>
      </div>
    </div>
  );
}
