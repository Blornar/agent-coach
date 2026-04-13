"use client";
import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { ORG, SQUAD_HEALTH, SQUAD_METRICS, CREW_METRICS } from "@/data/constants";

const CoachContext = createContext(null);

/* ── Scope resolution helpers ─────────────────────────── */

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

function buildScope(type, id) {
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
  /* org */
  return {
    type: "org", id: "org", name: ORG.name,
    breadcrumb: [ORG.name],
  };
}

function resolveData(scope) {
  if (scope.type === "squad") return SQUAD_METRICS[scope.id] || null;
  if (scope.type === "crew")  return CREW_METRICS[scope.id] || null;
  /* org-level: average of all crew metrics */
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

/* ── Provider ─────────────────────────────────────────── */

export function CoachProvider({ squad, setSquad, alerts, interventions, addIntervention, setTab, scopeCmd, children }) {
  const [scopeState, setScopeState] = useState(() => buildScope("squad", squad));
  const [conversations, setConversations] = useState(() => new Map());

  /* React to sidebar scope changes */
  useEffect(() => {
    if (scopeCmd) {
      const next = buildScope(scopeCmd.type, scopeCmd.id);
      if (next) setScopeState(next);
    }
  }, [scopeCmd]);

  const setScope = useCallback((type, id) => {
    const next = buildScope(type, id);
    if (!next) return;
    setScopeState(next);
    if (type === "squad") setSquad(id);
  }, [setSquad]);

  const scope = scopeState || buildScope("squad", squad);
  const squadData = useMemo(() => resolveData(scope), [scope]);
  const healthData = useMemo(() => resolveHealth(scope), [scope]);

  const value = useMemo(() => ({
    scope, setScope, squadData, healthData,
    alerts, interventions, addIntervention, setTab,
    conversations, setConversations,
  }), [scope, setScope, squadData, healthData, alerts, interventions, addIntervention, setTab, conversations]);

  return <CoachContext.Provider value={value}>{children}</CoachContext.Provider>;
}

export function useCoach() {
  const ctx = useContext(CoachContext);
  if (!ctx) throw new Error("useCoach must be used within CoachProvider");
  return ctx;
}
