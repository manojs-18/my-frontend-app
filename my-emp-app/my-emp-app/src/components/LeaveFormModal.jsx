import { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { toInputDate } from "../utils/formatDate";

const EMPTY_FORM = {
  employeeId: "",
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function LeaveFormModal({ open, onClose, onSubmit, leave, employees, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(
        leave
          ? {
              employeeId: leave.employee?.employeeId ?? "",
              leaveType: leave.leaveType || "",
              startDate: toInputDate(leave.startDate),
              endDate: toInputDate(leave.endDate),
              reason: leave.reason || "",
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, leave]);

  const validate = () => {
    const next = {};
    if (!form.employeeId) next.employeeId = "Select an employee.";
    if (!form.leaveType.trim()) next.leaveType = "Leave type is required.";
    if (!form.startDate) next.startDate = "Start date is required.";
    if (!form.endDate) next.endDate = "End date is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      next.endDate = "End date must be after the start date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      employee: { employeeId: Number(form.employeeId) },
      leaveType: form.leaveType.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason.trim() || null,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={leave ? "Edit Leave Request" : "Apply for Leave"} width="md">
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

        <Select
          label="Leave Type"
          required
          value={form.leaveType}
          onChange={(e) => setForm((f) => ({ ...f, leaveType: e.target.value }))}
          error={errors.leaveType}
        >
          <option value="">Select type</option>
          <option value="SICK">Sick</option>
          <option value="CASUAL">Casual</option>
          <option value="ANNUAL">Annual</option>
          <option value="UNPAID">Unpaid</option>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            error={errors.startDate}
          />
          <Input
            label="End Date"
            type="date"
            required
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            error={errors.endDate}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason</label>
          <textarea
            rows={3}
            value={form.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Briefly describe the reason for leave"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={saving}>
            {leave ? "Save Changes" : "Submit Request"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
