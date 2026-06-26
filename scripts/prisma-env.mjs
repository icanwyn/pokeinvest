import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
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

function ensurePrismaEnv() {
  loadDotEnv();

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL is required for Prisma.");
    process.exit(1);
  }

  if (!process.env.DIRECT_URL?.trim()) {
    process.env.DIRECT_URL = databaseUrl;
    console.warn(
      "Warning: DIRECT_URL not set — using DATABASE_URL. For Supabase, add the direct (port 5432) connection string as DIRECT_URL in Vercel."
    );
  }
}

const mode = process.argv[2] ?? "generate";

const commands = {
  generate: "npx prisma generate",
  build: "npx prisma generate && next build",
  production: "npx prisma generate && npx prisma migrate deploy && next build",
};

const command = commands[mode];
if (!command) {
  console.error(`Unknown prisma-env mode: ${mode}`);
  process.exit(1);
}

ensurePrismaEnv();
execSync(command, { stdio: "inherit", env: process.env });