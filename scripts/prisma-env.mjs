import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env) || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

function quoteEnv(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function ensurePrismaEnv() {
  loadDotEnv();

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL is required for Prisma.");
    process.exit(1);
  }

  process.env.DATABASE_URL = databaseUrl;

  // Prisma reads .env from disk during schema validation — write it explicitly for Vercel.
  writeFileSync(
    resolve(process.cwd(), ".env"),
    `DATABASE_URL=${quoteEnv(databaseUrl)}\n`,
    "utf8"
  );
}

const mode = process.argv[2] ?? "generate";

function runProduction() {
  // Do not run migrations during Vercel build — Supabase poolers often block it.
  // Create tables once with scripts/supabase-init.sql in the Supabase SQL Editor.
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });
  execSync("next build", { stdio: "inherit", env: process.env });
}

const commands = {
  generate: "npx prisma generate",
  build: "npx prisma generate && next build",
};

ensurePrismaEnv();

if (mode === "production") {
  runProduction();
  process.exit(0);
}

const command = commands[mode];
if (!command) {
  console.error(`Unknown prisma-env mode: ${mode}`);
  process.exit(1);
}

execSync(command, { stdio: "inherit", env: process.env });