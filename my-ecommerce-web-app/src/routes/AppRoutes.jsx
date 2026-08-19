import { Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "../components/layout/UserLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Public / user pages
import Home from "../pages/home/Home";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Profile from "../pages/user/Profile";
import Categories from "../pages/category/Categories";
import Products from "../pages/product/Products";
import ProductDetails from "../pages/product/ProductDetails";
import Cart from "../pages/cart/Cart";
import Wishlist from "../pages/wishlist/Wishlist";
import AddressList from "../pages/address/AddressList";
import AddAddress from "../pages/address/AddAddress";
import EditAddress from "../pages/address/EditAddress";
import Checkout from "../pages/checkout/Checkout";
import Payment from "../pages/checkout/Payment";
import Orders from "../pages/order/Orders";
import OrderDetails from "../pages/order/OrderDetails";
import NotFound from "../pages/NotFound";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminCategories from "../pages/admin/Categories";
import AdminProducts from "../pages/admin/Products";
import AdminOrders from "../pages/admin/Orders";
import AdminPayments from "../pages/admin/Payments";
import AdminProfile from "../pages/admin/AdminProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public + authenticated user routes, all under the storefront layout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/category/:id" element={<Products />} />

        {/* Requires login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/addresses" element={<AddressList />} />
          <Route path="/addresses/add" element={<AddAddress />} />
          <Route path="/addresses/:id/edit" element={<EditAddress />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>
      </Route>

      {/* Admin routes, separate layout, ADMIN role required */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
