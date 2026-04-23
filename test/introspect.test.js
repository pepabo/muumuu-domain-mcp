import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createIntrospectServer } from "../lib/introspect.js";
import { tools } from "../lib/tools.js";

describe("introspect-only MCP server", () => {
  let client;
  let server;

  before(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    server = createIntrospectServer();
    await server.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.0" }, { capabilities: {} });
    await client.connect(clientTransport);
  });

  after(async () => {
    await client?.close();
    await server?.close();
  });

  it("responds to initialize with server info identifying muumuu-domain-mcp", async () => {
    const info = client.getServerVersion();
    assert.equal(info?.name, "muumuu-domain-mcp");
    assert.ok(info?.version);
  });

  it("lists all 11 tools via tools/list", async () => {
    const result = await client.listTools();
    assert.equal(result.tools.length, 11);
    const names = result.tools.map((t) => t.name).sort();
    const expected = tools.map((t) => t.name).sort();
    assert.deepEqual(names, expected);
  });

  it("lists empty prompts (no prompts in introspect mode)", async () => {
    const result = await client.listPrompts();
    assert.deepEqual(result.prompts, []);
  });

  it("lists empty resources (no resources in introspect mode)", async () => {
    const result = await client.listResources();
    assert.deepEqual(result.resources, []);
  });

  it("tools/call always returns isError=true in introspect mode (no data access)", async () => {
    const result = await client.callTool({ name: "search-domains", arguments: { q: "example" } });
    assert.equal(result.isError, true);
    // Error content must not leak any real data
    const text = JSON.stringify(result.content);
    assert.ok(/introspection/i.test(text), "error must mention introspection mode");
  });

  it("tools/call for every tool returns isError=true (no partial implementation)", async () => {
    for (const t of tools) {
      const result = await client.callTool({ name: t.name, arguments: {} });
      assert.equal(result.isError, true, `${t.name} must be isError=true`);
    }
  });

  it("tools/call for an unknown tool also returns isError", async () => {
    const result = await client.callTool({ name: "nonexistent-tool", arguments: {} });
    assert.equal(result.isError, true);
  });
});
