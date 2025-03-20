"use client";

import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router"; // For Pages-based projects
import axios from "axios";

// Fallback function to decode JWT manually
function simpleJwtDecode(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT manually:", error);
    throw error;
  }
}

// Helper function to decode a JWT using dynamic import with fallback
async function decodeToken(token) {
  try {
    const jwtModule = await import("jwt-decode");
    const jwtDecodeFunction = jwtModule.default;
    if (typeof jwtDecodeFunction === "function") {
      return jwtDecodeFunction(token);
    } else {
      console.error("jwtModule.default is not a function. Falling back to simpleJwtDecode.");
      return simpleJwtDecode(token);
    }
  } catch (error) {
    console.error("Error dynamically importing jwt-decode:", error);
    console.error("Falling back to simpleJwtDecode.");
    return simpleJwtDecode(token);
  }
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      (async () => {
        try {
          console.log("Token found in localStorage:", token);
          const decoded = await decodeToken(token);
          console.log("Decoded token:", decoded);
          setUser(decoded);
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
        }
        setLoading(false);
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    console.log("Attempting login with username:", username);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}token/`, // Constructs URL like "http://localhost:8000/api/token/"
        { username, password }
      );
      console.log("Login successful. Response:", response.data);
      const token = response.data.access;
      localStorage.setItem("token", token);
      console.log("Stored token:", token);
      const decoded = await decodeToken(token);
      console.log("Decoded token after login:", decoded);
      setUser(decoded);
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid credentials!");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
