#!/usr/bin/env python3
"""Dependency-free semantic conformance checks for Trigger Protocol v0.1."""

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FIX = ROOT / "fixtures"

REQUIRED = {
    "receipt_id", "protocol", "proposal_id", "decision",
    "actor", "authority", "action", "issued_at"
}

def load(name):
    return json.loads((FIX / name).read_text(encoding="utf-8"))

def validate_receipt(r, now=None):
    now = now or datetime.now(timezone.utc)

    if not REQUIRED.issubset(r):
        return False, "missing required field"
    if r["protocol"] != "trigger/0.1":
        return False, "unsupported protocol"
    if r["decision"] != "approve":
        return False, "not an execution authorization"
    if not all(isinstance(r[k], str) and r[k] for k in REQUIRED):
        return False, "required field is empty"

    try:
        issued = datetime.fromisoformat(r["issued_at"].replace("Z", "+00:00"))
    except ValueError:
        return False, "invalid issued_at"

    if issued > now:
        return False, "issued_at is in the future"

    if "expires_at" in r:
        try:
            expires = datetime.fromisoformat(r["expires_at"].replace("Z", "+00:00"))
        except ValueError:
            return False, "invalid expires_at"
        if expires <= issued:
            return False, "expires_at must be after issued_at"
        if expires <= now:
            return False, "expired"

    return True, "ok"

def main():
    now = datetime(2026, 9, 19, tzinfo=timezone.utc)

    valid, reason = validate_receipt(load("valid-receipt.json"), now)
    assert valid, reason

    invalid, _ = validate_receipt(load("invalid-no-actor.json"), now)
    assert not invalid, "invalid fixture was accepted"

    print("Trigger Protocol v0.1 conformance: PASS")

if __name__ == "__main__":
    main()
