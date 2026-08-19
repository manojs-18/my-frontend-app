const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80";

const OrderItem = ({ item }) => {
  const product = item.product || item;
  const { name, image } = product;
  const { quantity, price } = item;

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-3 last:border-0">
      <img
        src={image || FALLBACK_IMG}
        alt={name}
        onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-gray-800">{name}</p>
        <p className="text-xs text-gray-400">Qty: {quantity} × ₹{price}</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-gray-900">
        ₹{(price * quantity).toFixed(2)}
      </p>
    </div>
  );
};

export default OrderItem;
