import ProductCard from "./ProductCard";
import { SkeletonCard } from "../common/Loader";
import EmptyState from "../common/EmptyState";
import { HiOutlineShoppingBag } from "react-icons/hi";

const ProductGrid = ({ products, loading, emptyMessage = "No products found" }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={HiOutlineShoppingBag}
        title={emptyMessage}
        description="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
