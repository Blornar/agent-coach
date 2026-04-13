"use client";
import { useCoach } from "@/context/CoachContext";
import { IcoActivity, IcoRight, IcoPlus, IcoPlay } from "@/components/icons";

export default function Breadcrumb({ onNewChat, onDemo, demoMode }) {
  const { activeProject, activeChat } = useCoach();

  const projectName = activeProject?.name || "No project";
  const chatTitle = activeChat?.title || "New chat";

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 border-b border-neutral-100 text-xs text-neutral-400 flex-shrink-0 overflow-x-auto">
      <IcoActivity size={12} className="text-[#FFCC00] flex-shrink-0" />
      <span className="flex-shrink-0">{projectName}</span>
      <IcoRight size={10} className="text-neutral-300 flex-shrink-0" />
      <span className="font-medium text-neutral-600 flex-shrink-0 truncate max-w-[200px]">{chatTitle}</span>
      <div className="ml-auto flex items-center gap-2 flex-shrink-0">
        {!demoMode && (
          <button
            onClick={onDemo}
            className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#1a1a1a] bg-white border border-neutral-200 hover:border-[#FFE066] hover:bg-[#FFF4CC] px-2.5 py-1 rounded-lg transition-colors"
          >
            <IcoPlay size={10} />
            Demo
          </button>
        )}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-[#1a1a1a] bg-white border border-neutral-200 hover:border-[#FFE066] hover:bg-[#FFF4CC] px-2.5 py-1 rounded-lg transition-colors"
        >
          <IcoPlus size={11} />
          New chat
        </button>
      </div>
    </div>
  );
}
