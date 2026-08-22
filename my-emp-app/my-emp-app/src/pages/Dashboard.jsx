import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  CalendarCheck,
  FileClock,
  CheckCircle2,
  Wallet,
  ArrowRight,
} from "lucide-react";
import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/Loading";
import { formatDate } from "../utils/formatDate";
import { getErrorMessage } from "../api/axios";

import employeeApi from "../api/employeeApi";
import departmentApi from "../api/departmentApi";
import attendanceApi from "../api/attendanceApi";
import leaveApi from "../api/leaveApi";
import salaryApi from "../api/salaryApi";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [employees, departments, attendance, leaves, salaries] = await Promise.all([
        employeeApi.getAll(),
        departmentApi.getAll(),
        attendanceApi.getAll(),
        leaveApi.getAll(),
        salaryApi.getAll(),
      ]);
      setData({
        employees: employees.data,
        departments: departments.data,
        attendance: attendance.data,
        leaves: leaves.data,
        salaries: salaries.data,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load dashboard data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const today = new Date().toISOString().slice(0, 10);

    const presentToday = data.attendance.filter(
      (a) => a.attendanceDate === today && a.status?.toUpperCase() === "PRESENT"
    ).length;

    const pendingLeaves = data.leaves.filter((l) => l.status?.toUpperCase() === "PENDING").length;
    const approvedLeaves = data.leaves.filter((l) => l.status?.toUpperCase() === "APPROVED").length;

    return {
      totalEmployees: data.employees.length,
      totalDepartments: data.departments.length,
      presentToday,
      pendingLeaves,
      approvedLeaves,
      totalSalaryRecords: data.salaries.length,
    };
  }, [data]);

  const recentEmployees = useMemo(() => {
    if (!data) return [];
    return [...data.employees]
      .sort((a, b) => (b.employeeId || 0) - (a.employeeId || 0))
      .slice(0, 5);
  }, [data]);

  const recentLeaves = useMemo(() => {
    if (!data) return [];
    return [...data.leaves]
      .sort((a, b) => (b.leaveId || 0) - (a.leaveId || 0))
      .slice(0, 5);
  }, [data]);

  const departmentOverview = useMemo(() => {
    if (!data) return [];
    return data.departments.map((dept) => ({
      ...dept,
      employeeCount: data.employees.filter((e) => e.department?.departmentId === dept.departmentId).length,
    }));
  }, [data]);

  if (error && !loading) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <CardSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Employees" value={stats.totalEmployees} icon={Users} tone="indigo" />
          <StatCard label="Departments" value={stats.totalDepartments} icon={Building2} tone="sky" />
          <StatCard label="Present Today" value={stats.presentToday} icon={CalendarCheck} tone="emerald" />
          <StatCard label="Pending Leaves" value={stats.pendingLeaves} icon={FileClock} tone="amber" />
          <StatCard label="Approved Leaves" value={stats.approvedLeaves} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Salary Records" value={stats.totalSalaryRecords} icon={Wallet} tone="slate" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Employees */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="font-display text-base font-bold text-slate-900">Recent Employees</h3>
            <Link to="/employees" className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-dark">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-400">Loading employees…</div>
          ) : recentEmployees.length === 0 ? (
            <EmptyState title="No employees yet." />
          ) : (
            <ul className="divide-y divide-slate-50">
              {recentEmployees.map((emp) => (
                <li key={emp.employeeId} className="flex items-center gap-3 px-6 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
                    {emp.firstName?.charAt(0)}
                    {emp.lastName?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="truncate text-xs text-slate-500">{emp.email}</p>
                  </div>
                  <Badge>{emp.status || "—"}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Department Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h3 className="font-display text-base font-bold text-slate-900">Department Overview</h3>
          </div>
          {loading ? (
            <div className="p-6 text-sm text-slate-400">Loading departments…</div>
          ) : departmentOverview.length === 0 ? (
            <EmptyState title="No departments yet." />
          ) : (
            <ul className="divide-y divide-slate-50">
              {departmentOverview.map((dept) => (
                <li key={dept.departmentId} className="flex items-center justify-between px-6 py-3.5">
                  <p className="text-sm font-medium text-slate-700">{dept.departmentName}</p>
                  <span className="text-sm font-semibold text-slate-500">{dept.employeeCount}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="font-display text-base font-bold text-slate-900">Recent Leave Requests</h3>
          <Link to="/leaves" className="flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-dark">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-slate-400">Loading leave requests…</div>
        ) : recentLeaves.length === 0 ? (
          <EmptyState title="No leave requests yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Employee</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Dates</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeaves.map((leave) => (
                  <tr key={leave.leaveId} className="border-b border-slate-50 last:border-0">
                    <td className="px-6 py-3.5 font-medium text-slate-700">
                      {leave.employee ? `${leave.employee.firstName} ${leave.employee.lastName}` : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{leave.leaveType || "—"}</td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge>{leave.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
