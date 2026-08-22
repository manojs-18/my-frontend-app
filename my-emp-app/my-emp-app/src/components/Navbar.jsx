import { Menu, Bell, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/90 backdrop-blur px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <h1 className="font-display text-lg font-bold text-slate-900 whitespace-nowrap">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search…"
            className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-colors focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/20 lg:w-64"
          />
        </div>

        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-white" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
          {(user?.username || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
