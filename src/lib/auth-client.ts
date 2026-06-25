import type { UserBundle } from "@/types/user";

export type { UserBundle };

export async function fetchMe(): Promise<UserBundle | null> {
  const res = await fetch("/api/auth/me");
  const data = await res.json();
  return data.user ?? null;
}

export async function login(
  email: string,
  password: string
): Promise<UserBundle> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Login failed");
  return data.user;
}

export async function register(
  email: string,
  password: string,
  displayName: string
): Promise<UserBundle> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, displayName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Registration failed");
  return data.user;
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}