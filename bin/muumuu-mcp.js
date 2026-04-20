#!/usr/bin/env node
// Thin wrapper that runs `mcp-remote` against the Muumuu Domain MCP endpoint.
// Forwards any extra CLI args (e.g. --debug, --transport) to mcp-remote.

import { spawn } from "node:child_process";

const ENDPOINT = "https://mcp.muumuu-domain.com/mcp";
const extraArgs = process.argv.slice(2);

const child = spawn("npx", ["-y", "mcp-remote", ENDPOINT, ...extraArgs], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error(`[muumuu-mcp] failed to spawn mcp-remote: ${err.message}`);
  process.exit(1);
});
