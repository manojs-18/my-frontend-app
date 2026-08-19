import { Link, useNavigate } from "react-router-dom";
import { HiStar, HiOutlineTrash, HiOutlineShoppingCart } from "react-icons/hi";
import { useState } from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80";

const WishlistItem = ({ item }) => {
  const product = item.product || item;
  const { id, name, image, price, rating } = product;
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleRemove = async () => {
    setBusy(true);
    try {
      await removeFromWishlist(item.id);
    } finally {
      setBusy(false);
    }
  };

  const handleAddToCart = async () => {
    setBusy(true);
    try {
      await addToCart(id, 1);
      navigate("/cart");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <Link to={`/products/${id}`} className="aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={image || FALLBACK_IMG}
          alt={name}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3.5">
        <Link to={`/products/${id}`} className="line-clamp-2 text-sm font-semibold text-gray-800 hover:text-indigo-600">
          {name}
        </Link>
        {rating !== undefined && (
          <div className="mt-1 flex items-center gap-1">
            <HiStar className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs text-gray-500">{rating}</span>
          </div>
        )}
        <p className="mt-1.5 text-base font-bold text-gray-900">₹{price}</p>

        <div className="mt-auto flex gap-2 pt-3">
          <Button
            size="sm"
            fullWidth
            icon={HiOutlineShoppingCart}
            loading={busy}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <button
            onClick={handleRemove}
            disabled={busy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-red-500 hover:bg-red-50"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
