import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token) => {
    setLoading(true);
    localStorage.setItem("token", token);
    await fetchUser();
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Don't use window.location.href here — it causes a full page reload
    // (blank page on slow connections). ProtectedRoute will detect user=null
    // and render <Navigate to="/login" /> for an instant SPA redirect.
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, refreshUser: fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
