# trigger-mcp-proxy

A zero-dependency stdio middleware for inserting a Trigger Protocol authorization boundary into an existing MCP agent/server connection.

## One-command experience

Run an existing MCP server through the proxy:

```bash
npx trigger-mcp-proxy -- npx -y <your-mcp-server> <args>
```

The proxy speaks the same line-delimited JSON-RPC transport on stdin/stdout and keeps diagnostics on stderr, so it can be inserted without changing the agent's MCP integration.

## Modes

### Observe

Default. Every MCP message is forwarded unchanged. Tool calls are logged as structured authorization observations on stderr.

```bash
npx trigger-mcp-proxy -- npx -y <your-mcp-server>
```

This mode is for zero-friction adoption and instrumentation. It is **not** an enforcement boundary.

### Gate

Enforce the Trigger Protocol boundary for `tools/call`:

```bash
npx trigger-mcp-proxy \
  --mode gate \
  --receipt ./trigger-receipt.json \
  -- npx -y <your-mcp-server>
```

A tool call is forwarded only when the receipt:

- is `trigger/0.2`;
- has not expired or been revoked;
- has `action: "mcp.tools/call"`;
- covers the requested tool through `scope`;
- optionally matches the exact tool name;
- optionally matches a SHA-256 hash of the tool arguments.

Otherwise the proxy returns JSON-RPC error `-32001` and does not forward the call.

For a local, non-portable development exception:

```bash
npx trigger-mcp-proxy --mode gate --tool read_file -- npx -y <your-mcp-server>
```

This allowlist is deliberately labeled as a local exception; it is not a Trigger Receipt and should not be treated as protocol authority.

## Argument binding

For consequential tools, bind the receipt to the exact arguments:

```json
{
  "action": "mcp.tools/call",
  "scope": "delete_file",
  "extensions": {
    "https://trigger-protocol.org/ns/mcp-proxy": {
      "tool_name": "delete_file",
      "arguments_sha256": "<sha256 of canonical JSON arguments>"
    }
  }
}
```

The hash is calculated over canonical JSON with object keys sorted recursively. This prevents a valid receipt for one invocation from silently authorizing a materially different invocation.

## Security boundary

The proxy does not decide whether a proposal is substantively correct. It enforces the narrower protocol question:

**Was this concrete MCP action explicitly authorized under a valid Trigger Receipt?**

The proxy also does not treat possession of the MCP server process, model, API credential, or tool definition as authority.

## Scope

v0.1 intentionally gates `tools/call`. Resources, prompts, sampling, elicitation, and other MCP methods are passed through unchanged. Future adapters can extend the same authorization boundary to those operations.

## Development

No third-party runtime dependencies are required.

```bash
node bin/trigger-mcp-proxy.mjs --help
```

The package is designed to be published to npm as `trigger-mcp-proxy`.
