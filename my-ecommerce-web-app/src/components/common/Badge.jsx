const TONES = {
  gray: "bg-gray-100 text-gray-700",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  indigo: "bg-indigo-100 text-indigo-700",
  purple: "bg-purple-100 text-purple-700",
};

// Maps common backend status strings to a visual tone.
export const STATUS_TONE_MAP = {
  PENDING: "yellow",
  CONFIRMED: "blue",
  PROCESSING: "blue",
  SHIPPED: "indigo",
  OUT_FOR_DELIVERY: "purple",
  DELIVERED: "green",
  CANCELLED: "red",
  PAID: "green",
  FAILED: "red",
  REFUNDED: "gray",
  IN_STOCK: "green",
  LOW_STOCK: "yellow",
  OUT_OF_STOCK: "red",
  ACTIVE: "green",
  INACTIVE: "gray",
  BLOCKED: "red",
};

const Badge = ({ children, tone = "gray", status, className = "" }) => {
  const resolvedTone = status ? STATUS_TONE_MAP[status] || "gray" : tone;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap
        ${TONES[resolvedTone]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
