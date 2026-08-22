import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        {description && <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
