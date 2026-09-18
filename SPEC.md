# Trigger Protocol Specification

Version: 0.1
Status: Experimental

## 1. Semantic model

A Trigger record separates Proposal, Review, Authorization, Trigger, Execution, and Outcome.

A model output MUST NOT be treated as authorization.

## 2. Authority

Authority is scoped by actor, action, resource/domain, limits, policy, validity period, and revocation state. Broad implicit authority should be avoided.

## 3. Risk and reversibility

Implementations SHOULD classify actions as low, medium, high, or critical risk and as reversible, partial, or irreversible. Higher impact and lower reversibility should normally require stronger authorization.

## 4. Rejection

Reject, modify, defer, and request-second-opinion are first-class decisions. The original proposal should remain linked to the decision.

## 5. Audit

An audit record should identify proposal, authorizing actor, authority, policy version, evidence, authorization, executor, action, and outcome. Cryptographic immutability is outside v0.1.

## 6. Delegation

Delegated authority MUST be explicit, bounded, and revocable. A delegation should specify grantor, grantee, scope, limits, validity, and revocation.

## 7. Appeals and reversal

Implementations MAY support appeal, second opinion, suspension, reversal, and rollback. These reference the original decision rather than erase it.

## 8. Versioning

Records identify protocol version. Governance policies have independent versions so historical decisions can be evaluated against the rules that existed at the time.

## 9. Interoperability

No model, language, database, cloud, or agent framework is required. JSON is the reference representation.