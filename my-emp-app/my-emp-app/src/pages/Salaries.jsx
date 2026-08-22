import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Wallet, TrendingUp, TrendingDown, Banknote } from "lucide-react";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";
import SalaryFormModal from "../components/SalaryFormModal";
import { useToast } from "../context/ToastContext";
import { formatCurrency } from "../utils/formatCurrency";
import { getErrorMessage } from "../api/axios";

import salaryApi from "../api/salaryApi";
import employeeApi from "../api/employeeApi";

export default function Salaries() {
  const toast = useToast();

  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [salRes, empRes] = await Promise.all([salaryApi.getAll(), employeeApi.getAll()]);
      setSalaries(salRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load salary records."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const summary = useMemo(() => {
    const totalNet = salaries.reduce((sum, s) => sum + (s.netSalary || 0), 0);
    const totalAllowance = salaries.reduce((sum, s) => sum + (s.allowance || 0), 0);
    const totalDeduction = salaries.reduce((sum, s) => sum + (s.deduction || 0), 0);
    return { totalNet, totalAllowance, totalDeduction, count: salaries.length };
  }, [salaries]);

  const openAddForm = () => {
    setEditingSalary(null);
    setFormOpen(true);
  };

  const openEditForm = (salary) => {
    setEditingSalary(salary);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingSalary) {
        await salaryApi.update(editingSalary.salaryId, payload);
        toast.success("Salary record updated successfully");
      } else {
        await salaryApi.create(payload);
        toast.success("Salary record added successfully");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save salary record."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await salaryApi.remove(deleteTarget.salaryId);
      toast.success("Salary record deleted successfully");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete salary record."));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (s) =>
        s.employee ? (
          <p className="font-semibold text-slate-800">
            {s.employee.firstName} {s.employee.lastName}
          </p>
        ) : (
          "—"
        ),
    },
    { key: "salaryMonth", header: "Month", render: (s) => s.salaryMonth || "—" },
    { key: "basicSalary", header: "Basic Salary", render: (s) => formatCurrency(s.basicSalary) },
    { key: "allowance", header: "Allowance", render: (s) => formatCurrency(s.allowance) },
    { key: "deduction", header: "Deduction", render: (s) => formatCurrency(s.deduction) },
    {
      key: "netSalary",
      header: "Net Salary",
      render: (s) => <span className="font-semibold text-slate-900">{formatCurrency(s.netSalary)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (s) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditForm(s)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-accent"
            aria-label="Edit salary record"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(s)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete salary record"
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
        <StatCard label="Total Net Salary" value={formatCurrency(summary.totalNet)} icon={Wallet} tone="indigo" loading={loading} />
        <StatCard label="Total Allowance" value={formatCurrency(summary.totalAllowance)} icon={TrendingUp} tone="emerald" loading={loading} />
        <StatCard label="Total Deduction" value={formatCurrency(summary.totalDeduction)} icon={TrendingDown} tone="rose" loading={loading} />
        <StatCard label="Salary Records" value={summary.count} icon={Banknote} tone="slate" loading={loading} />
      </div>

      <div className="flex justify-end">
        <Button icon={Plus} onClick={openAddForm}>
          Add Salary Record
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={salaries}
        keyField="salaryId"
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No salary records yet"
        emptyDescription="Add a salary record to get started."
      />

      <SalaryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        salary={editingSalary}
        employees={employees}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this salary record?"
        description="This action cannot be undone."
      />
    </div>
  );
}
