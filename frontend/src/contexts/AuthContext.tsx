"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearStoredAccessToken,
  getCurrentUser,
  getStoredAccessToken,
  loginUser,
  logoutAllSessions,
  logoutSession,
  refreshSession,
  registerUser,
  setStoredAccessToken,
  verifyEmail,
  type User,
} from "@/lib/api";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  verify: (email: string, otp: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  loadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getStoredAccessToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.user ?? null);
    } catch {
      clearStoredAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginUser({ email, password });
      const token = response.accessToken ?? response.accesstoken;

      if (token) {
        setStoredAccessToken(token);
      }

      try {
        const profile = await getCurrentUser();
        setUser(profile.user ?? response.user ?? null);
      } catch {
        setUser(response.user ?? null);
      }

      router.push("/dashboard");
    },
    [router],
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      await registerUser({ username, email, password });
    },
    [],
  );

  const verify = useCallback(
    async (email: string, otp: string) => {
      await verifyEmail({ email, otp });
    },
    [],
  );

  const refreshToken = useCallback(async () => {
    try {
      const response = await refreshSession();
      const token = response.accessToken ?? response.accesstoken;

      if (token) {
        setStoredAccessToken(token);
      }

      const refreshedUser = await getCurrentUser();
      setUser(refreshedUser.user ?? null);
    } catch {
      clearStoredAccessToken();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } catch {
      // ignore backend errors in logout flow and clear the local session anyway
    } finally {
      clearStoredAccessToken();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const logoutAll = useCallback(async () => {
    try {
      await logoutAllSessions();
    } catch {
      // ignore backend errors in logout flow and clear the local session anyway
    } finally {
      clearStoredAccessToken();
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      verify,
      refreshToken,
      logout,
      logoutAll,
      loadUser,
    }),
    [loadUser, loading, login, logout, logoutAll, refreshToken, register, user, verify],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
