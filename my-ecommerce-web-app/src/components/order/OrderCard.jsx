import { Link } from "react-router-dom";
import { HiOutlineChevronRight } from "react-icons/hi";
import Badge from "../common/Badge";

const OrderCard = ({ order }) => {
  const { id, createdAt, orderDate, totalAmount, paymentStatus, orderStatus, items } = order;

  return (
    <Link
      to={`/orders/${id}`}
      className="block rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">Order ID</p>
          <p className="text-sm font-semibold text-gray-800">#{id}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Order Date</p>
          <p className="text-sm font-medium text-gray-700">
            {new Date(createdAt || orderDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-sm font-bold text-gray-900">₹{totalAmount}</p>
        </div>
        <div className="flex flex-col items-start gap-1.5 sm:items-end">
          <Badge status={orderStatus}>{orderStatus?.replaceAll("_", " ")}</Badge>
          {paymentStatus && (
            <span className="text-[11px] text-gray-400">Payment: {paymentStatus}</span>
          )}
        </div>
        <HiOutlineChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
      </div>

      {items?.length > 0 && (
        <p className="mt-3 truncate text-xs text-gray-400">
          {items.length} item{items.length > 1 ? "s" : ""} ·{" "}
          {items.map((i) => i.product?.name || i.name).join(", ")}
        </p>
      )}
    </Link>
  );
};

export default OrderCard;
