import { useRouter } from "next/router";
import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { API_URL, NEXT_URL } from "../config";
import axios from "axios";
import { User } from "api-definitions/backend";

export interface IAuthContext {
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  error?: string;
  token?: string;
  googleCallback: (values: any) => Promise<void>;
  facebookCallback: (values: any) => Promise<void>;
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

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState(undefined);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      setError(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, router.pathname]);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // Register user

  const register = async (user: User) => {
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
          setToken(data.token);
          let returnUrl = router.query?.returnUrl ?? "/";
          if (typeof returnUrl !== "string") returnUrl = returnUrl[0];
          router.push(returnUrl);
        } else {
          router.push("/account/notConfirmed");
        }
      } else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message ?? error);
    }
  };

  // Callback for google login
  const googleCallback = async (values: object) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/google-callback`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const resultData = await res.json();
      if (res.ok && resultData.user) {
        setUser(resultData.user);
        setToken(resultData.token);
        let returnUrl = router.query?.returnUrl ?? "/";
        if (typeof returnUrl !== "string") returnUrl = returnUrl[0];
        router.push(returnUrl);
      } else {
        setError(resultData?.message);
      }
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };

  // Callback for facebook login
  const facebookCallback = async (values: object) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/auth/facebook-callback`, {
        method: "POST",
        body: JSON.stringify(values),
      });
      const resultData = await res.json();
      if (res.ok && resultData.user) {
        setUser(resultData.user);
        setToken(resultData.token);
        let returnUrl = router.query?.returnUrl ?? "/";
        if (typeof returnUrl !== "string") returnUrl = returnUrl[0];
        router.push(returnUrl);
      } else {
        setError(resultData?.message);
      }
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };

  const forgotPassword = async ({ email }: { email: string }) => {
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: email,
      });
      return true;
    } catch (error: any) {
      setError(error.message ?? error);
      return false;
    }
  };

  const resetPassword = async ({
    code,
    password,
  }: {
    code: string;
    password: string;
  }) => {
    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        code: code,
        password: password,
        passwordConfirmation: password,
      });
      return true;
    } catch (error: any) {
      setError(error.message ?? error);
      return false;
    }
  };

  // Login user
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
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
        setToken(data.token);
        let returnUrl = router.query?.returnUrl ?? "/";
        if (typeof returnUrl !== "string") returnUrl = returnUrl[0];
        router.push(returnUrl);
      } else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };

  const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, { method: "POST" });

    if (res.ok) {
      setUser(undefined);
      setToken(undefined);
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
        setToken(data.token);
      } else {
        setUser(undefined);
        setToken(undefined);
      }
    } catch (err) {
      setUser(undefined);
      setToken(undefined);
    } finally {
      setLoadingInitial(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        error,
        googleCallback,
        facebookCallback,
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
