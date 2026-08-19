import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await userService.login(credentials);
    // Expected shape: { token, user: {...} } — adjust to match your backend response.
    const { token, user: userData } = res.data;
    if (token) localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    return res.data;
  };

  const register = async (data) => {
    const res = await userService.register(data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
