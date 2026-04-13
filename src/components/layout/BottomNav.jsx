"use client";
import { NAV } from "@/data/constants";

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#2d2d2d] flex z-20">
      {NAV.slice(0, 5).map(({ id, Icon, label, badge }) => (
        <button key={id} onClick={() => setTab(id)}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${tab === id ? "text-[#FFCC00]" : "text-neutral-500"}`}>
          <Icon size={18} />
          <span className="text-xs leading-none">{label.split(" ")[0]}</span>
          {badge && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none" style={{fontSize:8}}>{badge}</span>}
        </button>
      ))}
    </nav>
  );
}
