"use client";
import { useState } from "react";
import { IcoBell } from "@/components/icons";

export default function AlertBell({ alerts, onRead, onReadAll }) {
  const [open, setOpen] = useState(false);
  const unreadCount = alerts.filter(a => !a.read).length;

  const severityStyles = {
    critical: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
    warning: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
    info: { dot: "bg-sky-500", text: "text-sky-700", bg: "bg-sky-50" },
  };

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <IcoBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600 uppercase">Alerts ({alerts.length})</p>
            {unreadCount > 0 && (
              <button onClick={onReadAll} className="text-xs text-amber-700 hover:text-amber-800 font-medium">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No alerts
              </div>
            ) : (
              alerts.map(alert => {
                const style = severityStyles[alert.severity];
                return (
                  <button
                    key={alert.id}
                    onClick={() => { onRead(alert.id); }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${alert.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${style.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">{alert.squad}</p>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">{alert.metric}</p>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{alert.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
