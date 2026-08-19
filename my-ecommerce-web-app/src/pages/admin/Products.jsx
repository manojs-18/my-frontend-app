import { useEffect, useMemo, useState } from "react";
import { HiOutlinePlus, HiPencil, HiOutlineTrash, HiOutlineSearch, HiOutlineShoppingBag } from "react-icons/hi";
import adminService from "../../services/adminService";
import categoryService from "../../services/categoryService";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonRow } from "../../components/common/Loader";

const PAGE_SIZE = 8;
const emptyForm = {
  name: "",
  categoryId: "",
  brand: "",
  price: "",
  stock: "",
  description: "",
  image: "",
  rating: "",
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.allSettled([
        adminService.getProducts(),
        categoryService.getAll(),
      ]);
      if (prodRes.status === "fulfilled") {
        setProducts(prodRes.value.data?.content || prodRes.value.data || []);
      }
      if (catRes.status === "fulfilled") {
        setCategories(catRes.value.data?.content || catRes.value.data || []);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      list = list.filter((p) => String(p.category?.id ?? p.categoryId) === String(categoryFilter));
    }
    return list;
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, categoryFilter]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || "",
      categoryId: p.category?.id ?? p.categoryId ?? "",
      brand: p.brand || "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      description: p.description || "",
      image: p.image || "",
      rating: p.rating ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        rating: form.rating ? Number(form.rating) : undefined,
      };
      if (editing) {
        await adminService.updateProduct(editing.id, payload);
      } else {
        await adminService.createProduct(payload);
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
      await adminService.deleteProduct(deleteTarget.id);
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your product catalog.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-52 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Button icon={HiOutlinePlus} onClick={openAdd}>Add Product</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10">
                    <EmptyState icon={HiOutlineShoppingBag} title="No products found" />
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span className="font-medium text-gray-700">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {typeof p.category === "string" ? p.category : p.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.brand || "—"}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">₹{p.price}</td>
                    <td className="px-4 py-3">
                      <Badge status={p.stock > 10 ? "IN_STOCK" : p.stock > 0 ? "LOW_STOCK" : "OUT_OF_STOCK"}>
                        {p.stock ?? 0} units
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600">
                          <HiPencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600">
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Category<span className="ml-0.5 text-red-500">*</span></label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <Input label="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            <Input label="Rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
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
            <Button type="submit" loading={saving}>Save Product</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
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

export default Products;
