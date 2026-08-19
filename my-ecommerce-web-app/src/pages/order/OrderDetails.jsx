import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineArrowLeft } from "react-icons/hi";
import orderService from "../../services/orderService";
import OrderItem from "../../components/order/OrderItem";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

const TRACKING_STAGES = ["PENDING", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
const STAGE_LABELS = {
  PENDING: "Ordered",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await orderService.getById(id);
        setOrder(res.data);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader fullScreen label="Loading order..." />;

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Order not found"
          action={<Button onClick={() => navigate("/orders")}>Back to Orders</Button>}
        />
      </div>
    );
  }

  const {
    orderStatus,
    paymentStatus,
    paymentMethod,
    createdAt,
    orderDate,
    totalAmount,
    items = [],
    address,
    shippingAddress,
    user,
  } = order;

  const isCancelled = orderStatus === "CANCELLED";
  const currentStageIndex = TRACKING_STAGES.indexOf(orderStatus);
  const shipTo = address || shippingAddress;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600">
        <HiOutlineArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{id}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on{" "}
            {new Date(createdAt || orderDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge status={orderStatus}>{orderStatus?.replaceAll("_", " ")}</Badge>
      </div>

      {/* Tracking timeline */}
      {!isCancelled && (
        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-sm font-semibold text-gray-900">Order Tracking</h2>
          <div className="flex items-center">
            {TRACKING_STAGES.map((stage, i) => (
              <div key={stage} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      i <= currentStageIndex ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i <= currentStageIndex ? <HiCheck className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`hidden text-center text-[11px] font-medium sm:block ${
                      i <= currentStageIndex ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {STAGE_LABELS[stage]}
                  </span>
                </div>
                {i < TRACKING_STAGES.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${i < currentStageIndex ? "bg-indigo-600" : "bg-gray-100"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Order Items</h2>
          {items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base font-bold text-gray-900">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          {shipTo && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                {shipTo.name}<br />
                {shipTo.address}, {shipTo.city}, {shipTo.state}<br />
                {shipTo.country} - {shipTo.pincode}<br />
                {shipTo.phone}
              </p>
            </div>
          )}

          {user && (
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Customer</h3>
              <p className="text-sm text-gray-600">
                {user.firstName} {user.lastName}<br />
                {user.email}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Payment</h3>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium text-gray-800">{paymentMethod || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <Badge status={paymentStatus}>{paymentStatus || "—"}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
