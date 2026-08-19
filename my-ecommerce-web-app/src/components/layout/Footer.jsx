import { Link } from "react-router-dom";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white">
                S
              </div>
              <span className="text-lg font-bold text-gray-900">Shoply</span>
            </div>
            <p className="max-w-xs text-sm text-gray-500">
              Everyday essentials and standout finds, delivered fast with a
              seamless shopping experience.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/products" className="hover:text-indigo-600">All Products</Link></li>
              <li><Link to="/categories" className="hover:text-indigo-600">Categories</Link></li>
              <li><Link to="/products?sort=new" className="hover:text-indigo-600">New Arrivals</Link></li>
              <li><Link to="/products?sort=discount" className="hover:text-indigo-600">Deals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Account</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/profile" className="hover:text-indigo-600">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-indigo-600">Order History</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-600">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-600">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <HiOutlineMail className="h-4 w-4 shrink-0" /> support@shoply.com
              </li>
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="h-4 w-4 shrink-0" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineLocationMarker className="h-4 w-4 shrink-0" /> Bengaluru, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Shoply. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-gray-400">
            <span className="cursor-pointer hover:text-gray-600">Privacy Policy</span>
            <span className="cursor-pointer hover:text-gray-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
