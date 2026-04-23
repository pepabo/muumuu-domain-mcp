#!/usr/bin/env node
// CLI entry for the Muumuu Domain MCP bridge.
//
// Default mode: transparent stdio bridge to https://mcp.muumuu-domain.com/mcp
// via `mcp-remote`. This is the mode every real MCP client should use.
//
// --introspect-only: serve a static manifest over stdio for MCP registries
// (e.g. Glama) that need to index the tool surface in a headless environment
// where an interactive OAuth flow cannot complete. No network calls, no
// Authorization header reading, tools/call is always rejected.

import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const ENDPOINT = "https://mcp.muumuu-domain.com/mcp";
const argv = process.argv.slice(2);

if (argv.includes("--introspect-only")) {
  const { createIntrospectServer } = await import("../lib/introspect.js");
  const { StdioServerTransport } = await import(
    "@modelcontextprotocol/sdk/server/stdio.js"
  );
  const server = createIntrospectServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
} else {
  const require = createRequire(import.meta.url);
  const mcpRemoteEntry = require.resolve("mcp-remote/dist/proxy.js");

  const child = spawn(process.execPath, [mcpRemoteEntry, ENDPOINT, ...argv], {
    stdio: "inherit",
    env: process.env,
  });

  for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(sig, () => {
      if (!child.killed) child.kill(sig);
    });
  }

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code ?? 0);
    }
  });

  child.on("error", (err) => {
    console.error(`[muumuu-mcp] failed to spawn mcp-remote: ${err.message}`);
    process.exit(1);
  });
}
