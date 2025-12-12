import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize from localStorage so refresh keeps user logged in
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("accessToken") || null
  );

  // Set axios header when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("accessToken", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("accessToken");
    }
  }, [token]);

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (credentials) => {
    const res = await api.post("auth/login/", credentials);
    const data = res.data;

    if (data.access) {
      // set token in state and axios headers
      setToken(data.access);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;

      // fetch current user profile
      try {
        const me = await api.get("auth/me/");
        setUser(me.data);
      } catch (err) {
        // If fetching profile fails, leave user as null
        console.error("Failed to fetch user profile after login:", err);
      }
    }

    return data;
  };

  const register = async (formData) => {
    return await api.post("auth/register/", formData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
