// Cross-platform replacement for the old `sh -c '...'` preinstall one-liner.
// 1. Removes npm/yarn lockfiles so only pnpm-lock.yaml is used.
// 2. Stops the install if it was not started with pnpm.
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
for (const file of ["package-lock.json", "yarn.lock"]) {
  fs.rmSync(path.join(root, file), { force: true });
}

const userAgent = process.env.npm_config_user_agent || "";
if (!userAgent.startsWith("pnpm/")) {
  console.error("Use pnpm instead");
  process.exit(1);
}
