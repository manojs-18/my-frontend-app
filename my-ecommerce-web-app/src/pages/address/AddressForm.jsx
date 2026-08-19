import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

const AddressForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(initialData || emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    ["name", "phone", "address", "city", "state", "country", "pincode"].forEach((field) => {
      if (!form[field]?.toString().trim()) errs[field] = "Required";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
      </div>
      <Input label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} required />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} required />
        <Input label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Country" name="country" value={form.country} onChange={handleChange} error={errors.country} required />
        <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} required />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>Save Address</Button>
      </div>
    </form>
  );
};

export default AddressForm;
