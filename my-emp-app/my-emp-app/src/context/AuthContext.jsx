import { createContext, useContext, useEffect, useState } from "react";

/**
 * IMPORTANT: This is NOT real authentication.
 *
 * The backend does not expose a login/auth endpoint, Spring Security, or
 * JWT issuance. To let the dashboard be gated behind a login screen, we
 * check the entered credentials against the existing GET /api/users list
 * on the client, then remember the "logged in" user in localStorage.
 *
 * This does not protect any data — anyone can still call the REST APIs
 * directly. It only gives the SPA a login/logout flow. Add real backend
 * authentication (e.g. Spring Security + JWT) before using this in
 * production.
 */

const STORAGE_KEY = "ems_current_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (userRecord) => {
    // Never keep the password around in app state/storage.
    // eslint-disable-next-line no-unused-vars
    const { password, ...safeUser } = userRecord;
    setUser(safeUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
