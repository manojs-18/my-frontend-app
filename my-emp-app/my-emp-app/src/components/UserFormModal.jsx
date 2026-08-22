import { useEffect, useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

const EMPTY_FORM = { username: "", password: "", role: "STAFF", status: "ACTIVE" };

export default function UserFormModal({ open, onClose, onSubmit, user, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(
        user
          ? { username: user.username || "", password: "", role: user.role || "STAFF", status: user.status || "ACTIVE" }
          : EMPTY_FORM
      );
      setErrors({});
    }
  }, [open, user]);

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = "Username is required.";
    if (!user && !form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      username: form.username.trim(),
      role: form.role,
      status: form.status,
    };
    // Only send a password when one was actually entered, so editing a
    // user doesn't accidentally wipe their existing password.
    if (form.password) payload.password = form.password;
    else if (user) payload.password = user.password;

    onSubmit(payload);
  };

  return (
    <Modal open={open} onClose={onClose} title={user ? "Edit User" : "Add User"} width="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          required
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          error={errors.username}
        />

        <Input
          label={user ? "New Password" : "Password"}
          type="password"
          placeholder={user ? "Leave blank to keep current password" : ""}
          required={!user}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            <option value="ADMIN">Admin</option>
            <option value="HR">HR</option>
            <option value="STAFF">Staff</option>
          </Select>
          <Select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={saving}>
            {user ? "Save Changes" : "Add User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
