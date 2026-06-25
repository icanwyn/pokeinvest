import "server-only";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { STARTING_CASH } from "@/lib/manual-lessons";
import type { StockCard } from "@/types/card";
import type { PortfolioHolding } from "@/types/card";

const SESSION_COOKIE = "pokeinvest_session";
const SESSION_DAYS = 30;

function getAuthSecret(): string {
  return process.env.AUTH_SECRET ?? "pokeinvest-dev-secret";
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  return token;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return session.user;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function destroySession(token: string | undefined) {
  if (!token) return;
  await prisma.session.deleteMany({ where: { token } });
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string
) {
  const normalized = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) throw new Error("An account with this email already exists");

  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: {
      email: normalized,
      passwordHash,
      displayName: displayName.trim() || normalized.split("@")[0],
      cashBalance: STARTING_CASH,
    },
  });
}

export async function loginUser(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) throw new Error("Invalid email or password");

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) throw new Error("Invalid email or password");

  return user;
}

export function parseCardJson(json: string): StockCard {
  return JSON.parse(json) as StockCard;
}

export function holdingFromDb(
  ticker: string,
  quantity: number,
  cardJson: string
): PortfolioHolding {
  return { ...parseCardJson(cardJson), ticker, quantity };
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/** Used only to satisfy getAuthSecret import in builds — secret is env-based. */
void getAuthSecret;