import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

const CartSummary = ({
  subtotal,
  deliveryFee = 0,
  discount = 0,
  showCheckoutButton = true,
}) => {
  const navigate = useNavigate();
  const total = subtotal + deliveryFee - discount;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Order Summary</h3>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Fee</span>
          <span className="font-medium text-gray-800">
            {deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Discount</span>
            <span className="font-medium">-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="my-1 border-t border-gray-200" />
        <div className="flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Button
          fullWidth
          size="lg"
          className="mt-5"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
