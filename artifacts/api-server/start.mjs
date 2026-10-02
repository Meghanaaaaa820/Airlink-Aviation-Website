// Cross-platform replacement for the old shell one-liner in package.json:
//   if [ -f .env ]; then node --env-file=.env ... ; else node ... ; fi
// Works the same on Linux (Replit), macOS and Windows.
//
// Usage: node ./start.mjs [--dev]
//   --dev  sets NODE_ENV=development (unless NODE_ENV is already set)
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const args = ["--enable-source-maps", "./dist/index.mjs"];
if (existsSync(path.join(dir, ".env"))) args.unshift("--env-file=.env");

const env = { ...process.env };
if (process.argv.includes("--dev") && !env.NODE_ENV) env.NODE_ENV = "development";

const child = spawn(process.execPath, args, { cwd: dir, env, stdio: "inherit" });

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
