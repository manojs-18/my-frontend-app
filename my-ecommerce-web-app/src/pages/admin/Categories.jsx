import { useEffect, useMemo, useState } from "react";
import { HiOutlinePlus, HiPencil, HiOutlineTrash, HiOutlineSearch, HiOutlineTag } from "react-icons/hi";
import adminService from "../../services/adminService";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonCard } from "../../components/common/Loader";

const emptyForm = { name: "", image: "", description: "" };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCategories();
      setCategories(res.data?.content || res.data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name?.toLowerCase().includes(q));
  }, [categories, search]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || "", image: cat.image || "", description: cat.description || "" });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await adminService.updateCategory(editing.id, form);
      } else {
        await adminService.createCategory(form);
      }
      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await adminService.deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">Manage product categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-56 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <Button icon={HiOutlinePlus} onClick={openAdd}>Add Category</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={HiOutlineTag} title="No categories found" action={<Button icon={HiOutlinePlus} onClick={openAdd}>Add Category</Button>} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((cat) => (
            <div key={cat.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="aspect-video w-full overflow-hidden bg-gray-50">
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80"}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3.5">
                <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
                <div className="mt-2.5 flex gap-2">
                  <button onClick={() => openEdit(cat)} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    <HiPencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(cat)} className="flex items-center gap-1 rounded-lg border border-red-100 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                    <HiOutlineTrash className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Category</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default Categories;
