import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Boxes, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";
import userApi from "../api/userApi";
import { getErrorMessage } from "../api/axios";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    try {
      // The backend has no dedicated login endpoint, so we look the user
      // up via the existing GET /api/users list and check credentials on
      // the client. This is a convenience gate for the UI only — see
      // AuthContext for details on why it isn't real authentication.
      const { data: users } = await userApi.getAll();
      const match = users.find(
        (u) => u.username?.toLowerCase() === username.trim().toLowerCase() && u.password === password
      );

      if (!match) {
        setError("Invalid username or password.");
        return;
      }

      if (match.status && match.status.toUpperCase() !== "ACTIVE") {
        setError("This account is not active. Contact an administrator.");
        return;
      }

      login(match);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't reach the server. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-sm shadow-indigo-200">
            <Boxes size={22} />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">HRFlow</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage your organization</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
        >
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Input
            label="Username"
            name="username"
            placeholder="e.g. admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 pr-10 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <Button type="submit" icon={LogIn} loading={loading} className="w-full mt-2">
            Sign in
          </Button>

          <p className="text-center text-xs text-slate-400 pt-1">
            Uses your existing Users records for a demo sign-in — this app has no
            dedicated authentication backend.
          </p>
        </form>
      </div>
    </div>
  );
}
