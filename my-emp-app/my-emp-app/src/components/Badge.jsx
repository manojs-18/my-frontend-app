const TONES = {
  slate: "bg-slate-100 text-slate-600",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-indigo-50 text-indigo-700",
};

// Maps common backend status strings to a visual tone automatically,
// so callers can just pass the raw status value.
const STATUS_TONE_MAP = {
  ACTIVE: "green",
  PRESENT: "green",
  APPROVED: "green",
  PAID: "green",
  INACTIVE: "slate",
  ABSENT: "red",
  REJECTED: "red",
  TERMINATED: "red",
  PENDING: "amber",
  LATE: "amber",
  "ON LEAVE": "blue",
};

export default function Badge({ children, tone }) {
  const resolvedTone =
    tone || STATUS_TONE_MAP[String(children).toUpperCase()] || "slate";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${TONES[resolvedTone]}`}
    >
      {String(children).toLowerCase()}
    </span>
  );
}
