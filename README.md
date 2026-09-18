# Trigger Protocol

**A minimal, open protocol for putting an explicit authorization boundary between AI reasoning and real-world action.**

> Intelligence is not authority.  
> Recommendation is not authorization.  
> Authorization is not execution.

AI agents can reason, call tools, and take consequential actions. The dangerous step is the silent transition from “the model proposed this” to “the world changed.”

Trigger Protocol makes that boundary explicit.

## The core loop

```
PROPOSE → REVIEW → AUTHORIZE → EXECUTE → AUDIT → OUTCOME
```

An AI agent may produce a proposal. An authorized actor decides whether that proposal may become an action.

## Why a trigger?

A model can recommend. An agent can prepare. A system can verify. But consequential execution should have an explicit authorization event.

| Layer | Meaning |
|---|---|
| Proposal | What an AI/agent recommends |
| Review | Examination, modification, rejection, or second opinion |
| Authorization | Permission for a bounded action |
| Trigger | The explicit authorization event |
| Execution | The actual side effect |
| Audit | What happened and under which authority |
| Outcome | What resulted |

**A model output MUST NOT be treated as authorization.**

## Trigger Receipt

A Trigger Receipt is the portable representation of an authorization event. It records the protocol version, proposal, authorizing actor, authority, action, issue time, and optional scope, constraints, policy version, and expiry.

```json
{
  "receipt_id": "tr-001",
  "protocol": "trigger/0.1",
  "proposal_id": "deploy-001",
  "decision": "approve",
  "actor": "human:oncall",
  "authority": "production-release",
  "action": "deploy",
  "scope": "production",
  "constraints": {
    "environment": "production"
  },
  "policy_version": "release-policy/7",
  "issued_at": "2026-01-01T11:00:00Z",
  "expires_at": "2026-01-01T12:00:00Z"
}
```

A downstream executor can require a valid Trigger Receipt before accepting a consequential side effect. This is the core network-effect hypothesis: **the protocol becomes valuable when other systems can depend on it.**

## Design principles

1. **Intelligence is not authority.**
2. **Recommendation is not authorization.**
3. **Authorization is not execution.**
4. **Authority should be explicit and bounded.**
5. **Delegation should be scoped, expiring, and revocable.**
6. **Rejection, modification, deferral, and second opinions are first-class.**
7. **Irreversible actions require stronger gates than reversible actions.**
8. **Decisions should be auditable and linked to outcomes.**
9. **Governance itself should be versioned.**
10. **The protocol must remain vendor-neutral.**

## What this is

Trigger Protocol is intentionally **protocol-first, not product-first**.

It is open-source, vendor-neutral, language-neutral, machine-readable, composable, and designed for interoperability between agents, tools, and organizations.

It is not an LLM framework, centralized authority, AI alignment theory, or replacement for law or organizational governance.

The goal is narrower:

> Make the boundary between **AI capability** and **authorized action** explicit, portable, and verifiable.

## Quick start

Validate the example:

```bash
python bin/trigger-validate.py examples/trigger-receipt.json
```

Run conformance tests:

```bash
python conformance/test_conformance.py
```

No third-party Python packages are required.

## Repository structure

```
protocol/       JSON Schemas
conformance/    compatibility tests and fixtures
examples/       concrete protocol examples
concepts/       design concepts
proposals/      RFC-style proposals
bin/            minimal command-line utilities
```

Read next:

- [SPEC.md](SPEC.md) — normative protocol semantics
- [PRINCIPLES.md](PRINCIPLES.md) — design principles
- [THREAT_MODEL.md](THREAT_MODEL.md) — threat model
- [conformance/CONFORMANCE.md](conformance/CONFORMANCE.md) — compatibility requirements
- [ROADMAP.md](ROADMAP.md) — development roadmap
- [ADOPTION.md](ADOPTION.md) — adoption and network-effect strategy

## Network effect

The protocol is designed to start with one user and become more useful as implementations accumulate:

```
one person
   ↓
one agent
   ↓
one workflow
   ↓
one team
   ↓
multiple implementations
   ↓
interoperable decision network
```

The shared object is not a proprietary account or social graph. It is the **decision record and authorization boundary**.

If different agents and execution systems understand the same Trigger Receipt, an authorization can travel across implementations without requiring the same vendor, model, or platform.

## Status

**Experimental — v0.1**

Current foundation:
- proposal / authorization / execution separation
- machine-readable schemas
- Trigger Receipt
- minimal conformance tests
- CI validation
- authority, delegation, audit, dissent, and reversibility concepts

Next:
- signed Trigger Receipts
- stronger conformance vectors
- reference SDK
- MCP / agent adapters
- authority and delegation validation
- revocation mechanisms
- governance diff / replay

## License

CC0 1.0 Universal.

Use it, fork it, implement it, or build on it.

## Contributing

Small interoperable changes are preferred over feature accumulation.

If you implement Trigger Protocol in another language or agent framework, a conformance test and an example are more valuable than vendor-specific abstractions.
