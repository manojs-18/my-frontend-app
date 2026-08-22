import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, ShieldCheck } from "lucide-react";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import UserFormModal from "../components/UserFormModal";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../api/axios";

import userApi from "../api/userApi";

export default function Users() {
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const openAddForm = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingUser) {
        await userApi.update(editingUser.userId, payload);
        toast.success("User updated successfully");
      } else {
        await userApi.create(payload);
        toast.success("User added successfully");
      }
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save user."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await userApi.remove(deleteTarget.userId);
      toast.success("User deleted successfully");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete user."));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "username",
      header: "Username",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-light text-sm font-bold text-accent">
            {u.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{u.username}</p>
            <p className="text-xs text-slate-500">ID #{u.userId}</p>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", render: (u) => <span className="capitalize text-slate-600">{(u.role || "—").toLowerCase()}</span> },
    { key: "status", header: "Status", render: (u) => <Badge>{u.status || "—"}</Badge> },
    {
      key: "actions",
      header: "Actions",
      render: (u) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewTarget(u)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="View user"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => openEditForm(u)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-accent"
            aria-label="Edit user"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setDeleteTarget(u)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete user"
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
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        keyField="userId"
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No users yet"
        emptyDescription="Add your first user account to get started."
      />

      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        user={editingUser}
        saving={saving}
      />

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="User Details" width="sm">
        {viewTarget && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-light text-accent">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{viewTarget.username}</p>
                <p className="text-xs text-slate-500">ID #{viewTarget.userId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-slate-400">Role</p>
                <p className="text-slate-700 capitalize">{(viewTarget.role || "—").toLowerCase()}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <Badge>{viewTarget.status}</Badge>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2">Passwords are never shown here for security reasons.</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this user?"
        description={deleteTarget ? `"${deleteTarget.username}" will lose access immediately. This action cannot be undone.` : ""}
      />
    </div>
  );
}
