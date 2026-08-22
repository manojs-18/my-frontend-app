import { TableSkeleton } from "./Loading";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";

/**
 * columns: [{ key, header, render?: (row) => node, className? }]
 * data: array of row objects
 * keyField: string field name used as the React key
 */
export default function DataTable({
  columns,
  data,
  keyField = "id",
  loading = false,
  error = null,
  onRetry,
  emptyTitle = "No records found",
  emptyDescription,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          {!loading && !error && data.length > 0 && (
            <tbody>
              {data.map((row) => (
                <tr
                  key={row[keyField]}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-6 py-4 text-slate-700 ${col.className || ""}`}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {loading && <TableSkeleton columns={columns.length} />}

      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}

      {!loading && !error && data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
}
