import { useRouter } from "next/router";
import { createContext, useState, useEffect, FC } from "react";
import { API_URL, NEXT_URL } from "../config";
import axios from "axios";

export interface IAuthContext {
  user: any;
  setUser: any;
  error: any;
  googleCallback: (values: any) => Promise<void>;
  register: (user: any) => Promise<void>;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: ({
    code,
    password,
  }: {
    code: string;
    password: string;
  }) => Promise<boolean>;
  forgotPassword: ({ email }: { email: string }) => Promise<boolean>;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, router.pathname]);

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
        const user = data.user;
        if (user?.confirmed) {
          setUser(user);
          let returnUrl = router.query?.returnUrl ?? "/";
          if (typeof returnUrl !== "string") returnUrl = returnUrl[0];
          router.push(returnUrl);
        } else {
          router.push("/account/notConfirmed");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message ?? error);
    }
  };

  // Callback for google login
  const googleCallback = async (values) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/google-callback`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const resultData = await res.json();

      if (res.ok && resultData.user) {
        setUser(resultData.user);
        let returnUrl = router.query?.returnUrl ?? "/";
        if (typeof returnUrl !== "string") returnUrl = returnUrl[0];
        router.push(returnUrl);
      } else {
        setError(resultData?.message);
      }
    } catch (error) {
      setError(error?.message ?? error);
    }
  };

  const forgotPassword = async ({ email }) => {
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: email,
      });
      return true;
    } catch (error) {
      setError(error.message ?? error);
      return false;
    }
  };

  const resetPassword = async ({ code, password }) => {
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        code: code,
        password: password,
        passwordConfirmation: password,
      });
      return true;
    } catch (error) {
      setError(error.message ?? error);
      return false;
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
        let returnUrl = router.query?.returnUrl ?? "/";
        if (typeof returnUrl !== "string") returnUrl = returnUrl[0];
        router.push(returnUrl);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error?.message ?? error);
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
    try {
      const res = await fetch(`${NEXT_URL}/api/user`);
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } finally {
      setLoadingInitial(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        googleCallback,
        register,
        login,
        logout,
        resetPassword,
        forgotPassword,
      }}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
