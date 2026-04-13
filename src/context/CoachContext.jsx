"use client";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { ORG, SQUAD_HEALTH, SQUAD_METRICS, CREW_METRICS, PROJECTS_SEED } from "@/data/constants";

const CoachContext = createContext(null);

/* ── Scope resolution (unchanged — still powers the response engine) ── */

function resolveSquadInfo(squadId) {
  for (const crew of ORG.crews) {
    const sq = crew.squads.find(s => s.id === squadId);
    if (sq) return { squad: sq, crew };
  }
  return null;
}

function resolveCrewInfo(crewId) {
  return ORG.crews.find(c => c.id === crewId) || null;
}

export function buildScope(type, id) {
  if (type === "squad") {
    const info = resolveSquadInfo(id);
    if (!info) return null;
    return {
      type: "squad", id, name: info.squad.name,
      crewId: info.crew.id, crewName: info.crew.name,
      breadcrumb: [ORG.name, info.crew.name, info.squad.name],
    };
  }
  if (type === "crew") {
    const crew = resolveCrewInfo(id);
    if (!crew) return null;
    return {
      type: "crew", id, name: crew.name,
      crewId: crew.id, crewName: crew.name,
      squads: crew.squads,
      breadcrumb: [ORG.name, crew.name],
    };
  }
  return {
    type: "org", id: "org", name: ORG.name,
    breadcrumb: [ORG.name],
  };
}

function resolveData(scope) {
  if (scope.type === "squad") return SQUAD_METRICS[scope.id] || null;
  if (scope.type === "crew")  return CREW_METRICS[scope.id] || null;
  const ck = Object.keys(CREW_METRICS);
  if (!ck.length) return null;
  const first = CREW_METRICS[ck[0]];
  return {
    flowTime: first.flowTime.map((d, i) => {
      const vals = ck.map(k => CREW_METRICS[k].flowTime[i]);
      return { sprint: d.sprint, median: +(vals.reduce((a, v) => a + v.median, 0) / vals.length).toFixed(1), p85: +(vals.reduce((a, v) => a + v.p85, 0) / vals.length).toFixed(1) };
    }),
    velocity: first.velocity.map((d, i) => {
      const vals = ck.map(k => CREW_METRICS[k].velocity[i]);
      return { sprint: d.sprint, value: Math.round(vals.reduce((a, v) => a + v.value, 0) / vals.length) };
    }),
    efficiency: first.efficiency.map((d, i) => {
      const vals = ck.map(k => CREW_METRICS[k].efficiency[i]);
      return { sprint: d.sprint, efficiency: Math.round(vals.reduce((a, v) => a + v.efficiency, 0) / vals.length) };
    }),
  };
}

function resolveHealth(scope) {
  if (scope.type === "squad") return SQUAD_HEALTH.filter(s => s.id === scope.id);
  if (scope.type === "crew")  return SQUAD_HEALTH.filter(s => s.crew === scope.crewName);
  return SQUAD_HEALTH;
}

/* ── ID generator ─────────────────────────────────────── */
let _chatId = 100;
const nextChatId = () => `chat-${++_chatId}`;

/* ── Provider ─────────────────────────────────────────── */

const DEFAULT_SCOPE = buildScope("squad", "phoenix");

export function CoachProvider({ alerts, interventions, addIntervention, setTab, children }) {
  const [projects, setProjects]       = useState(PROJECTS_SEED);
  const [activeProjectId, setActiveProjectId] = useState(PROJECTS_SEED[0]?.id || null);
  const [activeChatId, setActiveChatId]       = useState(null);

  /* Derived state */
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeChat = activeProject?.chats.find(c => c.id === activeChatId) || null;
  const scope = activeChat ? buildScope(activeChat.scopeType, activeChat.scopeId) || DEFAULT_SCOPE : DEFAULT_SCOPE;
  const squadData = useMemo(() => resolveData(scope), [scope]);
  const healthData = useMemo(() => resolveHealth(scope), [scope]);

  /* ── Project CRUD ─────────────────────────────────── */
  const createProject = useCallback((name) => {
    const id = `proj-${Date.now()}`;
    setProjects(prev => [...prev, { id, name, chats: [] }]);
    setActiveProjectId(id);
    setActiveChatId(null);
    return id;
  }, []);

  const renameProject = useCallback((projectId, name) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, name } : p));
  }, []);

  const deleteProject = useCallback((projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(prev => {
        const remaining = projects.filter(p => p.id !== projectId);
        return remaining[0]?.id || null;
      });
      setActiveChatId(null);
    }
  }, [activeProjectId, projects]);

  /* ── Chat CRUD ────────────────────────────────────── */
  const createChat = useCallback((projectId, scopeType = "squad", scopeId = "phoenix", title = "") => {
    const id = nextChatId();
    const chat = { id, title, scopeType, scopeId, messages: [], createdAt: Date.now() };
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, chats: [...p.chats, chat] } : p
    ));
    setActiveProjectId(projectId);
    setActiveChatId(id);
    return id;
  }, []);

  const selectChat = useCallback((chatId) => {
    /* Find which project owns this chat */
    for (const p of projects) {
      if (p.chats.some(c => c.id === chatId)) {
        setActiveProjectId(p.id);
        setActiveChatId(chatId);
        return;
      }
    }
  }, [projects]);

  const updateChatMessages = useCallback((chatId, messages) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      chats: p.chats.map(c => c.id === chatId ? { ...c, messages } : c),
    })));
  }, []);

  const updateChatTitle = useCallback((chatId, title) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      chats: p.chats.map(c => c.id === chatId ? { ...c, title } : c),
    })));
  }, []);

  const updateChatScope = useCallback((chatId, scopeType, scopeId) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      chats: p.chats.map(c => c.id === chatId ? { ...c, scopeType, scopeId } : c),
    })));
  }, []);

  const deleteChat = useCallback((chatId) => {
    setProjects(prev => prev.map(p => ({
      ...p,
      chats: p.chats.filter(c => c.id !== chatId),
    })));
    if (activeChatId === chatId) setActiveChatId(null);
  }, [activeChatId]);

  const setScope = useCallback((type, id) => {
    /* Update the active chat's scope, or just store for later */
    if (activeChatId) {
      updateChatScope(activeChatId, type, id);
    }
  }, [activeChatId, updateChatScope]);

  const value = useMemo(() => ({
    /* Scope & data */
    scope, setScope, squadData, healthData,
    /* Projects & chats */
    projects, activeProject, activeChat, activeChatId,
    createProject, renameProject, deleteProject, createChat, selectChat, deleteChat,
    updateChatMessages, updateChatTitle, updateChatScope,
    /* App state */
    alerts, interventions, addIntervention, setTab,
    /* Legacy compat — still used by CoachTab for conversation persistence */
    conversations: new Map(), setConversations: () => {},
  }), [scope, setScope, squadData, healthData, projects, activeProject, activeChat, activeChatId, createProject, renameProject, deleteProject, createChat, selectChat, deleteChat, updateChatMessages, updateChatTitle, updateChatScope, alerts, interventions, addIntervention, setTab]);

  return <CoachContext.Provider value={value}>{children}</CoachContext.Provider>;
}

export function useCoach() {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error("useCoach must be used within CoachProvider");
  return ctx;
}
