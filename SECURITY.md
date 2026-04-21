# Security Policy

GMO Pepabo, Inc. takes the security of our software products and services seriously, including this repository (`pepabo/muumuu-domain-mcp`) and the hosted MCP server at `https://mcp.muumuu-domain.com/mcp`.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please report them via email to **security@pepabo.com**.

To help us triage your report quickly, please include as much of the following information as you can:

- The type of issue (e.g., OAuth token leak, command injection, credential exposure, supply chain)
- Affected component (npm package `@pepabo/muumuu-mcp`, Docker image, hosted endpoint, or wrapper script)
- Full paths of source file(s) related to the issue
- Location of the affected code (branch/commit hash or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Response

We will acknowledge your report within a reasonable timeframe and keep you informed of the progress toward a fix. We appreciate coordinated disclosure and will credit reporters who wish to be acknowledged.

## Scope

This policy covers:

- Source code in this repository
- The published npm package `@pepabo/muumuu-mcp`
- Container images built from the `Dockerfile` in this repository
- The hosted MuuMuu Domain MCP endpoint at `https://mcp.muumuu-domain.com/mcp`

Issues outside this scope (e.g., the MuuMuu Domain website itself) should be reported through the relevant product channels at <https://muumuu-domain.com/>.
