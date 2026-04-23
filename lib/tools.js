// Static manifest of the Muumuu Domain MCP tools.
//
// This manifest is used exclusively by the introspection-only mode
// (`muumuu-mcp --introspect-only`) so that MCP registries (e.g. Glama)
// can index the tool surface without completing a browser-based OAuth
// authorization flow. The same tool names and schemas are served by the
// hosted MCP server at https://mcp.muumuu-domain.com/mcp for authenticated
// clients.

const DOMAIN_ID = {
  type: "string",
  description: "Domain ID issued by Muumuu Domain. Format: 'MU' followed by 8 digits (e.g. MU00000001).",
  pattern: "^MU[0-9]{8}$",
};

const DNS_RECORD_TYPE_ENUM = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "ALIAS", "SRV", "CAA"];

const PAGE = { type: "integer", minimum: 1, default: 1, description: "Page number (1-indexed)." };
const PAGE_SIZE = {
  type: "integer",
  minimum: 1,
  maximum: 100,
  default: 20,
  description: "Items per page (maximum 100).",
};

export const tools = [
  {
    name: "search-domains",
    description:
      "Check availability and pricing of one or more domain names across TLDs. Use this before suggesting a domain to purchase. Returns each candidate with its availability state and price in JPY. Does NOT reserve or purchase the domain.",
    annotations: { readOnlyHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["q"],
      properties: {
        q: {
          type: "string",
          description:
            "Search keyword. Either a full domain name with TLD (e.g. 'example.com') or a bare label without TLD (e.g. 'example'). When no TLD is present, specify the `tlds` parameter.",
        },
        tlds: {
          type: "array",
          items: { type: "string" },
          description:
            "Candidate TLDs to search when `q` omits the TLD (e.g. ['com', 'net', 'jp']). Ignored when `q` already contains a TLD. Defaults to a curated set of popular TLDs when omitted.",
        },
      },
    },
  },
  {
    name: "list-me-domains",
    description:
      "List domains owned by the authenticated account. Supports pagination and filtering by state or exact FQDN match. Use this to discover domain IDs needed by other tools (e.g. DNS management).",
    annotations: { readOnlyHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      properties: {
        fqdn: {
          type: "string",
          description: "Exact FQDN match filter (e.g. 'example.com'). When set, only that domain is returned.",
        },
        state: {
          type: "string",
          enum: ["active", "inactive", "pending-setup", "pending-transfer", "pending-bulk"],
          description:
            "Filter by domain lifecycle state: active | inactive | pending-setup (onboarding) | pending-transfer (transfer in progress) | pending-bulk (bulk-purchase queued).",
        },
        page: PAGE,
        "page-size": PAGE_SIZE,
      },
    },
  },
  {
    name: "get-me-domain",
    description:
      "Fetch full details of a single owned domain by its Muumuu domain ID, including contract period, auto-renewal status, and nameserver configuration.",
    annotations: { readOnlyHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["domain-id"],
      properties: { "domain-id": DOMAIN_ID },
    },
  },
  {
    name: "list-me-dns-records",
    description:
      "List DNS records for a specific owned domain (identified by domain ID). Supports filtering by record type or FQDN, with pagination. Read-only view of the authoritative zone.",
    annotations: { readOnlyHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["domain-id"],
      properties: {
        "domain-id": DOMAIN_ID,
        fqdn: {
          type: "string",
          description: "Exact FQDN match filter (trailing dot required, e.g. 'www.example.com.').",
          pattern: "^[a-zA-Z0-9._-]+$",
        },
        type: {
          type: "string",
          enum: DNS_RECORD_TYPE_ENUM,
          description: "Filter by DNS record type (A, AAAA, CNAME, MX, TXT, NS, ALIAS, SRV, CAA).",
        },
        page: PAGE,
        "page-size": PAGE_SIZE,
      },
    },
  },
  {
    name: "list-me-dns-records-by-fqdn",
    description:
      "List DNS records by specifying the owning domain as an FQDN instead of an internal domain ID. Use this when the caller only knows the domain name (e.g. 'example.com') and not its Muumuu domain ID.",
    annotations: { readOnlyHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["domain-fqdn"],
      properties: {
        "domain-fqdn": {
          type: "string",
          description: "FQDN of the target domain (exact match), e.g. 'example.com' or 'example.co.jp'.",
        },
        fqdn: {
          type: "string",
          description: "Optional: exact-match filter on the DNS record FQDN.",
          pattern: "^[a-zA-Z0-9._-]+$",
        },
        type: {
          type: "string",
          enum: DNS_RECORD_TYPE_ENUM,
          description: "Filter by DNS record type.",
        },
        page: PAGE,
        "page-size": PAGE_SIZE,
      },
    },
  },
  {
    name: "create-me-dns-record",
    description:
      "Create a new DNS record on an owned domain. Changes take effect on Muumuu's authoritative nameservers. Mutating operation: confirm intent with the user before calling.",
    annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["domain-id", "payload"],
      properties: {
        "domain-id": DOMAIN_ID,
        payload: {
          type: "object",
          description: "DNS record to create.",
          required: ["fqdn", "type", "value"],
          properties: {
            fqdn: {
              type: "string",
              description: "Fully-qualified domain name for the record (trailing dot required).",
              pattern: "^([a-zA-Z0-9_]([a-zA-Z0-9_-]{0,61}[a-zA-Z0-9_])?\\.)+$",
            },
            type: {
              type: "string",
              enum: DNS_RECORD_TYPE_ENUM,
              description: "DNS record type.",
            },
            value: {
              type: "string",
              description:
                "Record value. Format depends on `type`: IPv4 for A, IPv6 for AAAA, FQDN with trailing dot for CNAME/NS/MX/ALIAS, free-form string for TXT.",
            },
            priority: {
              type: "integer",
              format: "int32",
              minimum: 0,
              maximum: 65535,
              description: "Priority, required for MX records.",
            },
          },
        },
      },
    },
  },
  {
    name: "update-me-dns-record",
    description:
      "Update the value or priority of an existing DNS record. `fqdn`, `type`, and `ttl` are immutable — delete and recreate if those need to change. Mutating operation.",
    annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["domain-id", "record-id", "payload"],
      properties: {
        "domain-id": DOMAIN_ID,
        "record-id": { type: "integer", format: "int64", description: "DNS record ID (integer)." },
        payload: {
          type: "object",
          description: "Fields to update. Supply at least one of `value` or `priority`.",
          properties: {
            value: {
              type: "string",
              description: "New record value. Must match the original `type`'s format.",
            },
            priority: {
              type: "integer",
              format: "int32",
              minimum: 0,
              maximum: 65535,
              description: "New priority (MX records only).",
            },
          },
        },
      },
    },
  },
  {
    name: "delete-me-dns-record",
    description:
      "Permanently delete a DNS record from an owned domain. Destructive and NOT reversible — confirm with the user before calling.",
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["domain-id", "record-id"],
      properties: {
        "domain-id": DOMAIN_ID,
        "record-id": { type: "integer", format: "int64", description: "DNS record ID to delete." },
      },
    },
  },
  {
    name: "quote-domain-purchase",
    description:
      "Get a signed purchase quote for a domain before buying. Returns the final price, availability, credit-card registration state, and a short-lived `purchase-token` (valid ~10 minutes). **Always call this before `purchase-domain`** and present the price to the user.",
    annotations: { readOnlyHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["payload"],
      properties: {
        payload: {
          type: "object",
          required: ["fqdn"],
          properties: {
            fqdn: { type: "string", description: "Target domain name (e.g. 'example.com')." },
            term: {
              type: "integer",
              minimum: 1,
              maximum: 10,
              default: 1,
              description: "Registration term in years (1–10). Defaults to 1 year.",
            },
          },
        },
      },
    },
  },
  {
    name: "purchase-domain",
    description:
      "Execute a domain purchase using a `purchase-token` obtained from `quote-domain-purchase`. **This is a paid, irreversible operation.** Charges the registered credit card. Require explicit user confirmation of the quoted amount before calling. Returns a `purchase_id` to poll with `get-domain-purchase-status`.",
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["payload"],
      properties: {
        payload: {
          type: "object",
          required: ["purchase-token"],
          properties: {
            "purchase-token": {
              type: "string",
              description:
                "Signed token from `quote-domain-purchase`. Encodes domain, amount, and expiry — the server re-validates it. Expired tokens (>10 min) are rejected.",
            },
          },
        },
      },
    },
  },
  {
    name: "get-domain-purchase-status",
    description:
      "Poll the progress of a domain purchase started by `purchase-domain`. Use the `purchase_id` returned by that call to track state transitions (pending → processing → completed / failed).",
    annotations: { readOnlyHint: true, openWorldHint: true },
    inputSchema: {
      type: "object",
      required: ["purchase_id"],
      properties: {
        purchase_id: {
          type: "integer",
          description: "Purchase session ID returned by `purchase-domain`.",
        },
      },
    },
  },
];
