import { useEffect, useMemo, useState } from "react";
import { HiOutlineEye, HiPencil, HiOutlineTrash, HiOutlineSearch } from "react-icons/hi";
import adminService from "../../services/adminService";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import { SkeletonRow } from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const PAGE_SIZE = 8;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers();
      setUsers(res.data?.content || res.data || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.firstName?.toLowerCase().includes(q) ||
        u.lastName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openEdit = (u) => {
    setEditUser(u);
    setEditForm({ role: u.role, status: u.status || "ACTIVE" });
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await adminService.updateUser(editUser.id, editForm);
      setEditUser(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await adminService.deleteUser(deleteUser.id);
      setDeleteUser(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage registered users.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10">
                    <EmptyState title="No users found" />
                  </td>
                </tr>
              ) : (
                paginated.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">#{u.id}</td>
                    <td className="px-4 py-3 text-gray-700">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.phoneNumber || "—"}</td>
                    <td className="px-4 py-3"><Badge tone={u.role === "ADMIN" ? "purple" : "gray"}>{u.role || "USER"}</Badge></td>
                    <td className="px-4 py-3"><Badge status={u.status || "ACTIVE"}>{u.status || "ACTIVE"}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewUser(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600">
                          <HiPencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteUser(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* View modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details">
        {viewUser && (
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Name</span><span className="font-medium text-gray-800">{viewUser.firstName} {viewUser.lastName}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Email</span><span className="font-medium text-gray-800">{viewUser.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Phone</span><span className="font-medium text-gray-800">{viewUser.phoneNumber || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Role</span><Badge tone={viewUser.role === "ADMIN" ? "purple" : "gray"}>{viewUser.role || "USER"}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><Badge status={viewUser.status || "ACTIVE"}>{viewUser.status || "ACTIVE"}</Badge></div>
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button loading={saving} onClick={handleSaveEdit}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Role</label>
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        title="Delete User"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteUser(null)}>Cancel</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{deleteUser?.firstName} {deleteUser?.lastName}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Users;
