export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://opulent-space-sniffle-vpvxp7r9v553x6wv-3000.app.github.dev/api/auth";

export type User = {
  username?: string;
  useremail?: string;
  email?: string;
  verified?: boolean;
  name?: string;
};

export type AuthResponse = {
  message?: string;
  user?: User;
  accessToken?: string;
  accesstoken?: string;
};

const ACCESS_TOKEN_KEY = "auth_access_token";

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredAccessToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearStoredAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function safeJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

async function requestWithFallback<T>(
  endpoints: string[],
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  let latestError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const headers = new Headers(options.headers || {});

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers.has("Content-Type")
      ) {
        headers.set("Content-Type", "application/json");
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });

      const data = await safeJson<T>(response);

      if (!response.ok) {
        throw new Error(
          (data as { message?: string })?.message ||
            (data as { error?: string })?.error ||
            "Request failed",
        );
      }

      return data;
    } catch (error) {
      latestError = error instanceof Error ? error : new Error("Request failed");
    }
  }

  throw latestError || new Error("Request failed");
}

export async function registerUser(payload: {
  username: string;
  email: string;
  password: string;
}) {
  return requestWithFallback<AuthResponse>(["/register"], {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string }) {
  return requestWithFallback<AuthResponse>(["/login"], {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(payload: { email: string; otp: string }) {
  return requestWithFallback<AuthResponse>(["/verify-email", "/email-verify"], {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshSession() {
  const token = getStoredAccessToken();

  return requestWithFallback<AuthResponse>(["/refresh-token", "/rotatetoken"], {
    method: "GET",
  }, token || undefined);
}

export async function logoutSession() {
  const token = getStoredAccessToken();

  return requestWithFallback<AuthResponse>(["/logout"], {
    method: "GET",
  }, token || undefined);
}

export async function logoutAllSessions() {
  const token = getStoredAccessToken();

  return requestWithFallback<AuthResponse>(["/logout-all"], {
    method: "GET",
  }, token || undefined);
}

export async function getCurrentUser() {
  const token = getStoredAccessToken();

  if (!token) {
    throw new Error("No access token found");
  }

  return requestWithFallback<{ message?: string; user?: User }>(["/get-me"], {
    method: "GET",
  }, token);
}
