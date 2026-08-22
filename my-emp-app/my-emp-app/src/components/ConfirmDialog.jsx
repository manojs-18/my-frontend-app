import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  tone = "danger",
}) {
  return (
    <Modal open={open} onClose={onClose} title="" width="sm">
      <div className="flex flex-col items-center text-center gap-3 -mt-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertTriangle size={22} />
        </div>
        <h3 className="text-base font-bold font-display text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant={tone === "danger" ? "dangerSolid" : "primary"}
          className="flex-1"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
