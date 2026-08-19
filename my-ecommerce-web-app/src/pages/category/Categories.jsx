import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineTag } from "react-icons/hi";
import categoryService from "../../services/categoryService";
import EmptyState from "../../components/common/EmptyState";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await categoryService.getAll();
        setCategories(res.data?.content || res.data || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">All Categories</h1>
      <p className="mt-1 text-sm text-gray-500">Browse products by category.</p>

      {loading ? (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={HiOutlineTag} title="No categories available" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-50">
                <img
                  src={cat.image || FALLBACK_IMG}
                  alt={cat.name}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800">{cat.name}</h3>
                {cat.productCount !== undefined && (
                  <p className="mt-0.5 text-xs text-gray-400">{cat.productCount} products</p>
                )}
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-1.5">
                  View Products <HiOutlineArrowRight className="h-3.5 w-3.5 transition-all" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
