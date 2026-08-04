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

### Introspection-only mode (registry tooling)

For MCP registries (e.g. Glama) that index the tool surface in a headless build environment where an interactive OAuth flow cannot complete, the CLI also supports a stdio-only introspection mode:

```bash
node bin/muumuu-mcp.js --introspect-only
```

In this mode the CLI serves the static [tool manifest](./lib/tools.js) over stdio. It does **not** make any network calls, does not read the `Authorization` header, and `tools/call` always returns `isError: true`. Do **not** use this mode for real traffic.

## Tools

The server exposes 14 tools. Tools marked **write** change account state; those marked **destructive** cannot be undone — clients should confirm with the user before calling them.

### Domain search & purchase

| Tool | Description |
| --- | --- |
| `search-domains` | Check availability and pricing of domain candidates across TLDs. Does not reserve anything. |
| `quote-domain-purchase` | Get a signed quote — final price, availability, and a short-lived purchase token — before buying. |
| `purchase-domain` | Execute a purchase with a quote token. **write / destructive** — charges the registered credit card. |
| `get-domain-purchase-status` | Poll the progress of a purchase started by `purchase-domain`. |

### Domain management

| Tool | Description |
| --- | --- |
| `list-me-domains` | List domains owned by the authenticated account, filtered by state or FQDN, paginated. |
| `get-me-domain` | Fetch one owned domain in full: contract period, auto-renewal status, nameservers. |
| `update-me-domain` | Turn credit-card auto-renewal on or off for an owned domain. **write** |

### DNS management

| Tool | Description |
| --- | --- |
| `list-me-dns-records` | List the DNS records of an owned domain, addressed by domain ID. |
| `list-me-dns-records-by-fqdn` | The same listing, addressed by FQDN when the domain ID is unknown. |
| `create-me-dns-record` | Add a record — A, AAAA, CNAME, MX, TXT, NS, ALIAS, SRV, or CAA. **write** |
| `update-me-dns-record` | Change the value or priority of an existing record. **write** |
| `delete-me-dns-record` | Remove a record from the zone. **write / destructive** |

### Personal access tokens

| Tool | Description |
| --- | --- |
| `list-me-personal-access-tokens` | List the personal access tokens issued for the account. |
| `delete-me-personal-access-token` | Revoke a personal access token. **write / destructive** |

## Documentation

- [Official MCP server guide (Japanese)](https://support.muumuu-domain.com/hc/ja/articles/50278568742803)
- [Service announcement (Japanese)](https://muumuu-domain.com/muumuu-domain-mcp/)
- [Press release (Japanese)](https://pepabo.com/news/information/202603311100/)

## Requirements

- A [Muumuu Domain](https://muumuu-domain.com/) account
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, OpenAI Codex CLI, Gemini CLI, etc.)

## Support

- For service-related inquiries: [Muumuu Domain Help Center](https://support.muumuu-domain.com/)
- For issues with this repository: please open a [GitHub Issue](https://github.com/pepabo/muumuu-domain-mcp/issues)

## License

[MIT](./LICENSE)
