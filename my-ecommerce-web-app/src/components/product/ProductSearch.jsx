import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

const ProductSearch = ({ value, onSearch, placeholder = "Search products..." }) => {
  const [term, setTerm] = useState(value || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <HiOutlineSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm
          focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </form>
  );
};

export default ProductSearch;
