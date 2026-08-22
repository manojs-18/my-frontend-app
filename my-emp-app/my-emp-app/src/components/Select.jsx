import { ChevronDown } from "lucide-react";

export default function Select({ label, error, className = "", id, required, children, ...props }) {
  const selectId = id || props.name;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={`w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-slate-800 outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
            error ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-accent"
          }`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
