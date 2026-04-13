import { IcoBot } from "@/components/icons";

export default function Typing() {
  return (
    <div className="flex gap-3 mb-5">
      <div className="w-7 h-7 rounded-full bg-[#FFCC00] flex items-center justify-center flex-shrink-0 shadow">
        <IcoBot size={14} className="text-[#1a1a1a]" />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-200 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 150, 300].map((d) => (
            <div key={d} className="w-2 h-2 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
