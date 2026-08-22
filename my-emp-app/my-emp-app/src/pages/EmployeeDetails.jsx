import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Cake,
  MapPin,
  Building2,
  CalendarDays,
  Wallet,
  Pencil,
} from "lucide-react";
import Badge from "../components/Badge";
import { Spinner } from "../components/Loading";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import EmployeeFormModal from "../components/EmployeeFormModal";
import { useToast } from "../context/ToastContext";
import { formatDate, formatTime } from "../utils/formatDate";
import { formatCurrency } from "../utils/formatCurrency";
import { getErrorMessage } from "../api/axios";

import employeeApi from "../api/employeeApi";
import departmentApi from "../api/departmentApi";
import attendanceApi from "../api/attendanceApi";
import leaveApi from "../api/leaveApi";
import salaryApi from "../api/salaryApi";

export default function EmployeeDetails() {
  const { id } = useParams();
  const toast = useToast();

  const [employee, setEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, deptRes, attRes, leaveRes, salRes] = await Promise.all([
        employeeApi.getById(id),
        departmentApi.getAll(),
        attendanceApi.getByEmployee(id),
        leaveApi.getByEmployee(id),
        salaryApi.getByEmployee(id),
      ]);
      setEmployee(empRes.data);
      setDepartments(deptRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setSalaries(salRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load employee details."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await employeeApi.update(id, payload);
      toast.success("Employee updated successfully");
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update employee."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading employee…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!employee) return <ErrorState message="Employee not found." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/employees"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Back to Employees
        </Link>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          <Pencil size={15} /> Edit Employee
        </button>
      </div>

      {/* Header card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent-light text-xl font-bold text-accent">
            {employee.firstName?.charAt(0)}
            {employee.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-slate-900">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-sm text-slate-500">Employee ID #{employee.employeeId}</p>
          </div>
          <Badge>{employee.status || "—"}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Personal & Employment Info */}
        <div className="lg:col-span-1 space-y-6">
          <InfoCard title="Personal Information">
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow icon={Phone} label="Phone" value={employee.phone} />
            <InfoRow icon={Cake} label="Date of Birth" value={formatDate(employee.dateOfBirth)} />
            <InfoRow icon={MapPin} label="Address" value={employee.address} />
          </InfoCard>

          <InfoCard title="Employment Information">
            <InfoRow icon={Building2} label="Department" value={employee.department?.departmentName || "Unassigned"} />
            <InfoRow icon={CalendarDays} label="Joining Date" value={formatDate(employee.joiningDate)} />
            <InfoRow icon={Wallet} label="Base Salary" value={formatCurrency(employee.salary)} />
          </InfoCard>
        </div>

        {/* Attendance, Leave, Salary history */}
        <div className="lg:col-span-2 space-y-6">
          <HistoryCard title="Attendance">
            {attendance.length === 0 ? (
              <EmptyState title="No attendance records" />
            ) : (
              <SimpleTable
                columns={["Date", "Check In", "Check Out", "Status"]}
                rows={attendance
                  .sort((a, b) => (b.attendanceDate || "").localeCompare(a.attendanceDate || ""))
                  .slice(0, 8)
                  .map((a) => [
                    formatDate(a.attendanceDate),
                    formatTime(a.checkIn),
                    formatTime(a.checkOut),
                    <Badge key={a.attendanceId}>{a.status}</Badge>,
                  ])}
              />
            )}
          </HistoryCard>

          <HistoryCard title="Leave History">
            {leaves.length === 0 ? (
              <EmptyState title="No leave requests" />
            ) : (
              <SimpleTable
                columns={["Type", "Start", "End", "Status"]}
                rows={leaves
                  .sort((a, b) => (b.leaveId || 0) - (a.leaveId || 0))
                  .map((l) => [
                    l.leaveType || "—",
                    formatDate(l.startDate),
                    formatDate(l.endDate),
                    <Badge key={l.leaveId}>{l.status}</Badge>,
                  ])}
              />
            )}
          </HistoryCard>

          <HistoryCard title="Salary History">
            {salaries.length === 0 ? (
              <EmptyState title="No salary records" />
            ) : (
              <SimpleTable
                columns={["Month", "Basic", "Allowance", "Deduction", "Net"]}
                rows={salaries
                  .sort((a, b) => (b.salaryId || 0) - (a.salaryId || 0))
                  .map((s) => [
                    s.salaryMonth || "—",
                    formatCurrency(s.basicSalary),
                    formatCurrency(s.allowance),
                    formatCurrency(s.deduction),
                    <span key={s.salaryId} className="font-semibold text-slate-900">
                      {formatCurrency(s.netSalary)}
                    </span>,
                  ])}
              />
            )}
          </HistoryCard>
        </div>
      </div>

      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        employee={employee}
        departments={departments}
        saving={saving}
      />
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-display text-sm font-bold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

function HistoryCard({ title, children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h3 className="font-display text-sm font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SimpleTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="bg-slate-50/60">
            {columns.map((c) => (
              <th key={c} className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-50">
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
