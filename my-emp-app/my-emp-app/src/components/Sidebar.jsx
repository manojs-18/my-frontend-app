import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  FileClock,
  Wallet,
  ShieldCheck,
  LogOut,
  X,
  Boxes,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leaves", label: "Leave Management", icon: FileClock },
  { to: "/salaries", label: "Salary", icon: Wallet },
  { to: "/users", label: "Users", icon: ShieldCheck },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const content = (
    <div className="flex h-full flex-col bg-sidebar text-slate-300">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
          <Boxes size={18} />
        </div>
        <div>
          <p className="font-display text-base font-bold leading-tight text-white">HRFlow</p>
          <p className="text-[11px] leading-tight text-slate-400">Employee Management</p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-sidebar-hover hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-hover text-white"
                  : "text-slate-400 hover:bg-sidebar-hover/60 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 -translate-y-1/2 w-1 rounded-r-full bg-accent" />
                )}
                <Icon size={18} className={isActive ? "text-accent" : ""} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
            {(user?.username || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.username || "User"}</p>
            <p className="truncate text-xs text-slate-400 capitalize">{(user?.role || "").toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-sidebar-hover/60 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        {content}
      </aside>

      {/* Mobile: slide-over sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-slate-900/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-y-0 left-0 w-64 transform transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {content}
        </div>
      </div>
    </>
  );
}
