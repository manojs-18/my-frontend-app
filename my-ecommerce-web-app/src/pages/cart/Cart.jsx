import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineArrowLeft } from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

const Cart = () => {
  const { cartItems, loading, cartTotal } = useCart();

  if (loading) return <Loader fullScreen label="Loading your cart..." />;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={HiOutlineShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start exploring our products."
          action={
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const deliveryFee = cartTotal > 999 ? 0 : 49;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/products" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600">
        <HiOutlineArrowLeft className="h-4 w-4" /> Continue shopping
      </Link>
      <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
      <p className="mt-1 text-sm text-gray-500">
        {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in your cart
      </p>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-2">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div>
          <CartSummary subtotal={cartTotal} deliveryFee={deliveryFee} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
