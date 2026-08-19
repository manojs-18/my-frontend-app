import { useEffect, useState } from "react";
import { HiOutlinePlus, HiOutlineLocationMarker, HiPencil, HiOutlineTrash, HiCheckCircle } from "react-icons/hi";
import addressService from "../../services/addressService";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import AddressForm from "./AddressForm";

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await addressService.getAll();
      setAddresses(res.data?.content || res.data || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (addr) => {
    setEditing(addr);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await addressService.update(editing.id, data);
      } else {
        await addressService.create(data);
      }
      setModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await addressService.delete(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id) => {
    await addressService.setDefault(id);
    await load();
  };

  if (loading) return <Loader fullScreen label="Loading addresses..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your delivery addresses.</p>
        </div>
        <Button icon={HiOutlinePlus} onClick={openAdd}>
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={HiOutlineLocationMarker}
          title="No addresses saved"
          description="Add an address to make checkout faster."
          action={<Button icon={HiOutlinePlus} onClick={openAdd}>Add Address</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-xl border bg-white p-5 shadow-sm ${
                addr.isDefault ? "border-indigo-300 ring-1 ring-indigo-100" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{addr.name}</p>
                  <p className="text-xs text-gray-400">{addr.phone}</p>
                </div>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-600">
                    <HiCheckCircle className="h-3.5 w-3.5" /> Default
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                {addr.address}, {addr.city}, {addr.state}, {addr.country} - {addr.pincode}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openEdit(addr)}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <HiPencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(addr)}
                  className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                >
                  <HiOutlineTrash className="h-3.5 w-3.5" /> Delete
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Address" : "Add New Address"}
      >
        <AddressForm
          initialData={editing}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Address"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" loading={saving} onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this address? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default AddressList;
