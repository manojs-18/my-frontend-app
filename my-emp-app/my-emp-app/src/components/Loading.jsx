import { Loader2 } from "lucide-react";

export function Spinner({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-slate-500 ${className}`}>
      <Loader2 size={26} className="animate-spin text-accent" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-6 border-b border-slate-100 px-6 py-4">
          {Array.from({ length: columns }).map((__, c) => (
            <div
              key={c}
              className="h-3.5 flex-1 rounded bg-slate-100"
              style={{ maxWidth: c === 0 ? "3rem" : undefined }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
          <div className="h-3 w-20 rounded bg-slate-100" />
          <div className="mt-3 h-7 w-14 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}
