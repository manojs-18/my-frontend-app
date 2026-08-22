import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-accent text-white hover:bg-accent-dark shadow-sm shadow-indigo-200 disabled:hover:bg-accent",
  secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
  danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50",
  dangerSolid: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200",
  ghost: "text-slate-600 hover:bg-slate-100",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </button>
  );
}
