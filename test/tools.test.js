import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { tools } from "../lib/tools.js";

describe("tools manifest", () => {
  it("exposes exactly 11 tools (the full Muumuu Domain MCP surface)", () => {
    assert.equal(tools.length, 11);
  });

  it("includes every canonical tool name", () => {
    const names = tools.map((t) => t.name).sort();
    assert.deepEqual(names, [
      "create-me-dns-record",
      "delete-me-dns-record",
      "get-domain-purchase-status",
      "get-me-domain",
      "list-me-dns-records",
      "list-me-dns-records-by-fqdn",
      "list-me-domains",
      "purchase-domain",
      "quote-domain-purchase",
      "search-domains",
      "update-me-dns-record",
    ]);
  });

  it("has no duplicate tool names (TDQS: disambiguation)", () => {
    const names = tools.map((t) => t.name);
    const unique = new Set(names);
    assert.equal(unique.size, names.length);
  });

  it("every tool has a non-empty description (TDQS: purpose clarity)", () => {
    for (const t of tools) {
      assert.ok(t.description && t.description.length > 10, `tool ${t.name} has insufficient description`);
    }
  });

  it("every tool has a JSON-Schema inputSchema of type object", () => {
    for (const t of tools) {
      assert.equal(t.inputSchema.type, "object", `tool ${t.name} inputSchema must be object`);
    }
  });

  it("destructive tools are flagged with annotations.destructiveHint", () => {
    const destructive = new Set(["delete-me-dns-record", "purchase-domain"]);
    for (const t of tools) {
      if (destructive.has(t.name)) {
        assert.equal(
          t.annotations?.destructiveHint,
          true,
          `${t.name} must be flagged destructive`,
        );
      }
    }
  });

  it("read-only tools are flagged with annotations.readOnlyHint", () => {
    const readOnly = new Set([
      "search-domains",
      "list-me-domains",
      "get-me-domain",
      "list-me-dns-records",
      "list-me-dns-records-by-fqdn",
      "get-domain-purchase-status",
      "quote-domain-purchase",
    ]);
    for (const t of tools) {
      if (readOnly.has(t.name)) {
        assert.equal(t.annotations?.readOnlyHint, true, `${t.name} must be flagged read-only`);
      }
    }
  });

  it("search-domains requires q parameter", () => {
    const t = tools.find((x) => x.name === "search-domains");
    assert.deepEqual(t.inputSchema.required, ["q"]);
    assert.ok(t.inputSchema.properties.q);
  });

  it("get-me-domain validates domain-id pattern MU + 8 digits", () => {
    const t = tools.find((x) => x.name === "get-me-domain");
    assert.equal(t.inputSchema.properties["domain-id"].pattern, "^MU[0-9]{8}$");
  });

  it("create-me-dns-record has nested payload schema with required fqdn/type/value", () => {
    const t = tools.find((x) => x.name === "create-me-dns-record");
    assert.deepEqual(t.inputSchema.required, ["domain-id", "payload"]);
    const payload = t.inputSchema.properties.payload;
    assert.deepEqual(payload.required.sort(), ["fqdn", "type", "value"]);
  });

  it("purchase-domain requires purchase-token (short-lived, server-signed)", () => {
    const t = tools.find((x) => x.name === "purchase-domain");
    const payload = t.inputSchema.properties.payload;
    assert.deepEqual(payload.required, ["purchase-token"]);
  });
});
