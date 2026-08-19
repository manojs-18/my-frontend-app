import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const registered = location.state?.registered;

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form);
      const redirectTo = location.state?.from?.pathname;
      if (data?.user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirectTo || "/");
      }
    } catch (err) {
      setApiError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Log in to continue to Shoply</p>
        </div>

        {registered && (
          <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-600">
            Account created successfully. Please log in.
          </div>
        )}
        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
            {apiError}
          </div>
        )}

        {showForgot ? (
          <ForgotPasswordForm onBack={() => setShowForgot(false)} />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                icon={HiOutlineLockClosed}
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 accent-indigo-600"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
                Log In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

const ForgotPasswordForm = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Wire this to userService.forgotPassword({ email }) once the backend endpoint is ready.
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600">
          If an account exists for <span className="font-medium">{email}</span>, a reset link
          has been sent.
        </p>
        <Button variant="secondary" fullWidth className="mt-5" onClick={onBack}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">
        Enter your email and we'll send you a link to reset your password.
      </p>
      <Input
        label="Email"
        name="forgotEmail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={HiOutlineMail}
        required
      />
      <div className="flex gap-3">
        <Button variant="ghost" type="button" fullWidth onClick={onBack}>
          Cancel
        </Button>
        <Button type="submit" fullWidth loading={loading}>
          Send Link
        </Button>
      </div>
    </form>
  );
};

export default Login;
