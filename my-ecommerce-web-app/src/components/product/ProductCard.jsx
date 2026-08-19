import { Link, useNavigate } from "react-router-dom";
import { HiHeart, HiOutlineHeart, HiStar, HiOutlineShoppingCart } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useState } from "react";
import Badge from "../common/Badge";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80";

const ProductCard = ({ product }) => {
  const { id, name, brand, category, price, originalPrice, rating, image, stock } = product;
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const inStock = stock === undefined || stock > 0;
  const inWishlist = isInWishlist(id);
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    setBusy(true);
    try {
      if (inWishlist) {
        const item = wishlistItems.find(
          (w) => (w.product?.id ?? w.productId) === id
        );
        if (item) await removeFromWishlist(item.id);
      } else {
        await addToWishlist(id);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");
    setBusy(true);
    try {
      await addToCart(id, 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link
      to={`/products/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white
        shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={image || FALLBACK_IMG}
          alt={name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-rose-500 px-2 py-1 text-[11px] font-bold text-white shadow">
            -{discount}%
          </span>
        )}
        <button
          onClick={handleWishlist}
          disabled={busy}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm hover:bg-white"
        >
          {inWishlist ? (
            <HiHeart className="h-4.5 w-4.5 text-rose-500" />
          ) : (
            <HiOutlineHeart className="h-4.5 w-4.5 text-gray-500" />
          )}
        </button>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Badge status="OUT_OF_STOCK">Out of Stock</Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        {category && (
          <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-indigo-500">
            {typeof category === "string" ? category : category?.name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">{name}</h3>
        {brand && <p className="mt-0.5 text-xs text-gray-400">{brand}</p>}

        {rating !== undefined && (
          <div className="mt-1.5 flex items-center gap-1">
            <HiStar className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-gray-600">{rating}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">₹{price}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!inStock || busy}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600
              transition-colors hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Add to cart"
          >
            <HiOutlineShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
