import { Link } from "react-router-dom";
import { HiOutlineHeart } from "react-icons/hi";
import { useWishlist } from "../../context/WishlistContext";
import WishlistItem from "../../components/wishlist/WishlistItem";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";

const Wishlist = () => {
  const { wishlistItems, loading } = useWishlist();

  if (loading) return <Loader fullScreen label="Loading your wishlist..." />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
      <p className="mt-1 text-sm text-gray-500">
        {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
      </p>

      {wishlistItems.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={HiOutlineHeart}
            title="Your wishlist is empty"
            description="Save items you love and find them here anytime."
            action={
              <Link to="/products">
                <Button>Explore Products</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {wishlistItems.map((item) => (
            <WishlistItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
