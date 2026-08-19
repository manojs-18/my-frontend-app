import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLockClosed, HiPencil, HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const AdminProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await userService.updateProfile(form);
      updateUser(res.data?.user || { ...user, ...form });
      setMessage("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await userService.changePassword(pwForm);
      setMessage("Password changed successfully.");
      setChangingPw(false);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
      <p className="mt-1 text-sm text-gray-500">Manage your admin account settings.</p>

      {message && (
        <div className="mt-5 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-600">{message}</div>
      )}
      {error && (
        <div className="mt-5 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">{error}</div>
      )}

      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
              {(user?.firstName?.[0] || "A").toUpperCase()}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between border-t border-gray-100 pt-5">
            <h2 className="text-sm font-semibold text-gray-900">Personal Information</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                <HiPencil className="h-4 w-4" /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="First Name" icon={HiOutlineUser} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
              <Input label="Email" type="email" icon={HiOutlineMail} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Phone Number" icon={HiOutlinePhone} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              <div className="flex gap-3 pt-1">
                <Button variant="ghost" type="button" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="submit" loading={loading}>Save Changes</Button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-gray-400">First Name</dt><dd className="mt-0.5 text-sm font-medium text-gray-800">{user?.firstName || "—"}</dd></div>
              <div><dt className="text-xs text-gray-400">Last Name</dt><dd className="mt-0.5 text-sm font-medium text-gray-800">{user?.lastName || "—"}</dd></div>
              <div><dt className="text-xs text-gray-400">Email</dt><dd className="mt-0.5 text-sm font-medium text-gray-800">{user?.email || "—"}</dd></div>
              <div><dt className="text-xs text-gray-400">Phone</dt><dd className="mt-0.5 text-sm font-medium text-gray-800">{user?.phoneNumber || "—"}</dd></div>
            </dl>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Password</h2>
            {!changingPw && (
              <button onClick={() => setChangingPw(true)} className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                <HiPencil className="h-4 w-4" /> Change
              </button>
            )}
          </div>
          {changingPw ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input label="Current Password" type="password" icon={HiOutlineLockClosed} value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
              <Input label="New Password" type="password" icon={HiOutlineLockClosed} value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
              <Input label="Confirm New Password" type="password" icon={HiOutlineLockClosed} value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required />
              <div className="flex gap-3 pt-1">
                <Button variant="ghost" type="button" onClick={() => setChangingPw(false)}>Cancel</Button>
                <Button type="submit" loading={loading}>Update Password</Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-gray-500">••••••••••••</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-5 text-left hover:bg-red-100"
        >
          <HiOutlineLogout className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium text-red-600">Logout of Admin Console</span>
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
