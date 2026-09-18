# Trigger Protocol Conformance v0.1

An implementation claiming Trigger Protocol v0.1 compatibility should distinguish semantic validation from deployment-specific policy enforcement.

## Implemented by the reference runner

1. Accept a structurally valid Trigger Receipt.
2. Reject a receipt missing a required field.
3. Reject a non-approve decision as an execution authorization.
4. Reject an unsupported protocol version.
5. Reject an expired receipt.
6. Reject a receipt issued in the future.
7. Reject an invalid expiry relationship.

Run:

```bash
python conformance/test_conformance.py
```

## Required implementation semantics

A conforming implementation MUST also enforce, at execution time:

- the actor has the referenced authority;
- the authority covers the requested action and scope;
- delegated authority is valid and not revoked;
- the authorization is valid at the time of execution;
- the receipt identifier is preserved in execution/audit records.

These checks depend on the implementation's authority and delegation model and are therefore not yet encoded in the minimal fixture runner.

## Not yet standardized

Cryptographic signatures, identity binding, revocation registries, and interoperable authority-discovery mechanisms are intentionally deferred from v0.1.
