# Trigger Protocol

**A minimal, open protocol for putting an explicit authorization boundary between AI reasoning and real-world action.**

> Intelligence is not authority.  
> Recommendation is not authorization.  
> Authorization is not execution.

Trigger Protocol is built around one rule: **do not let intelligence silently become authority.**

AI may reason, recommend, prepare, verify, and simulate. A consequential change to the world crosses an explicit authorization boundary.

## The model

```
PROPOSE → REVIEW → DECIDE → TRIGGER → EXECUTE → OUTCOME
                              │
                     authorization boundary
```

The Trigger is the boundary. A Trigger Receipt is portable evidence of that authorization event.

## Why this exists

Powerful AI systems make it increasingly easy for a recommendation to become an action without a visible transition between the two.

Trigger Protocol separates:

- **intelligence** — producing analysis, options, evidence, and recommendations;
- **authority** — who is entitled to authorize an action;
- **decision** — what was decided, including rejection, modification, deferral, and dissent;
- **trigger** — the explicit authorization event;
- **execution** — what an executor actually did;
- **outcome** — what happened afterward.

The protocol does **not** decide who should govern. It makes the conversion from decision to action explicit and machine-checkable.

## The critical invariant

**A model output MUST NOT be treated as authorization.**

Likewise:

- a proposal is not a decision;
- a decision is not an execution;
- a tool/API credential is not proof of protocol authority;
- a successful action does not retroactively legitimize an unauthorized action;
- rejection, dissent, modification, deferral, and second opinions remain durable records;
- an executor must independently enforce the authorization boundary.

## Trigger Receipt

A Trigger Receipt is the portable authorization artifact presented to an executor:

```json
{
  "id": "tr-001",
  "protocol": "trigger/0.2",
  "proposal_id": "deploy-001",
  "decision_id": "decision-001",
  "actor": "human:oncall",
  "authority_id": "production-release",
  "action": "deploy",
  "scope": "production",
  "issued_at": "2026-09-19T00:00:00Z",
  "expires_at": "2026-09-19T01:00:00Z"
}
```

A receipt is **evidence of an authorization event, not a source of authority by itself**. In a real deployment, the executor also needs a way to establish that the actor held the stated authority and that the referenced decision was actually approved.

## Try it in under a minute

### 1. Run the built-in harmless demo

Clone the repository:

```bash
git clone https://github.com/moudmd/trigger-protocol.git
cd trigger-protocol
```

Then run the proxy against the included MCP-like stdio demo server:

```bash
npx trigger-mcp-proxy \
  --mode gate \
  --receipt ./examples/mcp-demo-receipt.json \
  -- node ./examples/mcp-demo-server.mjs
```

The proxy is now between the client and the server. Only a `tools/call` authorized by the receipt is forwarded.

For an actual MCP client/server, the same insertion point is:

```text
AI agent / MCP client
        │
        ▼
trigger-mcp-proxy
        │
        ▼
existing MCP server
        │
        ▼
tool / external side effect
```

### 2. Wrap an existing MCP server

Transparent observation:

```bash
npx trigger-mcp-proxy -- npx -y <your-mcp-server> <args>
```

This is **observe mode**. It is deliberately non-enforcing so an existing integration can be instrumented without changing behavior.

Enforcement:

```bash
npx trigger-mcp-proxy \
  --mode gate \
  --receipt ./trigger-receipt.json \
  -- npx -y <your-mcp-server> <args>
```

Gate mode blocks an unauthorized `tools/call` before it reaches the upstream server.

> **Important:** observe mode is not a security boundary. Gate mode is the Trigger Protocol enforcement point.

## MCP adapter

The npm package `trigger-mcp-proxy` is intentionally small:

- zero runtime dependencies;
- Node.js 18+;
- stdio JSON-RPC pass-through;
- diagnostics on stderr;
- no shell interpolation of the upstream command;
- receipt-gated `tools/call`;
- optional exact-argument binding with SHA-256;
- no authority minting inside the proxy.

For consequential actions, bind the receipt to the exact invocation:

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

This prevents a receipt for one invocation from silently authorizing materially different arguments.

See [MCP_PROXY.md](MCP_PROXY.md) and [mcp-proxy/README.md](mcp-proxy/README.md).

## Interoperability

The semantic core is transport-, vendor-, model-, language-, database-, and cloud-neutral.

Reference representation:

- JSON / UTF-8
- JSON Schema Draft 2020-12
- transport-neutral records

HTTP, queues, files, MCP, A2A, and other transports may carry the records.

Interoperability does **not** imply trust. Each executor independently verifies authority, scope, constraints, delegation, validity, and references.

See [protocol/interoperability.md](protocol/interoperability.md).

## Core vocabulary

Actor · Agent · Action · Resource · Proposal · Review · Decision · Authority · Delegation · Trigger · Receipt · Execution · Outcome · Evidence · Constraint · Policy · Revocation

See [protocol/vocabulary.md](protocol/vocabulary.md).

## Design principles

1. Intelligence is not authority.
2. Do not delegate the human decision itself.
3. The Trigger is a boundary.
4. Authority is explicit, bounded, and visible.
5. Delegation is scoped, expiring, and revocable.
6. Rejection, modification, deferral, dissent, and second opinion are first-class.
7. Irreversibility changes the gate.
8. Auditability is not surveillance.
9. Governance is versioned.
10. No single governance philosophy is assumed.
11. Interoperability creates the network.
12. Humans remain accountable for legitimate decisions.

## Repository structure

```
protocol/       canonical schemas, vocabulary, interoperability
conformance/    portable compatibility vectors
examples/       runnable examples
concepts/       design concepts
proposals/      RFC-style proposals
bin/            minimal command-line utilities
mcp-proxy/      npm middleware implementation
```

## Development

```bash
python bin/trigger-validate.py examples/trigger-receipt.json
python conformance/test_conformance.py
npm test
npm pack --dry-run
```

No third-party runtime dependencies are required.

## Status

**Experimental — v0.2**

The semantic core and an MCP enforcement adapter are implemented. The MCP package is published independently as `trigger-mcp-proxy`.

The remaining trust-layer work includes:

- cryptographic receipt signatures;
- identity binding;
- authority/delegation validation graphs;
- revocation registry;
- stronger cross-object conformance vectors;
- decision replay and governance diff.

Until signed identity and authority profiles exist, this project should be treated as an experimental protocol and not as a complete security system.

## Network effect

The protocol is intentionally small.

The network effect comes from **independent systems recognizing the same authorization boundary and accepting the same portable artifact**. One implementation is useful alone; multiple independent implementations make the artifact portable.

The goal is not a centralized authority. The goal is a shared protocol for making authority explicit.

## License

CC0 1.0 Universal.
