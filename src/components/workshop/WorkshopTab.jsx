"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { IcoSend, IcoCheck, IcoRight, IcoX, IcoPlay, IcoPlus, IcoPencil } from "@/components/icons";
import { uid } from "@/data/helpers";
import { workshopRespond, WORKSHOP_DEMO_SCRIPT } from "@/data/workshopRespond";
import WorkshopBubble from "./WorkshopBubble";
import Typing from "@/components/coach/Typing";

const WORKSHOP_CHIPS = ["Describe a feature idea", "Show me a demo", "Review my spec"];

export default function WorkshopTab() {
  const [msgs, setMsgs] = useState([]);
  const [spec, setSpec] = useState(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [dynamicChips, setDynamicChips] = useState(WORKSHOP_CHIPS);

  /* ── Demo mode ──────────────────────────────────────── */
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const bottom = useRef(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  /* ── Demo logic ─────────────────────────────────────── */
  const launchDemo = useCallback(() => {
    setMsgs([]);
    setSpec(null);
    setDemoMode(true);
    setDemoStep(0);
    setDynamicChips([]);
    setBusy(true);
    setTimeout(() => {
      const turn = WORKSHOP_DEMO_SCRIPT[0];
      if (!turn) return;
      const userMsg = { id: uid(), role: "user", text: turn.user };
      setMsgs([userMsg]);
      setTimeout(() => {
        const agentMsgs = buildDemoAgentMessages(turn.agent);
        setMsgs(m => [...m, ...agentMsgs]);
        if (turn.agent.specCard) setSpec(turn.agent.specCard);
        if (turn.agent.chips) setDynamicChips(turn.agent.chips);
        setDemoStep(1);
        setBusy(false);
      }, 1200);
    }, 400);
  }, []);

  const handleDemoNext = useCallback(() => {
    if (!demoMode || demoStep >= WORKSHOP_DEMO_SCRIPT.length) return;
    const turn = WORKSHOP_DEMO_SCRIPT[demoStep];
    if (!turn) { setDemoMode(false); return; }
    setBusy(true);
    const userMsg = { id: uid(), role: "user", text: turn.user };
    setMsgs(m => [...m, userMsg]);
    setTimeout(() => {
      const agentMsgs = buildDemoAgentMessages(turn.agent);
      setMsgs(m => [...m, ...agentMsgs]);
      if (turn.agent.specCard) setSpec(turn.agent.specCard);
      if (turn.agent.chips) setDynamicChips(turn.agent.chips);
      setDemoStep(s => s + 1);
      setBusy(false);
    }, 1200);
  }, [demoMode, demoStep]);

  const handleExitDemo = useCallback(() => {
    setDemoMode(false);
    setDemoStep(0);
    setDynamicChips(WORKSHOP_CHIPS);
  }, []);

  /* ── Normal send ────────────────────────────────────── */
  const send = useCallback((text) => {
    if (!text.trim() || busy) return;
    setMsgs(m => [...m, { id: uid(), role: "user", text }]);
    setInput("");
    setBusy(true);

    setTimeout(() => {
      const ctx = { spec, history: msgs };
      const result = workshopRespond(text, ctx);
      const newMsgs = result.messages.map(r => ({ id: uid(), ...r }));
      setMsgs(m => [...m, ...newMsgs]);
      if (result.spec !== undefined) setSpec(result.spec);
      if (result.chips) setDynamicChips(result.chips);
      setBusy(false);
    }, 900);
  }, [busy, spec, msgs]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (demoMode && !input.trim()) {
        handleDemoNext();
      } else {
        send(input);
      }
    }
  };

  const handleChipClick = (c) => {
    if (demoMode) { handleDemoNext(); return; }
    if (c === "Show me a demo") { launchDemo(); return; }
    send(c);
  };

  const handleNewWorkshop = () => {
    setMsgs([]);
    setSpec(null);
    setDynamicChips(WORKSHOP_CHIPS);
    setDemoMode(false);
    setDemoStep(0);
  };

  const demoFinished = demoMode && demoStep >= WORKSHOP_DEMO_SCRIPT.length;
  const showEmptyState = msgs.length === 0 && !demoMode;

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 border-b border-neutral-100 text-xs text-neutral-400 flex-shrink-0 overflow-x-auto">
        <IcoPencil size={12} className="text-[#FFCC00] flex-shrink-0" />
        <span className="font-medium text-neutral-600 flex-shrink-0">Feature Workshop</span>
        {spec?.title && (
          <>
            <IcoRight size={10} className="text-neutral-300 flex-shrink-0" />
            <span className="text-neutral-500 truncate max-w-[200px]">{spec.title}</span>
          </>
        )}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {!demoMode && (
            <button onClick={launchDemo}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#1a1a1a] bg-white border border-neutral-200 hover:border-[#FFE066] hover:bg-[#FFF4CC] px-2.5 py-1 rounded-lg transition-colors">
              <IcoPlay size={10} /> Demo
            </button>
          )}
          <button onClick={handleNewWorkshop}
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#1a1a1a] bg-white border border-neutral-200 hover:border-[#FFE066] hover:bg-[#FFF4CC] px-2.5 py-1 rounded-lg transition-colors">
            <IcoPlus size={11} /> New
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 bg-neutral-50/50">
        {showEmptyState && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4CC] flex items-center justify-center mb-4">
              <IcoPencil size={20} className="text-[#FFCC00]" />
            </div>
            <p className="text-sm font-medium text-neutral-600 mb-1">Feature Workshop</p>
            <p className="text-xs text-neutral-400 max-w-xs">Describe a feature idea and I'll guide you through building a structured spec with user stories, acceptance criteria, and a phone mockup.</p>
          </div>
        )}
        {msgs.map(m => (
          <WorkshopBubble key={m.id} msg={m} />
        ))}
        {busy && <Typing />}
        <div ref={bottom} />
      </div>

      {/* Demo mode controls OR dynamic chips */}
      {demoMode ? (
        <div className="px-4 py-3 flex items-center justify-center gap-4 flex-shrink-0 border-t border-neutral-100 bg-[#FFF9E0]">
          {!demoFinished && !busy ? (
            <button onClick={handleDemoNext}
              className="flex items-center gap-2 text-sm font-semibold text-[#1a1a1a] bg-[#FFCC00] hover:bg-[#e6b800] px-6 py-2.5 rounded-xl transition-colors shadow-sm">
              Continue
              <IcoRight size={14} />
            </button>
          ) : demoFinished ? (
            <p className="text-xs text-neutral-500 font-medium">Demo complete &mdash; try changing the color scheme or starting a new feature spec.</p>
          ) : null}
          <button onClick={handleExitDemo}
            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
            <IcoX size={11} /> Exit demo
          </button>
        </div>
      ) : (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto flex-shrink-0 border-t border-neutral-100">
          {dynamicChips.map(c => (
            <button key={c} onClick={() => handleChipClick(c)} disabled={busy}
              className="flex-shrink-0 text-xs text-[#1a1a1a] bg-[#FFF4CC] border border-[#FFE066] hover:bg-[#FFE066] disabled:opacity-40 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap font-medium">
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0">
        <div className="flex gap-2 items-center bg-white border border-neutral-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-[#FFCC00] focus-within:ring-2 focus-within:ring-[#FFF4CC] transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={demoMode && !demoFinished ? "Press Enter or click Continue to advance the demo..." : "Describe a feature, add user stories, or generate a mockup..."}
            className="flex-1 text-sm text-neutral-800 placeholder-neutral-400 bg-transparent outline-none"
          />
          <button onClick={() => demoMode && !input.trim() ? handleDemoNext() : send(input)}
            disabled={(!input.trim() && !demoMode) || busy}
            className="w-8 h-8 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-[#e6b800] transition-colors shadow-sm">
            <IcoSend size={13} className="text-[#1a1a1a]" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helper: build message array from demo agent turn ──── */
function buildDemoAgentMessages(agent) {
  const messages = [];
  if (agent.text) messages.push({ id: uid(), role: "ai", intent: "text", text: agent.text });
  if (agent.specCard) messages.push({ id: uid(), role: "ai", intent: "spec", specCard: agent.specCard });
  if (agent.phoneMockup) messages.push({ id: uid(), role: "ai", intent: "phoneMockup", phoneMockup: agent.phoneMockup });
  return messages;
}
