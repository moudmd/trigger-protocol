# Trigger Protocol Interoperability

Version: 0.2
Status: Experimental

## Goal

Two independent implementations MUST be able to exchange a proposal, authorization, trigger receipt, and execution record without sharing a model vendor, programming language, database, cloud, or identity provider.

## Canonical representation

JSON using UTF-8 is the reference interchange representation. JSON Schema Draft 2020-12 is used for structural validation.

The wire format is transport-neutral. HTTP, queues, files, MCP, A2A, message buses, or other transports MAY carry the records.

## Identifier rules

Every protocol object has a stable id. IDs are opaque strings. Implementations MUST NOT infer authority, identity, scope, or trust from the syntax of an ID.

References MUST use the referenced object's ID, not a copied object, so a record remains linked to its source of authority.

## Envelope

Transport adapters SHOULD wrap protocol objects in an envelope:

{
  "protocol": "trigger/0.2",
  "type": "trigger.receipt",
  "id": "tr-001",
  "created_at": "2026-09-19T00:00:00Z",
  "body": {}
}

The envelope identifies the protocol and object type; it does not itself grant authority.

## Compatibility

A v0.2 implementation MUST accept canonical core fields, reject structurally invalid records, preserve unknown extension fields when forwarding records, preserve object IDs and references, distinguish approval from all non-approval decisions, enforce trigger validity at execution time, and expose enough information to determine the authority, scope, constraints, and validity interval used for execution.

Implementations MAY support additional protocol versions. They MUST NOT silently reinterpret a record from another version.

## Capability negotiation

Transports MAY advertise supported versions and object types. Capability discovery is not an authorization mechanism.

Example:

{
  "protocols": ["trigger/0.2"],
  "types": ["proposal", "decision", "trigger.receipt", "execution", "outcome"]
}

## Trust model

Interoperability does not imply trust. A receiving executor MUST independently verify the authority and constraints relevant to its own execution context.

Cryptographic signatures, identity federation, revocation registries, and transport authentication are profiles layered on the core protocol rather than assumptions of the semantic model.
