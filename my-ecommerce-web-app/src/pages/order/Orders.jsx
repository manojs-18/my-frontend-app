import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineClipboardList } from "react-icons/hi";
import orderService from "../../services/orderService";
import OrderCard from "../../components/order/OrderCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await orderService.getMyOrders();
        setOrders(res.data?.content || res.data || []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader fullScreen label="Loading your orders..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      <p className="mt-1 text-sm text-gray-500">Track and manage your orders.</p>

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={HiOutlineClipboardList}
            title="No orders yet"
            description="When you place an order, it will show up here."
            action={
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
