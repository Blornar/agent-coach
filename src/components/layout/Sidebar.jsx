"use client";
import { useState } from "react";
import { IcoZap, IcoDown, IcoRight, IcoChat, IcoPlus, IcoTrash } from "@/components/icons";
import { NAV } from "@/data/constants";
import { useCoach } from "@/context/CoachContext";

const SCOPE_DOT = {
  squad: "bg-[#FFCC00]",
  crew: "bg-emerald-400",
  org: "bg-sky-400",
};

export default function Sidebar({ tab, setTab, open, onToggle }) {
  const { projects, activeProject, activeChatId, createProject, createChat, selectChat, deleteChat } = useCoach();
  const [projectOpen, setProjectOpen] = useState(() => {
    const map = {};
    projects.forEach(p => { map[p.id] = true; });
    return map;
  });
  const [addingProject, setAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const toggleProject = (id) => setProjectOpen(o => ({ ...o, [id]: !o[id] }));

  const handleChatClick = (chatId) => {
    selectChat(chatId);
    if (tab !== "coach") setTab("coach");
  };

  const handleNewChat = (projectId) => {
    createChat(projectId);
    if (tab !== "coach") setTab("coach");
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const id = createProject(newProjectName.trim());
    setProjectOpen(o => ({ ...o, [id]: true }));
    setAddingProject(false);
    setNewProjectName("");
  };

  if (!open) {
    return (
      <div className="hidden md:flex w-14 flex-shrink-0 bg-[#1a1a1a] flex-col h-full items-center py-3 transition-all duration-200">
        <div className="w-8 h-8 rounded-xl bg-[#FFCC00] flex items-center justify-center shadow mb-4">
          <IcoZap size={15} className="text-[#1a1a1a]" />
        </div>
        <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto">
          {NAV.map(({ id, Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)}
              title={id}
              className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${tab === id ? "bg-[#FFCC00] text-[#1a1a1a]" : "text-neutral-400 hover:text-white hover:bg-[#2d2d2d]"}`}>
              <Icon size={16} />
              {badge && (
                <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center leading-none ${tab === id ? "bg-[#1a1a1a] text-[#FFCC00]" : "bg-neutral-700 text-neutral-400"}`} style={{fontSize:9}}>{badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex w-56 flex-shrink-0 bg-[#1a1a1a] flex-col h-full transition-all duration-200">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FFCC00] flex items-center justify-center shadow">
            <IcoZap size={15} className="text-[#1a1a1a]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Agent Coach</p>
            <p className="text-neutral-500 text-xs mt-0.5">AI Delivery Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="px-2 py-3 border-b border-[#2d2d2d] space-y-0.5">
        {NAV.map(({ id, Icon, label, badge }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? "bg-[#FFCC00] text-[#1a1a1a]" : "text-neutral-400 hover:text-white hover:bg-[#2d2d2d]"}`}>
            <Icon size={15} />
            <span className="flex-1 text-left">{label}</span>
            {badge && <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === id ? "bg-[#1a1a1a] text-[#FFCC00]" : "bg-neutral-700 text-neutral-400"}`}>{badge}</span>}
          </button>
        ))}
      </div>

      {/* Projects & Chats */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <div className="flex items-center justify-between px-3 mb-2">
          <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Projects</p>
          <button onClick={() => setAddingProject(true)} className="text-neutral-600 hover:text-neutral-300 transition-colors" title="New project">
            <IcoPlus size={11} />
          </button>
        </div>

        {/* New project input */}
        {addingProject && (
          <div className="px-3 mb-2">
            <input
              autoFocus
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleCreateProject(); if (e.key === "Escape") { setAddingProject(false); setNewProjectName(""); } }}
              onBlur={() => { if (!newProjectName.trim()) { setAddingProject(false); setNewProjectName(""); } }}
              placeholder="Project name..."
              className="w-full text-xs bg-[#2d2d2d] text-white border border-neutral-600 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#FFCC00] placeholder-neutral-500"
            />
          </div>
        )}

        {projects.map(project => (
          <div key={project.id} className="mb-1">
            {/* Project header */}
            <div className="flex items-center">
              <button onClick={() => toggleProject(project.id)}
                className="flex items-center gap-1 px-2 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
                {projectOpen[project.id] ? <IcoDown size={11} /> : <IcoRight size={11} />}
              </button>
              <span className="text-xs font-medium text-neutral-400 flex-1 truncate">{project.name}</span>
            </div>

            {/* Chats within project */}
            {projectOpen[project.id] && (
              <div className="ml-4 mt-0.5 space-y-0.5">
                {project.chats.length === 0 && (
                  <p className="px-3 py-1 text-xs text-neutral-700 italic">No chats yet</p>
                )}
                {project.chats.map(chat => (
                  <div key={chat.id} className="group flex items-center">
                    <button
                      onClick={() => handleChatClick(chat.id)}
                      className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors text-left truncate ${
                        activeChatId === chat.id
                          ? "bg-[#2d2d2d] text-white"
                          : "text-neutral-500 hover:text-neutral-300 hover:bg-[#2d2d2d]"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${SCOPE_DOT[chat.scopeType] || SCOPE_DOT.squad}`} />
                      <span className="truncate">{chat.title || "New chat"}</span>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-700 hover:text-rose-400 transition-all flex-shrink-0"
                      title="Delete chat"
                    >
                      <IcoTrash size={10} />
                    </button>
                  </div>
                ))}
                {/* New chat button within project */}
                <button
                  onClick={() => handleNewChat(project.id)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-300 hover:bg-[#2d2d2d] rounded-lg transition-colors"
                >
                  <IcoPlus size={9} />
                  <span>New chat</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-t border-[#2d2d2d]">
        <p className="text-xs text-neutral-500 font-medium">James</p>
        <p className="text-xs text-neutral-700 mt-0.5">Last sync: 2 min ago {"\u00B7"} Enterprise</p>
      </div>
    </div>
  );
}
