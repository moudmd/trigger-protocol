# Threat Model

Trigger Protocol assumes AI systems and execution environments can fail.

## Confused authority
An agent interprets a recommendation as permission.

Mitigation: separate proposal and authorization; require an explicit trigger.

## Excessive delegation
An agent receives broader authority than intended.

Mitigation: scoped delegation, limits, expiry, revocation.

## Prompt or tool injection
Untrusted content attempts to cause unauthorized action.

Mitigation: authorization must be evaluated independently of untrusted content and checked before execution.

## Audit tampering
Historical records are modified.

Mitigation: append-only storage, hashes, signatures, or external notarization can be layered on top.

## Automation bias
Humans approve recommendations without meaningful review.

Mitigation: expose evidence, uncertainty, alternatives, and dissent; support reject and second opinion.

## Stale authority
An authorization survives after circumstances change.

Mitigation: expiry, revocation, context constraints, and re-authorization.

## Outcome blindness
Actions are recorded without consequences.

Mitigation: link outcomes to decisions.

Out of scope: physical security, identity-provider security, legal compliance, model alignment, and organizational legitimacy.