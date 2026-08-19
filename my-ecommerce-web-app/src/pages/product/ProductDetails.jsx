import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  HiStar,
  HiOutlineHeart,
  HiHeart,
  HiMinus,
  HiPlus,
  HiOutlineShoppingCart,
  HiChevronRight,
} from "react-icons/hi";
import productService from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productService.getById(id);
        setProduct(res.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader fullScreen label="Loading product..." />;

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or is unavailable."
          action={
            <Button onClick={() => navigate("/products")}>Back to Products</Button>
          }
        />
      </div>
    );
  }

  const { name, brand, category, price, originalPrice, rating, description, stock, image } = product;
  const inStock = stock === undefined || stock > 0;
  const inWishlist = isInWishlist(product.id);
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleWishlist = async () => {
    if (!isAuthenticated) return navigate("/login");
    setBusy(true);
    try {
      if (inWishlist) {
        const item = wishlistItems.find((w) => (w.product?.id ?? w.productId) === product.id);
        if (item) await removeFromWishlist(item.id);
      } else {
        await addToWishlist(product.id);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate("/login");
    setBusy(true);
    try {
      await addToCart(product.id, quantity);
    } finally {
      setBusy(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return navigate("/login");
    setBusy(true);
    try {
      await addToCart(product.id, quantity);
      navigate("/checkout");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-1.5 text-xs text-gray-400">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <HiChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-indigo-600">Products</Link>
        {category && (
          <>
            <HiChevronRight className="h-3 w-3" />
            <span className="text-gray-600">{typeof category === "string" ? category : category?.name}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50">
          <img
            src={image || FALLBACK_IMG}
            alt={name}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            className="h-full w-full object-cover"
          />
          {discount && (
            <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          {brand && <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{brand}</p>}
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{name}</h1>

          {rating !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">{rating} / 5</span>
            </div>
          )}

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900">₹{price}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
            )}
          </div>

          <div className="mt-3">
            <Badge status={inStock ? "IN_STOCK" : "OUT_OF_STOCK"}>
              {inStock ? `In Stock${stock ? ` (${stock} available)` : ""}` : "Out of Stock"}
            </Badge>
          </div>

          {description && (
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{description}</p>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Quantity</p>
            <div className="inline-flex items-center rounded-lg border border-gray-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <HiMinus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => (stock ? Math.min(stock, q + 1) : q + 1))}
                className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-50"
              >
                <HiPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              icon={HiOutlineShoppingCart}
              disabled={!inStock}
              loading={busy}
              onClick={handleAddToCart}
              className="flex-1"
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              disabled={!inStock}
              loading={busy}
              onClick={handleBuyNow}
              className="flex-1"
            >
              Buy Now
            </Button>
            <button
              onClick={handleWishlist}
              disabled={busy}
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center self-center rounded-lg border border-gray-200 hover:bg-gray-50 sm:self-auto"
            >
              {inWishlist ? (
                <HiHeart className="h-5 w-5 text-rose-500" />
              ) : (
                <HiOutlineHeart className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
