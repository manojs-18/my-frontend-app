import { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

const EMPTY_FORM = {
  employeeId: "",
  salaryMonth: "",
  basicSalary: "",
  allowance: "",
  deduction: "",
};

export default function SalaryFormModal({ open, onClose, onSubmit, salary, employees, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(
        salary
          ? {
              employeeId: salary.employee?.employeeId ?? "",
              salaryMonth: salary.salaryMonth || "",
              basicSalary: salary.basicSalary ?? "",
              allowance: salary.allowance ?? "",
              deduction: salary.deduction ?? "",
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, salary]);

  const validate = () => {
    const next = {};
    if (!form.employeeId) next.employeeId = "Select an employee.";
    if (!form.salaryMonth.trim()) next.salaryMonth = "Salary month is required.";
    if (form.basicSalary === "" || Number(form.basicSalary) < 0) next.basicSalary = "Enter a valid basic salary.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      employee: { employeeId: Number(form.employeeId) },
      salaryMonth: form.salaryMonth.trim(),
      basicSalary: Number(form.basicSalary),
      allowance: form.allowance === "" ? 0 : Number(form.allowance),
      deduction: form.deduction === "" ? 0 : Number(form.deduction),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={salary ? "Edit Salary Record" : "Add Salary Record"} width="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Employee"
          required
          value={form.employeeId}
          onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))}
          error={errors.employeeId}
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.firstName} {emp.lastName}
            </option>
          ))}
        </Select>

        <Input
          label="Salary Month"
          placeholder="e.g. 2026-08"
          required
          value={form.salaryMonth}
          onChange={(e) => setForm((f) => ({ ...f, salaryMonth: e.target.value }))}
          error={errors.salaryMonth}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Basic Salary"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.basicSalary}
            onChange={(e) => setForm((f) => ({ ...f, basicSalary: e.target.value }))}
            error={errors.basicSalary}
          />
          <Input
            label="Allowance"
            type="number"
            step="0.01"
            min="0"
            value={form.allowance}
            onChange={(e) => setForm((f) => ({ ...f, allowance: e.target.value }))}
          />
          <Input
            label="Deduction"
            type="number"
            step="0.01"
            min="0"
            value={form.deduction}
            onChange={(e) => setForm((f) => ({ ...f, deduction: e.target.value }))}
          />
        </div>

        <p className="text-xs text-slate-400">
          Net salary is calculated by the backend from basic salary + allowance − deduction.
        </p>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={saving}>
            {salary ? "Save Changes" : "Add Record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
