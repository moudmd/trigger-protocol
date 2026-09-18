# Trigger Protocol

**A minimal, open protocol for putting an explicit authorization boundary between AI reasoning and real-world action.**

> Intelligence is not authority.  
> Recommendation is not authorization.  
> Authorization is not execution.

Trigger Protocol is built around a simple premise: **do not let intelligence silently become authority.** AI can reason, recommend, prepare, verify, and simulate. A consequential change to the world requires an explicit authorization boundary.

## The core loop

PROPOSE → REVIEW → DECIDE → TRIGGER → EXECUTE → OUTCOME

The Trigger is the boundary. The portable Trigger Receipt is the evidence that the boundary was crossed under a stated authority.

## Why this exists

The PSYCHO-PASS design question is deliberately reduced to a protocol primitive: a system may provide extremely powerful judgment support without becoming the legitimate authority that decides what humans or institutions must do. The protocol therefore separates intelligence, authority, decision, execution, and accountability.

It does not prescribe who should govern. It makes governance explicit and machine-checkable.

## Core vocabulary

Actor · Agent · Action · Resource · Proposal · Review · Decision · Authority · Delegation · Trigger · Receipt · Execution · Outcome · Evidence · Constraint · Policy · Revocation

See [protocol/vocabulary.md](protocol/vocabulary.md).

## The critical invariant

**A model output MUST NOT be treated as authorization.**

Likewise:

- a proposal is not a decision;
- a decision is not an execution;
- possession of a tool/API credential is not proof of protocol authority;
- successful execution does not retroactively legitimize unauthorized action;
- rejection, dissent, modification, and second opinions remain part of the record.

## Trigger Receipt

A Trigger Receipt is a portable authorization artifact:

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

A downstream executor can require a valid receipt before accepting a consequential side effect.

## Interoperability

The semantic core is transport-, vendor-, model-, language-, database-, and cloud-neutral. JSON/UTF-8 and JSON Schema Draft 2020-12 are the reference representation. HTTP, queues, files, MCP, A2A, and other transports may carry the records.

Interoperability does **not** imply trust. Each executor independently verifies authority, scope, constraints, delegation, validity, and references before execution.

See [protocol/interoperability.md](protocol/interoperability.md).

## Design principles

1. Intelligence is not authority.
2. Do not delegate the human decision itself.
3. The Trigger is a boundary.
4. Authority should be visible and bounded.
5. Delegation is scoped, expiring, and revocable.
6. Rejection, modification, deferral, dissent, and second opinion are first-class.
7. Irreversibility changes the gate.
8. Auditability is not surveillance.
9. Governance is versioned.
10. No single governance philosophy is assumed.
11. Interoperability creates the network.
12. Humans remain accountable for legitimate human decisions.

## Repository structure

protocol/       canonical schemas, vocabulary, interoperability
conformance/    portable compatibility vectors
examples/       concrete protocol examples
concepts/       design concepts
proposals/      RFC-style proposals
bin/            minimal command-line utilities

## Quick start

Validate the example:

    python bin/trigger-validate.py examples/trigger-receipt.json

Run conformance tests:

    python conformance/test_conformance.py

No third-party Python packages are required.

## Status

**Experimental — v0.2**

Implemented:
- canonical vocabulary and semantic invariants
- explicit proposal → decision → trigger → execution references
- portable Trigger Receipt
- authority and delegation primitives
- transport-neutral interoperability profile
- machine-readable schemas
- conformance vectors and CI

Next:
- signed receipts
- identity-binding profiles
- revocation registry profile
- authority graph and validation vectors
- decision replay / governance diff
- MCP and agent-framework adapters

## Network effect

The protocol is intentionally small. The network effect comes from independent systems recognizing the same boundary and accepting the same portable authorization artifact. One implementation can be useful alone; multiple implementations make the artifact portable.

The goal is not a centralized authority. The goal is a shared protocol for making authority explicit.

## License

CC0 1.0 Universal.
