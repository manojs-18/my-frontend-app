import { Link } from "react-router-dom";
import { HiMinus, HiPlus, HiOutlineTrash } from "react-icons/hi";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [busy, setBusy] = useState(false);

  const product = item.product || item;
  const { id, name, image, price } = product;
  const quantity = item.quantity;

  const changeQty = async (delta) => {
    const next = quantity + delta;
    if (next < 1) return;
    setBusy(true);
    try {
      await updateQuantity(item.id, next);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    try {
      await removeFromCart(item.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4 last:border-0">
      <Link to={`/products/${id}`} className="shrink-0">
        <img
          src={image || FALLBACK_IMG}
          alt={name}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          className="h-20 w-20 rounded-lg object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/products/${id}`}
          className="line-clamp-1 text-sm font-semibold text-gray-800 hover:text-indigo-600"
        >
          {name}
        </Link>
        <p className="mt-1 text-sm font-bold text-gray-900">₹{price}</p>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200">
            <button
              onClick={() => changeQty(-1)}
              disabled={busy || quantity <= 1}
              className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <HiMinus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => changeQty(1)}
              disabled={busy}
              className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <HiPlus className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={busy}
            className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
          >
            <HiOutlineTrash className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-gray-900">₹{(price * quantity).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CartItem;
