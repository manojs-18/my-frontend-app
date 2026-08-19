import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { HiOutlineFilter, HiX } from "react-icons/hi";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import ProductGrid from "../../components/product/ProductGrid";
import ProductFilter from "../../components/product/ProductFilter";
import ProductSearch from "../../components/product/ProductSearch";
import Pagination from "../../components/common/Pagination";

const PAGE_SIZE = 12;

const Products = () => {
  const { id: categoryIdFromRoute } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    categoryId: categoryIdFromRoute || searchParams.get("categoryId") || "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: searchParams.get("sort") || "",
  });
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.allSettled([
          productService.getAll({ size: 100 }),
          categoryService.getAll(),
        ]);
        if (prodRes.status === "fulfilled") {
          setAllProducts(prodRes.value.data?.content || prodRes.value.data || []);
        }
        if (catRes.status === "fulfilled") {
          setCategories(catRes.value.data?.content || catRes.value.data || []);
        }
      } catch {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (categoryIdFromRoute) {
      setFilters((f) => ({ ...f, categoryId: categoryIdFromRoute }));
    }
  }, [categoryIdFromRoute]);

  const brands = useMemo(
    () => [...new Set(allProducts.map((p) => p.brand).filter(Boolean))],
    [allProducts]
  );

  const filtered = useMemo(() => {
    let list = [...allProducts];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          (typeof p.category === "string" ? p.category : p.category?.name)
            ?.toLowerCase()
            .includes(q)
      );
    }
    if (filters.categoryId) {
      list = list.filter(
        (p) => String(p.category?.id ?? p.categoryId) === String(filters.categoryId)
      );
    }
    if (filters.brand) {
      list = list.filter((p) => p.brand === filters.brand);
    }
    if (filters.minPrice) {
      list = list.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      list = list.filter((p) => p.price <= Number(filters.maxPrice));
    }

    switch (filters.sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "new":
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "discount":
        list.sort(
          (a, b) =>
            (b.originalPrice ? b.originalPrice - b.price : 0) -
            (a.originalPrice ? a.originalPrice - a.price : 0)
        );
        break;
      default:
        break;
    }
    return list;
  }, [allProducts, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [filters, search]);

  const activeCategory = categories.find(
    (c) => String(c.id) === String(filters.categoryId)
  );

  const handleSearch = (term) => {
    setSearch(term);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      term ? p.set("search", term) : p.delete("search");
      return p;
    });
  };

  const clearFilters = () => {
    setFilters({ categoryId: "", brand: "", minPrice: "", maxPrice: "", sort: "" });
    setSearch("");
    setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "Loading products..." : `${filtered.length} products found`}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex-1">
          <ProductSearch value={search} onSearch={handleSearch} />
        </div>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 shadow-sm lg:hidden"
        >
          <HiOutlineFilter className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden lg:block">
          <ProductFilter
            categories={categories}
            brands={brands}
            filters={filters}
            onChange={setFilters}
            onClear={clearFilters}
          />
        </div>

        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <HiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <ProductFilter
                categories={categories}
                brands={brands}
                filters={filters}
                onChange={setFilters}
                onClear={clearFilters}
              />
            </div>
          </div>
        )}

        <div className="flex-1">
          <ProductGrid products={paginated} loading={loading} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
};

export default Products;
