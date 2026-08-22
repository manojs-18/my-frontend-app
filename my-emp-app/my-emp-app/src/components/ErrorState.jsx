import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ message = "Failed to load data.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
        <AlertTriangle size={22} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-700">Something went wrong</p>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
