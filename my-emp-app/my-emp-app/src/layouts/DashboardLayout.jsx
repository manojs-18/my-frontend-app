import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const TITLES = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/departments": "Departments",
  "/attendance": "Attendance",
  "/leaves": "Leave Management",
  "/salaries": "Salary Management",
  "/users": "Users",
};

function resolveTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/employees/")) return "Employee Details";
  const base = "/" + pathname.split("/")[1];
  return TITLES[base] || "HRFlow";
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Navbar title={resolveTitle(location.pathname)} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
