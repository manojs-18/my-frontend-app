import { NavLink, useNavigate } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
  HiOutlineCreditCard,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiX,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
  { to: "/admin/users", label: "Users", icon: HiOutlineUsers },
  { to: "/admin/categories", label: "Categories", icon: HiOutlineTag },
  { to: "/admin/products", label: "Products", icon: HiOutlineShoppingBag },
  { to: "/admin/orders", label: "Orders", icon: HiOutlineClipboardList },
  { to: "/admin/payments", label: "Payments", icon: HiOutlineCreditCard },
  { to: "/admin/profile", label: "Profile", icon: HiOutlineUserCircle },
];

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white">
            S
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-white">Shoply</p>
            <p className="text-[11px] leading-tight text-indigo-300">Admin Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="text-indigo-300 hover:text-white lg:hidden">
          <HiX className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-indigo-200 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-indigo-200 hover:bg-white/5 hover:text-white"
        >
          <HiOutlineLogout className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 bg-gray-900 lg:block">{content}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-900 shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
