import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: null,
    success: null,
    error: null,
    user: null,
  });

  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const register = async (data) => {
    try {
      await axios.post("/api/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <AuthContext.Provider value={{ register }}>{children}</AuthContext.Provider>
  );
}

const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
