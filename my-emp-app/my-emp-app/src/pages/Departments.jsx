import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Building2 } from "lucide-react";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DepartmentFormModal from "../components/DepartmentFormModal";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../api/axios";

import departmentApi from "../api/departmentApi";
import employeeApi from "../api/employeeApi";

export default function Departments() {
  const toast = useToast();

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [viewTarget, setViewTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deptRes, empRes] = await Promise.all([departmentApi.getAll(), employeeApi.getAll()]);
      setDepartments(deptRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load departments."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const withCounts = useMemo(
    () =>
      departments.map((d) => ({
        ...d,
        employeeCount: employees.filter((e) => e.department?.departmentId === d.departmentId).length,
      })),
    [departments, employees]
  );

  const openAddForm = () => {
    setEditingDept(null);
    setFormOpen(true);
  };

  const openEditForm = (dept) => {
    setEditingDept(dept);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingDept) {
        await departmentApi.update(editingDept.departmentId, payload);
        toast.success("Department updated successfully");
      } else {
        await departmentApi.create(payload);
        toast.success("Department added successfully");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save department."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await departmentApi.remove(deleteTarget.departmentId);
      toast.success("Department deleted successfully");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete department."));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "departmentName",
      header: "Department",
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 size={16} />
          </div>
          <p className="font-semibold text-slate-800">{d.departmentName}</p>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (d) => <span className="text-slate-500">{d.description || "—"}</span>,
    },
    { key: "employeeCount", header: "Employees" },
    {
      key: "actions",
      header: "Actions",
      render: (d) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewTarget(d)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="View department"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => openEditForm(d)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-accent"
            aria-label="Edit department"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(d)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete department"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button icon={Plus} onClick={openAddForm}>
          Add Department
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={withCounts}
        keyField="departmentId"
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No departments yet"
        emptyDescription="Add your first department to get started."
      />

      <DepartmentFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        department={editingDept}
        saving={saving}
      />

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title={viewTarget?.departmentName} width="sm">
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-slate-400">Description</p>
            <p className="text-slate-700">{viewTarget?.description || "—"}</p>
          </div>
          <div>
            <p className="text-slate-400">Employees</p>
            <p className="text-slate-700">
              {employees.filter((e) => e.department?.departmentId === viewTarget?.departmentId).length}
            </p>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this department?"
        description={
          deleteTarget
            ? `"${deleteTarget.departmentName}" will be permanently removed. This action cannot be undone.`
            : ""
        }
      />
    </div>
  );
}
