export default function ChartShell({ title, sub, children }) {
  return (
    <div className="mt-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <div className="px-1 pb-3">{children}</div>
    </div>
  );
}
