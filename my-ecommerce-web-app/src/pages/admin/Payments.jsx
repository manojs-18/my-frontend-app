import { useEffect, useMemo, useState } from "react";
import { HiOutlineSearch, HiOutlineCreditCard, HiOutlineEye } from "react-icons/hi";
import adminService from "../../services/adminService";
import Badge from "../../components/common/Badge";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonRow } from "../../components/common/Loader";

const PAGE_SIZE = 8;
const METHOD_OPTIONS = ["COD", "UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING"];
const STATUS_OPTIONS = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [viewPayment, setViewPayment] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getPayments();
      setPayments(res.data?.content || res.data || []);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...payments];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          String(p.id).includes(q) ||
          String(p.orderId ?? p.order?.id).includes(q) ||
          p.transactionId?.toLowerCase().includes(q) ||
          p.user?.email?.toLowerCase().includes(q)
      );
    }
    if (methodFilter) list = list.filter((p) => p.paymentMethod === methodFilter || p.method === methodFilter);
    if (statusFilter) list = list.filter((p) => p.paymentStatus === statusFilter || p.status === statusFilter);
    return list;
  }, [payments, search, methodFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, methodFilter, statusFilter]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">Review and track all transactions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, order, or transaction..."
              className="w-64 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Methods</option>
            {METHOD_OPTIONS.map((m) => (
              <option key={m} value={m}>{m.replaceAll("_", " ")}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">Payment ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10">
                    <EmptyState icon={HiOutlineCreditCard} title="No payments found" />
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-700">#{p.id}</td>
                    <td className="px-4 py-3 text-gray-600">#{p.orderId ?? p.order?.id}</td>
                    <td className="px-4 py-3 text-gray-500">{p.user?.email || p.userEmail || "—"}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">₹{p.amount}</td>
                    <td className="px-4 py-3 text-gray-500">{(p.paymentMethod || p.method)?.replaceAll("_", " ")}</td>
                    <td className="px-4 py-3 text-gray-500">{p.transactionId || "—"}</td>
                    <td className="px-4 py-3"><Badge status={p.paymentStatus || p.status}>{p.paymentStatus || p.status}</Badge></td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button onClick={() => setViewPayment(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
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

      <Modal isOpen={!!viewPayment} onClose={() => setViewPayment(null)} title="Payment Details">
        {viewPayment && (
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Payment ID</span><span className="font-medium text-gray-800">#{viewPayment.id}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Order ID</span><span className="font-medium text-gray-800">#{viewPayment.orderId ?? viewPayment.order?.id}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="font-medium text-gray-800">₹{viewPayment.amount}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Method</span><span className="font-medium text-gray-800">{(viewPayment.paymentMethod || viewPayment.method)?.replaceAll("_", " ")}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Transaction ID</span><span className="font-medium text-gray-800">{viewPayment.transactionId || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><Badge status={viewPayment.paymentStatus || viewPayment.status}>{viewPayment.paymentStatus || viewPayment.status}</Badge></div>
            <div className="flex justify-between"><span className="text-gray-400">Date</span><span className="font-medium text-gray-800">{viewPayment.createdAt ? new Date(viewPayment.createdAt).toLocaleString() : "—"}</span></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
