# Muumuu Domain MCP Server

[日本語版 README はこちら / Japanese README](./README.ja.md)

The official remote [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for [Muumuu Domain](https://muumuu-domain.com/) — a domain registration service operated by [GMO Pepabo, Inc.](https://pepabo.com/)

Search and register domains, manage owned domains and contracts, and configure DNS records — all through natural language conversations with AI assistants.

> **First remote MCP server in the Japanese domain registrar industry.**

## Endpoint

```
https://mcp.muumuu-domain.com/mcp
```

Transport: Streamable HTTP. Authentication: OAuth 2.1 (handled automatically by supported clients).

## Features

- **Domain search & registration** — check availability, view pricing, register domains
- **Domain management** — list and inspect owned domains
- **DNS management** — list, create, update, and delete DNS records
- **Contract management** — review contract list (renewal dates, auto-renewal status) and details

Pricing: **MCP server access is free.** Standard Muumuu Domain registration fees apply when purchasing domains.

## Quick Start

Choose your client below.

### Claude Code

```bash
claude mcp add --transport http muumuu https://mcp.muumuu-domain.com/mcp
```

Then run `/mcp` inside Claude Code and select **Authenticate** to complete the OAuth flow.

[Claude Code MCP docs](https://docs.anthropic.com/en/docs/claude-code/mcp)

### Claude Desktop / claude.ai

Settings → Connectors → **Add custom connector** → enter:

```
https://mcp.muumuu-domain.com/mcp
```

OAuth is handled automatically by Claude.

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "muumuu": {
      "url": "https://mcp.muumuu-domain.com/mcp"
    }
  }
}
```

### OpenAI Codex CLI

```bash
codex mcp add muumuu --url https://mcp.muumuu-domain.com/mcp
```

### Gemini CLI

See the [Gemini CLI MCP server documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md) for adding remote MCP servers.

### Local stdio bridge (advanced)

For clients that only support stdio transport, use [`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "muumuu": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.muumuu-domain.com/mcp"]
    }
  }
}
```

Or use the bundled wrapper:

```json
{
  "mcpServers": {
    "muumuu": {
      "command": "npx",
      "args": ["-y", "@pepabo/muumuu-mcp"]
    }
  }
}
```

## Documentation

- [Official MCP server guide (Japanese)](https://support.muumuu-domain.com/hc/ja/articles/50278568742803)
- [Service announcement (Japanese)](https://muumuu-domain.com/muumuu-domain-mcp/)
- [Press release (Japanese)](https://pepabo.com/news/information/202603311100/)

## Requirements

- A [Muumuu Domain](https://muumuu-domain.com/) account
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, OpenAI Codex CLI, Gemini CLI, etc.)

## Support

- For service-related inquiries: [Muumuu Domain Help Center](https://support.muumuu-domain.com/)
- For issues with this repository: please open a [GitHub Issue](https://github.com/pepabo/muumuu-mcp/issues)

## License

[MIT](./LICENSE)
