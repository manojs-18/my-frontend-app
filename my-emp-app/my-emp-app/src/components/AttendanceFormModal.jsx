import { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { toInputDate } from "../utils/formatDate";

const EMPTY_FORM = {
  employeeId: "",
  attendanceDate: "",
  checkIn: "",
  checkOut: "",
  status: "PRESENT",
};

export default function AttendanceFormModal({ open, onClose, onSubmit, record, employees, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(
        record
          ? {
              employeeId: record.employee?.employeeId ?? "",
              attendanceDate: toInputDate(record.attendanceDate),
              checkIn: record.checkIn?.slice(0, 5) || "",
              checkOut: record.checkOut?.slice(0, 5) || "",
              status: record.status || "PRESENT",
            }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, record]);

  const validate = () => {
    const next = {};
    if (!form.employeeId) next.employeeId = "Select an employee.";
    if (!form.attendanceDate) next.attendanceDate = "Date is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      employee: { employeeId: Number(form.employeeId) },
      attendanceDate: form.attendanceDate,
      checkIn: form.checkIn ? `${form.checkIn}:00` : null,
      checkOut: form.checkOut ? `${form.checkOut}:00` : null,
      status: form.status,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={record ? "Edit Attendance" : "Add Attendance"} width="md">
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
          label="Date"
          type="date"
          required
          value={form.attendanceDate}
          onChange={(e) => setForm((f) => ({ ...f, attendanceDate: e.target.value }))}
          error={errors.attendanceDate}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Check In"
            type="time"
            value={form.checkIn}
            onChange={(e) => setForm((f) => ({ ...f, checkIn: e.target.value }))}
          />
          <Input
            label="Check Out"
            type="time"
            value={form.checkOut}
            onChange={(e) => setForm((f) => ({ ...f, checkOut: e.target.value }))}
          />
        </div>

        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
          <option value="LATE">Late</option>
        </Select>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={saving}>
            {record ? "Save Changes" : "Add Record"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
