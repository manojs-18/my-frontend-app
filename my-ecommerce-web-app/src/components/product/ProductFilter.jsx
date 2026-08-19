const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "new", label: "Newest" },
];

const ProductFilter = ({
  categories = [],
  brands = [],
  filters,
  onChange,
  onClear,
}) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-64">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClear}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
        >
          Clear all
        </button>
      </div>

      {/* Sort */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
          Sort By
        </label>
        <select
          value={filters.sort || ""}
          onChange={(e) => update("sort", e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Category
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  name="category"
                  checked={String(filters.categoryId || "") === String(cat.id)}
                  onChange={() => update("categoryId", cat.id)}
                  className="h-3.5 w-3.5 accent-indigo-600"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Brand */}
      {brands.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
            Brand
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand} className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="radio"
                  name="brand"
                  checked={filters.brand === brand}
                  onChange={() => update("brand", brand)}
                  className="h-3.5 w-3.5 accent-indigo-600"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>
    </aside>
  );
};

export default ProductFilter;
