import { useEffect, useMemo, useState } from "react";
import { HiOutlineEye, HiOutlineSearch, HiOutlineClipboardList } from "react-icons/hi";
import adminService from "../../services/adminService";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonRow } from "../../components/common/Loader";
import OrderItem from "../../components/order/OrderItem";

const PAGE_SIZE = 8;
const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders();
      setOrders(res.data?.content || res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          String(o.id).includes(q) ||
          o.user?.firstName?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((o) => o.orderStatus === statusFilter);
    }
    return list;
  }, [orders, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, statusFilter]);

  const handleStatusChange = async (order, status) => {
    setUpdating(true);
    try {
      await adminService.updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, orderStatus: status } : o)));
      if (viewOrder?.id === order.id) setViewOrder({ ...viewOrder, orderStatus: status });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track all customer orders.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or customer..."
              className="w-64 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment</th>
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
                    <EmptyState icon={HiOutlineClipboardList} title="No orders found" />
                  </td>
                </tr>
              ) : (
                paginated.map((o) => (
                  <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">#{o.id}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {o.user ? `${o.user.firstName || ""} ${o.user.lastName || ""}`.trim() : o.customerName || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(o.createdAt || o.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">₹{o.totalAmount}</td>
                    <td className="px-4 py-3"><Badge status={o.paymentStatus}>{o.paymentStatus || "—"}</Badge></td>
                    <td className="px-4 py-3">
                      <select
                        value={o.orderStatus}
                        disabled={updating}
                        onChange={(e) => handleStatusChange(o, e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button onClick={() => setViewOrder(o)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                          <HiOutlineEye className="h-4 w-4" />
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

      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order #${viewOrder?.id}`} size="lg">
        {viewOrder && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge status={viewOrder.orderStatus}>{viewOrder.orderStatus?.replaceAll("_", " ")}</Badge>
              <select
                value={viewOrder.orderStatus}
                disabled={updating}
                onChange={(e) => handleStatusChange(viewOrder, e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replaceAll("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Customer</h4>
                <p className="text-sm text-gray-700">
                  {viewOrder.user?.firstName} {viewOrder.user?.lastName}<br />
                  {viewOrder.user?.email}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Delivery Address</h4>
                {viewOrder.address || viewOrder.shippingAddress ? (
                  <p className="text-sm text-gray-700">
                    {(viewOrder.address || viewOrder.shippingAddress).address},{" "}
                    {(viewOrder.address || viewOrder.shippingAddress).city},{" "}
                    {(viewOrder.address || viewOrder.shippingAddress).pincode}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Order Items</h4>
              <div className="rounded-xl border border-gray-100 px-3">
                {(viewOrder.items || []).map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div className="flex justify-between border-t border-gray-100 pt-4 text-base font-bold text-gray-900">
              <span>Total Amount</span>
              <span>₹{viewOrder.totalAmount}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
