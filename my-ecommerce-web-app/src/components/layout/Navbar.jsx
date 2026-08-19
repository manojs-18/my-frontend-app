import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineMenu,
  HiX,
  HiChevronDown,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products", to: "/products" },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-sm">
            S
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-gray-900 sm:block">
            Shoply
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto hidden max-w-md flex-1 md:flex"
        >
          <div className="relative w-full">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm
                focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </form>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            to="/wishlist"
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Wishlist"
          >
            <HiOutlineHeart className="h-5.5 w-5.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Cart"
          >
            <HiOutlineShoppingBag className="h-5.5 w-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-2.5 text-gray-700 hover:bg-gray-100"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {(user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>
                <HiChevronDown className="hidden h-3.5 w-3.5 sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "My Account"}
                    </p>
                    <p className="truncate text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/addresses"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Addresses
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full border-t border-gray-100 px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <HiOutlineUser className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}

          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <HiX className="h-5.5 w-5.5" /> : <HiOutlineMenu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="relative mb-3">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
