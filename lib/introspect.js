// Introspection-only MCP server.
//
// Serves a static tool manifest over stdio (or any MCP transport) so that
// registries such as Glama can index the tool surface without the hosted
// server's OAuth flow. `tools/call` is always rejected with isError=true
// to guarantee this mode cannot be misused to reach real backend data or
// to leak an OAuth token.
//
// This is not a functional bridge. Use the default mode of
// `bin/muumuu-mcp.js` (which delegates to mcp-remote) for real requests.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { tools } from "./tools.js";

const SERVER_NAME = "muumuu-domain-mcp";
const SERVER_VERSION = "0.1.0";

export function createIntrospectServer() {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: {
        tools: {},
        prompts: {},
        resources: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  server.setRequestHandler(CallToolRequestSchema, async () => ({
    isError: true,
    content: [
      {
        type: "text",
        text:
          "This server is running in introspection-only mode and does not execute tool calls. " +
          "Connect to https://mcp.muumuu-domain.com/mcp with OAuth to call tools.",
      },
    ],
  }));

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({ prompts: [] }));
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: [] }));
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({ resourceTemplates: [] }));

  return server;
}
