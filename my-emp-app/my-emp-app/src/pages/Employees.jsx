import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import Badge from "../components/Badge";
import ConfirmDialog from "../components/ConfirmDialog";
import EmployeeFormModal from "../components/EmployeeFormModal";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/formatDate";
import { getErrorMessage } from "../api/axios";

import employeeApi from "../api/employeeApi";
import departmentApi from "../api/departmentApi";

export default function Employees() {
  const toast = useToast();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [empRes, deptRes] = await Promise.all([employeeApi.getAll(), departmentApi.getAll()]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load employees."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      [e.firstName, e.lastName, e.email, e.department?.departmentName, e.position]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [employees, search]);

  const openAddForm = () => {
    setEditingEmployee(null);
    setFormOpen(true);
  };

  const openEditForm = (emp) => {
    setEditingEmployee(emp);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingEmployee) {
        await employeeApi.update(editingEmployee.employeeId, payload);
        toast.success("Employee updated successfully");
      } else {
        await employeeApi.create(payload);
        toast.success("Employee added successfully");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save employee."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await employeeApi.remove(deleteTarget.employeeId);
      toast.success("Employee deleted successfully");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete employee."));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "name",
      header: "Employee",
      render: (e) => (
        <Link to={`/employees/${e.employeeId}`} className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
            {e.firstName?.charAt(0)}
            {e.lastName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 group-hover:text-accent transition-colors">
              {e.firstName} {e.lastName}
            </p>
            <p className="text-xs text-slate-500">ID #{e.employeeId}</p>
          </div>
        </Link>
      ),
    },
    { key: "email", header: "Email", render: (e) => e.email || "—" },
    { key: "phone", header: "Phone", render: (e) => e.phone || "—" },
    { key: "department", header: "Department", render: (e) => e.department?.departmentName || "—" },
    { key: "joiningDate", header: "Joining Date", render: (e) => formatDate(e.joiningDate) },
    { key: "status", header: "Status", render: (e) => <Badge>{e.status || "—"}</Badge> },
    {
      key: "actions",
      header: "Actions",
      render: (e) => (
        <div className="flex items-center gap-1">
          <Link
            to={`/employees/${e.employeeId}`}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="View employee"
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={() => openEditForm(e)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-accent"
            aria-label="Edit employee"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(e)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete employee"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <Button icon={Plus} onClick={openAddForm}>
          Add Employee
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyField="employeeId"
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle={search ? "No matching employees" : "No employees yet"}
        emptyDescription={
          search ? "Try a different search term." : "Add your first employee to get started."
        }
      />

      <EmployeeFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        employee={editingEmployee}
        departments={departments}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this employee?"
        description={
          deleteTarget
            ? `${deleteTarget.firstName} ${deleteTarget.lastName} will be permanently removed. This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
