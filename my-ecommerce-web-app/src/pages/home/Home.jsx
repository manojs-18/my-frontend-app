import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineArrowRight,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineRefresh,
  HiOutlineSupport,
} from "react-icons/hi";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import ProductGrid from "../../components/product/ProductGrid";

const PERKS = [
  { icon: HiOutlineTruck, title: "Free Shipping", desc: "On orders over ₹999" },
  { icon: HiOutlineShieldCheck, title: "Secure Payment", desc: "100% protected checkout" },
  { icon: HiOutlineRefresh, title: "Easy Returns", desc: "7-day return policy" },
  { icon: HiOutlineSupport, title: "24/7 Support", desc: "Dedicated help desk" },
];

const CATEGORY_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.allSettled([
          categoryService.getAll(),
          productService.getAll({ size: 12 }),
        ]);

        if (catRes.status === "fulfilled") {
          setCategories(catRes.value.data?.content || catRes.value.data || []);
        }
        if (prodRes.status === "fulfilled") {
          const products = prodRes.value.data?.content || prodRes.value.data || [];
          setFeatured(products.slice(0, 8));
          setNewArrivals(products.slice(8, 16).length ? products.slice(8, 16) : products.slice(0, 8));
        }
      } catch {
        // handled by empty states below
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:px-8">
          <div>
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              New Season Arrivals
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              Shop the styles <br className="hidden sm:block" />
              you'll actually wear.
            </h1>
            <p className="mt-4 max-w-md text-base text-gray-500">
              Curated essentials, honest prices, and fast delivery — everything
              you need for everyday life, in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg"
              >
                Shop Now <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Browse Categories
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/60 to-violet-200/60 blur-2xl" />
            <img
              src="/src/assets/hero.png"
              alt="Shop the latest collection"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80";
              }}
              className="mx-auto aspect-[4/3] w-full max-w-md rounded-3xl object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                <Icon className="h-5.5 w-5.5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/categories" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            View all
          </Link>
        </div>
        {categories.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={cat.image || CATEGORY_FALLBACK_IMG}
                  alt={cat.name}
                  onError={(e) => (e.currentTarget.src = CATEGORY_FALLBACK_IMG)}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-50 transition-transform group-hover:scale-110"
                />
                <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            View all
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} emptyMessage="No featured products yet" />
      </section>

      {/* Discount banner */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h3 className="text-2xl font-bold">Up to 40% off select items</h3>
            <p className="mt-1 text-sm text-indigo-100">
              Limited-time deals across categories. Don't miss out.
            </p>
          </div>
          <Link
            to="/products?sort=discount"
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-md hover:bg-indigo-50"
          >
            Shop the Sale
          </Link>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
          <Link to="/products?sort=new" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
            View all
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loading} emptyMessage="No new arrivals yet" />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-8 py-12 text-center">
          <h3 className="text-xl font-bold text-gray-900">Ready to find your next favorite thing?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            Join thousands of happy shoppers and get access to exclusive deals.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Create an Account <HiOutlineArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
