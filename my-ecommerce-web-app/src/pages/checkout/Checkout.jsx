import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiOutlineLocationMarker, HiOutlinePlus } from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import addressService from "../../services/addressService";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import AddressForm from "../address/AddressForm";

const STEPS = ["Delivery Address", "Order Summary", "Payment Method"];

const Checkout = () => {
  const { cartItems, cartTotal, loading: cartLoading } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await addressService.getAll();
      const list = res.data?.content || res.data || [];
      setAddresses(list);
      const def = list.find((a) => a.isDefault) || list[0];
      if (def) setSelectedAddressId(def.id);
    } catch {
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartLoading, cartItems, navigate]);

  const handleAddAddress = async (data) => {
    setSavingAddress(true);
    try {
      const res = await addressService.create(data);
      setAddModalOpen(false);
      await loadAddresses();
      if (res.data?.id) setSelectedAddressId(res.data.id);
    } finally {
      setSavingAddress(false);
    }
  };

  const deliveryFee = cartTotal > 999 ? 0 : 49;
  const total = cartTotal + deliveryFee;
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

      {/* Stepper */}
      <div className="mb-8 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i < step ? <HiCheck className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden text-xs font-medium sm:block ${i === step ? "text-gray-900" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-2 h-0.5 flex-1 ${i < step ? "bg-emerald-500" : "bg-gray-100"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Address */}
      {step === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Select Delivery Address</h2>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <HiOutlinePlus className="h-4 w-4" /> Add New
            </button>
          </div>

          {loadingAddresses ? (
            <Loader label="Loading addresses..." />
          ) : addresses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <HiOutlineLocationMarker className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">No saved addresses. Add one to continue.</p>
              <Button className="mt-4" onClick={() => setAddModalOpen(true)}>Add Address</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    selectedAddressId === addr.id
                      ? "border-indigo-400 bg-indigo-50/50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1 h-4 w-4 accent-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{addr.name} · {addr.phone}</p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {addr.address}, {addr.city}, {addr.state}, {addr.country} - {addr.pincode}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button disabled={!selectedAddressId} onClick={() => setStep(1)}>
              Continue to Order Summary
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Order Summary */}
      {step === 1 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Order Summary</h2>

          {selectedAddress && (
            <div className="mb-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">Deliver to: {selectedAddress.name}</p>
              <p>{selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => {
              const product = item.product || item;
              return (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{((product.price || item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span><span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span><span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => navigate("/payment", { state: { addressId: selectedAddressId, total } })}>
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Address"
      >
        <AddressForm onSubmit={handleAddAddress} onCancel={() => setAddModalOpen(false)} loading={savingAddress} />
      </Modal>
    </div>
  );
};

export default Checkout;
