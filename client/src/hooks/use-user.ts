import useSWR from "swr";
import type { User, InsertUser } from "db/schema";

export function useUser() {
  const { data, error, mutate } = useSWR<User, Error>("/api/user", {
    revalidateOnFocus: false,
  });

  return {
    user: data,
    isLoading: !error && !data,
    error,
    login: async (user: InsertUser) => {
      try {
        console.log("Attempting login for user:", user.username);
        const res = await handleRequest("/api/login", "POST", user);
        console.log("Login response:", res);
        mutate();
        return res;
      } catch (error) {
        console.error("Login error:", error);
        return { ok: false, message: "Network error occurred. Please try again." };
      }
    },
    logout: async () => {
      try {
        console.log("Attempting logout");
        const res = await handleRequest("/api/logout", "POST");
        console.log("Logout response:", res);
        mutate(undefined);
        return res;
      } catch (error) {
        console.error("Logout error:", error);
        return { ok: false, message: "Network error occurred. Please try again." };
      }
    },
    register: async (user: InsertUser) => {
      try {
        console.log("Attempting registration for user:", user.username);
        const res = await handleRequest("/api/register", "POST", user);
        console.log("Registration response:", res);
        mutate();
        return res;
      } catch (error) {
        console.error("Registration error:", error);
        return { ok: false, message: "Network error occurred. Please try again." };
      }
    },
  };
}

type RequestResult =
  | {
      ok: true;
      message?: string;
    }
  | {
      ok: false;
      message: string;
    };

async function handleRequest(
  url: string,
  method: string,
  body?: InsertUser
): Promise<RequestResult> {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Request failed:", url, data);
      return { ok: false, message: data.message || "An error occurred" };
    }

    return { ok: true, message: data.message };
  } catch (e: any) {
    console.error("Network error:", e);
    return { ok: false, message: "Network error occurred. Please try again." };
  }
}
