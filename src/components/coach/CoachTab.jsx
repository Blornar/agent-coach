"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { IcoSend, IcoCheck, IcoRight, IcoX } from "@/components/icons";
import { CHIPS, SQUAD_HEALTH, OKRS, EPICS, PLAYBOOK, DEMO_SCRIPT, DEMO_SCRIPT_BASIC } from "@/data/constants";
import { uid } from "@/data/helpers";
import { respond } from "@/data/respond";
import { useCoach } from "@/context/CoachContext";
import { buildScope } from "@/context/CoachContext";
import Bubble from "./Bubble";
import Typing from "./Typing";
import WhatIfPanel from "./WhatIfPanel";
import WelcomeCard from "./WelcomeCard";
import Breadcrumb from "./Breadcrumb";

export default function CoachTab() {
  const {
    scope, squadData, healthData, alerts, interventions,
    activeProject, activeChat, activeChatId,
    createChat, updateChatMessages, updateChatTitle, updateChatScope,
  } = useCoach();

  /* ── Local state synced to activeChat ────────────────── */
  const [msgs, setMsgs]             = useState(activeChat?.messages || []);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [input, setInput]           = useState("");
  const [busy, setBusy]             = useState(false);
  const [dynamicChips, setDynamicChips] = useState(CHIPS);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected]     = useState(new Set());

  /* ── Demo mode ──────────────────────────────────────── */
  const [demoMode, setDemoMode]     = useState(false);
  const [demoStep, setDemoStep]     = useState(0);
  const demoScriptRef = useRef(DEMO_SCRIPT);

  const bottom = useRef(null);
  const prevChatId = useRef(activeChatId);

  /* Sync local msgs to context when they change */
  useEffect(() => {
    if (activeChatId && msgs.length) {
      updateChatMessages(activeChatId, msgs);
    }
  }, [msgs, activeChatId, updateChatMessages]);

  /* Load messages when active chat changes */
  useEffect(() => {
    if (activeChatId !== prevChatId.current) {
      prevChatId.current = activeChatId;
      setMsgs(activeChat?.messages || []);
      setDynamicChips(CHIPS);
      setShowWhatIf(false);
      setSelectMode(false);
      setSelected(new Set());
      if (!demoMode) {
        setDemoMode(false);
        setDemoStep(0);
      }
    }
  }, [activeChatId, activeChat, demoMode]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  /* ── New chat ───────────────────────────────────────── */
  const handleNewChat = useCallback(() => {
    if (!activeProject) return;
    createChat(activeProject.id);
    setMsgs([]);
    setDynamicChips(CHIPS);
    setShowWhatIf(false);
    setSelectMode(false);
    setSelected(new Set());
    setDemoMode(false);
    setDemoStep(0);
  }, [activeProject, createChat]);

  /* ── Demo logic ─────────────────────────────────────── */
  const launchDemo = useCallback((script, title) => {
    if (!activeProject) return;
    demoScriptRef.current = script;
    createChat(activeProject.id, "crew", "checkout", title);
    setMsgs([]);
    setDemoMode(true);
    setDemoStep(0);
    setDynamicChips([]);
    setShowWhatIf(false);
    setBusy(true);
    setTimeout(() => {
      const turn = script[0];
      if (!turn) return;
      const userMsg = { id: uid(), role: "user", text: turn.user };
      setMsgs([userMsg]);
      setTimeout(() => {
        const agentMsg = { id: uid(), role: "ai", ...turn.agent };
        setMsgs(m => [...m, agentMsg]);
        if (turn.agent.chips) setDynamicChips(turn.agent.chips);
        setDemoStep(1);
        setBusy(false);
      }, 1200);
    }, 400);
  }, [activeProject, createChat]);

  const handleStartDemo = useCallback(() => launchDemo(DEMO_SCRIPT, "Demo: Full Experience"), [launchDemo]);
  const handleStartDemoBasic = useCallback(() => launchDemo(DEMO_SCRIPT_BASIC, "Demo: Basic Experience"), [launchDemo]);

  const handleDemoNext = useCallback(() => {
    const script = demoScriptRef.current;
    if (!demoMode || demoStep >= script.length) return;
    const turn = script[demoStep];
    if (!turn) { setDemoMode(false); return; }
    setBusy(true);
    const userMsg = { id: uid(), role: "user", text: turn.user };
    setMsgs(m => [...m, userMsg]);
    setTimeout(() => {
      const agentMsg = { id: uid(), role: "ai", ...turn.agent };
      setMsgs(m => [...m, agentMsg]);
      if (turn.agent.chips) setDynamicChips(turn.agent.chips);
      setDemoStep(s => s + 1);
      setBusy(false);
    }, 1200);
  }, [demoMode, demoStep]);

  const handleExitDemo = useCallback(() => {
    setDemoMode(false);
    setDemoStep(0);
    setDynamicChips(CHIPS);
  }, []);

  /* ── Normal send ────────────────────────────────────── */
  const buildContext = useCallback(() => ({
    scope, squadData,
    history: msgs,
    interventions,
    allSquadHealth: SQUAD_HEALTH,
    epics: EPICS, okrs: OKRS, playbook: PLAYBOOK,
  }), [scope, squadData, msgs, interventions]);

  const send = useCallback((text) => {
    if (!text.trim() || busy) return;

    /* Auto-create a chat if none is active */
    let chatId = activeChatId;
    if (!chatId && activeProject) {
      chatId = createChat(activeProject.id);
    }

    setMsgs(m => [...m, { id: uid(), role: "user", text }]);
    setInput("");
    setBusy(true);

    /* Auto-title the chat from the first user message */
    const needsTitle = chatId && (!activeChat?.title || !activeChatId);
    if (needsTitle) {
      const title = text.length > 40 ? text.slice(0, 37) + "..." : text;
      updateChatTitle(chatId, title);
    }

    setTimeout(() => {
      const ctx = buildContext();
      ctx.history = [...ctx.history, { role: "user", text }];
      const result = respond(text, ctx);
      const newMsgs = result.messages.map(r => ({ id: uid(), ...r }));
      setMsgs(m => [...m, ...newMsgs]);
      if (result.chips) setDynamicChips(result.chips);
      setBusy(false);
    }, 900);
  }, [busy, buildContext, activeChatId, activeChat, activeProject, createChat, updateChatTitle]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (demoMode && !input.trim()) {
        e.preventDefault();
        handleDemoNext();
      } else {
        send(input);
      }
    }
  };

  const handleChipClick = (c) => {
    if (demoMode) { handleDemoNext(); return; }
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

  const demoFinished = demoMode && demoStep >= demoScriptRef.current.length;
  const showEmptyState = !activeChatId && msgs.length === 0 && !demoMode;

  return (
    <div className="flex flex-col h-full">
      <Breadcrumb onNewChat={handleNewChat} onDemo={handleStartDemo} onDemoBasic={handleStartDemoBasic} demoMode={demoMode} />

      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 bg-neutral-50/50">
        {showEmptyState && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-xl px-4">
              <WelcomeCard onAsk={send} scopeName={scope?.name || "your team"} />
              <p className="text-xs text-neutral-400 text-center">
                Type a message below, click a prompt above, or run a Demo to see it in action.
              </p>
            </div>
          </div>
        )}
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
            <p className="text-xs text-neutral-500 font-medium">Demo complete &mdash; try clicking &ldquo;Use this play&rdquo; on a playbook above, or start a new chat.</p>
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
            placeholder={demoMode && !demoFinished ? "Press Enter or click Continue to advance the demo..." : "Ask about squad health, flow metrics, OKRs, coaching recs, or sprint planning..."}
            className="flex-1 text-sm text-neutral-800 placeholder-neutral-400 bg-transparent outline-none"
          />
          {!demoMode && (
            <button onClick={() => setSelectMode(m => !m)} className="text-neutral-300 hover:text-neutral-500 transition-colors p-1" title="Select messages to copy">
              <IcoCheck size={14} />
            </button>
          )}
          <button onClick={() => demoMode && !input.trim() ? handleDemoNext() : send(input)} disabled={(!input.trim() && !demoMode) || busy}
            className="w-8 h-8 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0 disabled:opacity-30 hover:bg-[#e6b800] transition-colors shadow-sm">
            <IcoSend size={13} className="text-[#1a1a1a]" />
          </button>
        </div>
      </div>
    </div>
  );
}
