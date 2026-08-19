import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineDeviceMobile,
  HiOutlineOfficeBuilding,
  HiCheckCircle,
} from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const METHODS = [
  { id: "COD", label: "Cash on Delivery", icon: HiOutlineCash },
  { id: "UPI", label: "UPI", icon: HiOutlineDeviceMobile },
  { id: "CREDIT_CARD", label: "Credit Card", icon: HiOutlineCreditCard },
  { id: "DEBIT_CARD", label: "Debit Card", icon: HiOutlineCreditCard },
  { id: "NET_BANKING", label: "Net Banking", icon: HiOutlineOfficeBuilding },
];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addressId, total = cartTotal } = location.state || {};

  const [method, setMethod] = useState("COD");
  const [cardDetails, setCardDetails] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    setError("");
    setProcessing(true);
    try {
      const orderRes = await orderService.create({
        addressId,
        paymentMethod: method,
        items: cartItems.map((i) => ({
          productId: i.product?.id ?? i.productId,
          quantity: i.quantity,
        })),
      });
      const order = orderRes.data;

      await paymentService.createPayment({
        orderId: order.id,
        method,
        amount: total,
      });

      await clearCart();
      setPlacedOrder(order);
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <HiCheckCircle className="h-9 w-9 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Order Placed Successfully</h1>
        <p className="mt-2 text-sm text-gray-500">Thank you for your purchase!</p>

        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-5 text-left text-sm">
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Order ID</span>
            <span className="font-semibold text-gray-800">#{placedOrder.id}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-semibold text-emerald-600">
              {method === "COD" ? "Pending (COD)" : "Paid"}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-semibold text-gray-800">₹{total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" fullWidth onClick={() => navigate("/products")}>
            Continue Shopping
          </Button>
          <Button fullWidth onClick={() => navigate(`/orders/${placedOrder.id}`)}>
            View Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Payment</h1>

      {error && (
        <div className="mb-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Select Payment Method</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {METHODS.map(({ id, label, icon: Icon }) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                method === id ? "border-indigo-400 bg-indigo-50/50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="method"
                checked={method === id}
                onChange={() => setMethod(id)}
                className="h-4 w-4 accent-indigo-600"
              />
              <Icon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </label>
          ))}
        </div>

        {(method === "CREDIT_CARD" || method === "DEBIT_CARD") && (
          <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            />
            <Input
              label="Name on Card"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry (MM/YY)"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              />
              <Input
                label="CVV"
                type="password"
                maxLength={4}
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              />
            </div>
          </div>
        )}

        {method === "UPI" && (
          <div className="mt-5 border-t border-gray-100 pt-5">
            <Input
              label="UPI ID"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
          <div>
            <p className="text-xs text-gray-400">Total Payable</p>
            <p className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</p>
          </div>
          <Button size="lg" loading={processing} onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        Don't have an address selected? <Link to="/checkout" className="text-indigo-600 hover:underline">Go back to checkout</Link>
      </p>
    </div>
  );
};

export default Payment;
