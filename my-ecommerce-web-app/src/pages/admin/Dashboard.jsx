import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineClipboardList,
  HiOutlineCurrencyRupee,
  HiOutlineClock,
} from "react-icons/hi";
import adminService from "../../services/adminService";
import Badge from "../../components/common/Badge";
import { Spinner } from "../../components/common/Loader";

const STAT_CARDS = [
  { key: "totalUsers", label: "Total Users", icon: HiOutlineUsers, tone: "bg-indigo-50 text-indigo-600" },
  { key: "totalProducts", label: "Total Products", icon: HiOutlineShoppingBag, tone: "bg-violet-50 text-violet-600" },
  { key: "totalCategories", label: "Total Categories", icon: HiOutlineTag, tone: "bg-blue-50 text-blue-600" },
  { key: "totalOrders", label: "Total Orders", icon: HiOutlineClipboardList, tone: "bg-emerald-50 text-emerald-600" },
  { key: "totalRevenue", label: "Total Revenue", icon: HiOutlineCurrencyRupee, tone: "bg-amber-50 text-amber-600", prefix: "₹" },
  { key: "pendingOrders", label: "Pending Orders", icon: HiOutlineClock, tone: "bg-rose-50 text-rose-600" },
];

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminService.getDashboardStats();
        const data = res.data || {};
        setStats(data);
        setRecentOrders(data.recentOrders || []);
        setRecentUsers(data.recentUsers || []);
      } catch {
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your store's performance.</p>

      {loading ? (
        <div className="mt-10 flex justify-center"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {STAT_CARDS.map(({ key, label, icon: Icon, tone, prefix }) => (
              <div key={key} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {prefix || ""}
                  {(stats[key] ?? 0).toLocaleString()}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent orders */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Recent Orders</h2>
                <Link to="/admin/orders" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                  View all
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No recent orders</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.slice(0, 6).map((o) => (
                    <div key={o.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">#{o.id}</p>
                        <p className="text-xs text-gray-400">{o.user?.firstName || o.customerName || "Customer"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">₹{o.totalAmount}</p>
                        <Badge status={o.orderStatus} className="mt-1">{o.orderStatus}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent users */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Recent Users</h2>
                <Link to="/admin/users" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                  View all
                </Link>
              </div>
              {recentUsers.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">No recent users</p>
              ) : (
                <div className="space-y-3">
                  {recentUsers.slice(0, 6).map((u) => (
                    <div key={u.id} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {(u.firstName?.[0] || u.email?.[0] || "U").toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="truncate text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
