# Trigger Protocol Conformance v0.1

An implementation claiming Trigger Protocol v0.1 compatibility should pass the normative fixture tests.

## Required behavior

1. Accept a valid Trigger Receipt.
2. Reject a receipt missing required authority or actor.
3. Reject a non-approve receipt as an execution receipt.
4. Reject a receipt whose protocol version is unsupported.
5. Reject an expired receipt.
6. Reject a receipt whose action or scope exceeds the delegated authority.
7. Preserve the receipt identifier in execution/audit records.

The reference test runner is intentionally dependency-light and uses only the Python standard library.
