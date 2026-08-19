const SIZES = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };

export const Spinner = ({ size = "md", className = "" }) => (
  <svg
    className={`animate-spin text-indigo-600 ${SIZES[size]} ${className}`}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Loader = ({ fullScreen = false, label = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-gray-500">{label}</p>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-center gap-3 py-10">
      <Spinner size="md" />
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
};

// Skeleton card for grid loading states (products, orders, etc.)
export const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
    <div className="mb-3 aspect-square w-full rounded-lg bg-gray-200" />
    <div className="mb-2 h-3.5 w-3/4 rounded bg-gray-200" />
    <div className="mb-3 h-3 w-1/2 rounded bg-gray-200" />
    <div className="h-4 w-1/3 rounded bg-gray-200" />
  </div>
);

export const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-gray-100">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="px-4 py-4">
        <div className="h-3.5 w-full rounded bg-gray-200" />
      </td>
    ))}
  </tr>
);

export default Loader;
