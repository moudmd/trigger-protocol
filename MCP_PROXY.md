# MCP Proxy Adapter

Trigger Protocol can be inserted between an MCP client/agent and an existing MCP server without changing the server implementation.

## Architecture

```text
Agent / MCP Client
       |
       | JSON-RPC over stdio
       v
trigger-mcp-proxy
       |
       | JSON-RPC over stdio
       v
Existing MCP Server
```

The proxy is deliberately not an MCP server replacement. It is a transport-preserving middleware layer.

## Authorization semantics

For `tools/call` in gate mode:

```text
proposal
   -> review / decide
   -> trigger.receipt
   -> MCP tools/call
   -> execution
   -> outcome
```

The proxy verifies the receipt at the last possible boundary before the side effect reaches the MCP server.

The receipt should bind at least:

- the authorized action;
- the tool/scope;
- the validity interval;
- the authority;
- the decision;
- optionally the exact arguments.

The proxy does not create authority. It consumes an authorization artifact issued elsewhere.

## Why MCP first?

MCP is a practical insertion point because an agent already routes tool calls through a protocol boundary. A proxy can therefore demonstrate Trigger Protocol without requiring an agent framework rewrite.

The same semantic adapter can later be implemented for HTTP gateways, job queues, shell wrappers, robot controllers, and cloud control planes.

## Non-goals

- replacing MCP authentication;
- deciding organizational policy;
- proving the identity of the authorizing actor by itself;
- making a tool safe merely because it is behind the proxy;
- forcing a human click for every operation.

Human participation remains one possible governance implementation; the protocol's invariant is explicit authorization, not a universal UI.
