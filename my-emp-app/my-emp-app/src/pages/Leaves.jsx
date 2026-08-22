import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Check, X as XIcon, Eye } from "lucide-react";
import DataTable from "../components/DataTable";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import LeaveFormModal from "../components/LeaveFormModal";
import { useToast } from "../context/ToastContext";
import { formatDate } from "../utils/formatDate";
import { getErrorMessage } from "../api/axios";

import leaveApi from "../api/leaveApi";
import employeeApi from "../api/employeeApi";

export default function Leaves() {
  const toast = useToast();

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [actionTarget, setActionTarget] = useState(null); // { leave, action: 'approve' | 'reject' }
  const [actioning, setActioning] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leaveRes, empRes] = await Promise.all([leaveApi.getAll(), employeeApi.getAll()]);
      setLeaves(leaveRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load leave requests."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const sorted = useMemo(
    () => [...leaves].sort((a, b) => (b.leaveId || 0) - (a.leaveId || 0)),
    [leaves]
  );

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await leaveApi.create(payload);
      toast.success("Leave request submitted successfully");
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to submit leave request."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await leaveApi.remove(deleteTarget.leaveId);
      toast.success("Leave request deleted successfully");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete leave request."));
    } finally {
      setDeleting(false);
    }
  };

  const handleAction = async () => {
    if (!actionTarget) return;
    setActioning(true);
    try {
      if (actionTarget.action === "approve") {
        await leaveApi.approve(actionTarget.leave.leaveId);
        toast.success("Leave request approved");
      } else {
        await leaveApi.reject(actionTarget.leave.leaveId);
        toast.success("Leave request rejected");
      }
      setActionTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update leave request."));
    } finally {
      setActioning(false);
    }
  };

  const columns = [
    {
      key: "employee",
      header: "Employee",
      render: (l) =>
        l.employee ? (
          <p className="font-semibold text-slate-800">
            {l.employee.firstName} {l.employee.lastName}
          </p>
        ) : (
          "—"
        ),
    },
    { key: "leaveType", header: "Type", render: (l) => l.leaveType || "—" },
    { key: "startDate", header: "Start Date", render: (l) => formatDate(l.startDate) },
    { key: "endDate", header: "End Date", render: (l) => formatDate(l.endDate) },
    { key: "status", header: "Status", render: (l) => <Badge>{l.status}</Badge> },
    {
      key: "actions",
      header: "Actions",
      render: (l) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewTarget(l)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="View leave request"
          >
            <Eye size={16} />
          </button>
          {l.status?.toUpperCase() === "PENDING" && (
            <>
              <button
                onClick={() => setActionTarget({ leave: l, action: "approve" })}
                className="rounded-lg p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                aria-label="Approve leave request"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => setActionTarget({ leave: l, action: "reject" })}
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                aria-label="Reject leave request"
              >
                <XIcon size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => setDeleteTarget(l)}
            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
            aria-label="Delete leave request"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button icon={Plus} onClick={() => setFormOpen(true)}>
          Apply for Leave
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sorted}
        keyField="leaveId"
        loading={loading}
        error={error}
        onRetry={load}
        emptyTitle="No leave requests yet"
        emptyDescription="Leave requests will appear here once submitted."
      />

      <LeaveFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        leave={null}
        employees={employees}
        saving={saving}
      />

      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Leave Request" width="sm">
        {viewTarget && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-400">Employee</p>
              <p className="text-slate-700 font-medium">
                {viewTarget.employee ? `${viewTarget.employee.firstName} ${viewTarget.employee.lastName}` : "—"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-slate-400">Type</p>
                <p className="text-slate-700">{viewTarget.leaveType || "—"}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <Badge>{viewTarget.status}</Badge>
              </div>
              <div>
                <p className="text-slate-400">Start Date</p>
                <p className="text-slate-700">{formatDate(viewTarget.startDate)}</p>
              </div>
              <div>
                <p className="text-slate-400">End Date</p>
                <p className="text-slate-700">{formatDate(viewTarget.endDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-400">Reason</p>
              <p className="text-slate-700">{viewTarget.reason || "—"}</p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this leave request?"
        description="This action cannot be undone."
      />

      <ConfirmDialog
        open={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={handleAction}
        loading={actioning}
        tone={actionTarget?.action === "approve" ? "primary" : "danger"}
        confirmLabel={actionTarget?.action === "approve" ? "Approve" : "Reject"}
        title={actionTarget?.action === "approve" ? "Approve this leave request?" : "Reject this leave request?"}
        description="The employee's leave status will be updated immediately."
      />
    </div>
  );
}
