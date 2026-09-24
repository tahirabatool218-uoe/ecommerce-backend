import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, registerRequest } from "../services/authService";
import { clearAuthStorage, getStoredUser, getToken, setAuthStorage } from "../utils/authStorage";

const AuthContext = createContext(null);

function readStoredAuth() {
  const token = getToken();
  const user = getStoredUser();
  return token && user ? { token, user } : { token: null, user: null };
}

export function AuthProvider({ children }) {
  // Read once, synchronously, on first render — no network round trip is
  // needed to know whether a token/user pair is already in storage.
  const [{ token, user }, setAuth] = useState(readStoredAuth);
  // Tracks in-flight login/register submissions.
  const [loading, setLoading] = useState(false);

  // If any request comes back 401 (invalid/expired token), drop the
  // session everywhere at once.
  useEffect(() => {
    function handleUnauthorized() {
      clearAuthStorage();
      setAuth({ token: null, user: null });
    }
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    try {
      const { user: loggedInUser, token: newToken } = await loginRequest({ email, password });
      setAuthStorage(newToken, loggedInUser);
      setAuth({ token: newToken, user: loggedInUser });
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    try {
      const { user: newUser, token: newToken } = await registerRequest({ name, email, password });
      setAuthStorage(newToken, newUser);
      setAuth({ token: newToken, user: newUser });
      return newUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
