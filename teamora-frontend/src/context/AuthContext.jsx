import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("teamora_token");
      const storedUser = localStorage.getItem("teamora_user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      localStorage.removeItem("teamora_token");
      localStorage.removeItem("teamora_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    const userInfo = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role
    };
    if (data.token) {
      localStorage.setItem("teamora_token", data.token);
      localStorage.setItem("teamora_user", JSON.stringify(userInfo));
      setToken(data.token);
      setUser(userInfo);
    }
    return userInfo;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.token) {
      const userInfo = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      };
      localStorage.setItem("teamora_token", data.token);
      localStorage.setItem("teamora_user", JSON.stringify(userInfo));
      setToken(data.token);
      setUser(userInfo);
      return userInfo;
    }
    // Return response indicating pending approval
    return {
      pendingApproval: true,
      message: data.message || "Registration successful! Your account is pending admin approval."
    };
  };

  const logout = () => {
    localStorage.removeItem("teamora_token");
    localStorage.removeItem("teamora_user");
    setToken(null);
    setUser(null);
  };

  const updateCurrentUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem("teamora_user", JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === "ADMIN",
        isTeamLeader: user?.role === "TEAM_LEADER",
        isTeamMember: user?.role === "TEAM_MEMBER",
        login,
        register,
        logout,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
