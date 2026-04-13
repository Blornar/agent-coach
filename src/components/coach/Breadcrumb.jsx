"use client";
import { useCoach } from "@/context/CoachContext";
import { IcoActivity, IcoRight, IcoPlus, IcoPlay } from "@/components/icons";

export default function Breadcrumb({ onNewChat, onDemo, demoMode }) {
  const { scope, setScope } = useCoach();
  const crumbs = scope.breadcrumb || [];

  const handleClick = (idx) => {
    if (idx === 0) setScope("org", "org");
    else if (idx === 1 && scope.crewId) setScope("crew", scope.crewId);
  };

  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 border-b border-neutral-100 text-xs text-neutral-400 flex-shrink-0 overflow-x-auto">
      <IcoActivity size={12} className="text-[#FFCC00] flex-shrink-0" />
      {crumbs.map((label, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5 flex-shrink-0">
            {i > 0 && <IcoRight size={10} className="text-neutral-300" />}
            {isLast
              ? <span className="font-medium text-neutral-600">{label}</span>
              : <button onClick={() => handleClick(i)} className="hover:text-neutral-600 hover:underline transition-colors">{label}</button>
            }
          </span>
        );
      })}
      <span className="text-neutral-300 ml-1">{"\u00B7"}</span>
      <span>Last 6 sprints</span>
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
