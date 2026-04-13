"use client";
import { useState } from "react";

export default function NotesInput({ onAdd }) {
  const [noteText, setNoteText] = useState("");

  const handleAdd = () => {
    if (noteText.trim()) {
      onAdd(noteText.trim());
      setNoteText("");
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Add a note..."
        rows={2}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#FFCC00] resize-none"
      />
      <button
        onClick={handleAdd}
        disabled={!noteText.trim()}
        className="text-sm font-medium bg-[#FFCC00] text-[#1a1a1a] px-4 py-1.5 rounded-lg hover:bg-[#e6b800] disabled:opacity-40 transition-colors"
      >
        Add note
      </button>
    </div>
  );
}
