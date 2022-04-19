import { useRouter } from "next/router";
import { createContext, useState, useEffect } from "react";
import { NEXT_URL } from "../config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Register user

  const register = async (user) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        router.push("/account/dashboard");
      } else {
        setError(data.message);
        setTimeout(() => setError(null), 10);
      }
    } catch (error) {
      setError(error?.message ?? error);
      setTimeout(() => setError(null), 10);
    }
  };

  // Login user

  const login = async ({ email, password }) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        router.push("/account/dashboard");
      } else {
        setError(data.message);
        setTimeout(() => setError(null), 10);
      }
    } catch (error) {
      setError(error?.message ?? error);
      setTimeout(() => setError(null), 10);
    }
  };

  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, { method: "POST" });

    if (res.ok) {
      setUser(null);
      router.push("/");
    }
  };
  // Check if user is logged in

  const checkUserLoggedIn = async () => {
    const res = await fetch(`${NEXT_URL}/api/user`);
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
