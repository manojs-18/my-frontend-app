import { useState } from "react";
import { Outlet } from "react-router-dom";
import { HiOutlineMenu } from "react-icons/hi";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <HiOutlineMenu className="h-5.5 w-5.5" />
          </button>
          <h1 className="text-sm font-semibold text-gray-500">Admin Console</h1>
          <div className="ml-auto flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {(user?.firstName?.[0] || "A").toUpperCase()}
            </div>
            <span className="hidden text-sm font-medium text-gray-700 sm:block">
              {user?.firstName || "Admin"}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
