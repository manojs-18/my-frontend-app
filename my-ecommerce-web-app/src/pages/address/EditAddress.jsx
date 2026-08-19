import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import addressService from "../../services/addressService";
import AddressForm from "./AddressForm";
import Loader from "../../components/common/Loader";

// Standalone edit-address page, available for a dedicated /addresses/:id/edit route if you wire one up.
const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    addressService
      .getById(id)
      .then((res) => setAddress(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await addressService.update(id, data);
      navigate("/addresses");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading address..." />;

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Address</h1>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <AddressForm
          initialData={address}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/addresses")}
          loading={saving}
        />
      </div>
    </div>
  );
};

export default EditAddress;
