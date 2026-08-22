import { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

const EMPTY_FORM = { departmentName: "", description: "" };

export default function DepartmentFormModal({ open, onClose, onSubmit, department, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(
        department
          ? { departmentName: department.departmentName || "", description: department.description || "" }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, department]);

  const validate = () => {
    const next = {};
    if (!form.departmentName.trim()) next.departmentName = "Department name is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      departmentName: form.departmentName.trim(),
      description: form.description.trim() || null,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={department ? "Edit Department" : "Add Department"} width="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Department Name"
          required
          value={form.departmentName}
          onChange={(e) => setForm((f) => ({ ...f, departmentName: e.target.value }))}
          error={errors.departmentName}
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="What does this department do?"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={saving}>
            {department ? "Save Changes" : "Add Department"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
