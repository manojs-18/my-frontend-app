import { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";
import { toInputDate } from "../utils/formatDate";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  joiningDate: "",
  salary: "",
  status: "ACTIVE",
  departmentId: "",
};

export default function EmployeeFormModal({ open, onClose, onSubmit, employee, departments, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (employee) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          firstName: employee.firstName || "",
          lastName: employee.lastName || "",
          email: employee.email || "",
          phone: employee.phone || "",
          dateOfBirth: toInputDate(employee.dateOfBirth),
          gender: employee.gender || "",
          address: employee.address || "",
          joiningDate: toInputDate(employee.joiningDate),
          salary: employee.salary ?? "",
          status: employee.status || "ACTIVE",
          departmentId: employee.department?.departmentId ?? "",
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [open, employee]);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.joiningDate) next.joiningDate = "Joining date is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender || null,
      address: form.address.trim() || null,
      joiningDate: form.joiningDate,
      salary: form.salary === "" ? null : Number(form.salary),
      status: form.status,
      department: form.departmentId ? { departmentId: Number(form.departmentId) } : null,
    };

    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose} title={employee ? "Edit Employee" : "Add Employee"} width="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            required
            value={form.firstName}
            onChange={handleChange("firstName")}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            required
            value={form.lastName}
            onChange={handleChange("lastName")}
            error={errors.lastName}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            error={errors.email}
          />
          <Input label="Phone" value={form.phone} onChange={handleChange("phone")} />
          <Input
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={handleChange("dateOfBirth")}
          />
          <Select label="Gender" value={form.gender} onChange={handleChange("gender")}>
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </Select>
          <Input
            label="Joining Date"
            type="date"
            required
            value={form.joiningDate}
            onChange={handleChange("joiningDate")}
            error={errors.joiningDate}
          />
          <Input
            label="Salary"
            type="number"
            step="0.01"
            min="0"
            value={form.salary}
            onChange={handleChange("salary")}
          />
          <Select label="Department" value={form.departmentId} onChange={handleChange("departmentId")}>
            <option value="">No department</option>
            {departments.map((d) => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </Select>
          <Select label="Status" value={form.status} onChange={handleChange("status")}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="TERMINATED">Terminated</option>
          </Select>
        </div>

        <Input
          label="Address"
          value={form.address}
          onChange={handleChange("address")}
          className="sm:col-span-2"
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={saving}>
            {employee ? "Save Changes" : "Add Employee"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
