import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, CalendarCheck, UserX, Clock3, Users2 } from "lucide-react";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import Select from "../components/Select";
import Badge from "../components/Badge";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";
import AttendanceFormModal from "../components/AttendanceFormModal";
import { useToast } from "../context/ToastContext";
import { formatDate, formatTime } from "../utils/formatDate";
import { getErrorMessage } from "../api/axios";

import attendanceApi from "../api/attendanceApi";
import employeeApi from "../api/employeeApi";

export default function Attendance() {
  const toast = useToast();

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [attRes, empRes] = await Promise.all([attendanceApi.getAll(), employeeApi.getAll()]);
      setRecords(attRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load attendance."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (employeeFilter && String(r.employee?.employeeId) !== employeeFilter) return false;
      if (dateFilter && r.attendanceDate !== dateFilter) return false;
      if (statusFilter && r.status?.toUpperCase() !== statusFilter) return false;
      return true;
    });
  }, [records, employeeFilter, dateFilter, statusFilter]);

  const summary = useMemo(() => {
    const present = records.filter((r) => r.status?.toUpperCase() === "PRESENT").length;
    const absent = records.filter((r) => r.status?.toUpperCase() === "ABSENT").length;
    const late = records.filter((r) => r.status?.toUpperCase() === "LATE").length;
    return { present, absent, late, total: records.length };
  }, [records]);

  const openAddForm = () => {
    setEditingRecord(null);
    setFormOpen(true);
  };

  const openEditForm = (record) => {
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingRecord) {
        await attendanceApi.update(editingRecord.attendanceId, payload);
        toast.success("Attendance updated successfully");
      } else {
        await attendanceApi.create(payload);
        toast.success("Attendance record added successfully");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save attendance record."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await attendanceApi.remove(deleteTarget.attendanceId);
      toast.success("Attendance record deleted successfully");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete attendance record."));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (r) =>
        r.employee ? (
          <p className="font-semibold text-slate-800">
            {r.employee.firstName} {r.employee.lastName}
          </p>
        ) : (
          "—"
        ),
    },
    { key: "attendanceDate", header: "Date", render: (r) => formatDate(r.attendanceDate) },
    { key: "checkIn", header: "Check In", render: (r) => formatTime(r.checkIn) },
    { key: "checkOut", header: "Check Out", render: (r) => formatTime(r.checkOut) },
    { key: "status", header: "Status", render: (r) => <Badge>{r.status || "—"}</Badge> },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditForm(r)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-accent"
            aria-label="Edit attendance"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(r)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete attendance"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Present" value={summary.present} icon={CalendarCheck} tone="emerald" loading={loading} />
        <StatCard label="Absent" value={summary.absent} icon={UserX} tone="rose" loading={loading} />
        <StatCard label="Late" value={summary.late} icon={Clock3} tone="amber" loading={loading} />
        <StatCard label="Total Records" value={summary.total} icon={Users2} tone="slate" loading={loading} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Select
            label="Employee"
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="">All employees</option>
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </Select>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-44 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40"
          >
            <option value="">All statuses</option>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </Select>
        </div>
        <Button icon={Plus} onClick={openAddForm}>
          Add Attendance
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="attendanceId"
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No attendance records found"
        emptyDescription="Try adjusting your filters, or add a new record."
      />

      <AttendanceFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        record={editingRecord}
        employees={employees}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this attendance record?"
        description="This action cannot be undone."
      />
    </div>
  );
}
