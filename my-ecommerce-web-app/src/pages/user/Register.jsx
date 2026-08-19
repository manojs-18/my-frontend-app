import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phoneNumber.replace(/\D/g, "")))
      errs.phoneNumber = "Enter a valid 10-digit phone number";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setApiError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join Shoply and start shopping today</p>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              icon={HiOutlineUser}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            icon={HiOutlineMail}
            required
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
            icon={HiOutlinePhone}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            icon={HiOutlineLockClosed}
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={HiOutlineLockClosed}
            required
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
