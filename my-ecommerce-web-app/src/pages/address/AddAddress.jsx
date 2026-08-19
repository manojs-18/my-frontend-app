import { useNavigate } from "react-router-dom";
import { useState } from "react";
import addressService from "../../services/addressService";
import AddressForm from "./AddressForm";

// Standalone add-address page. AddressList also offers this via a modal;
// this page is available for a dedicated /addresses/add route if you wire one up.
const AddAddress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await addressService.create(data);
      navigate("/addresses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add New Address</h1>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <AddressForm onSubmit={handleSubmit} onCancel={() => navigate("/addresses")} loading={loading} />
      </div>
    </div>
  );
};

export default AddAddress;
