#!/usr/bin/env python3
"""Minimal dependency-free conformance checks for Trigger Protocol v0.1."""

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

def validate_receipt(r):
    if not REQUIRED.issubset(r):
        return False, "missing required field"
    if r["protocol"] != "trigger/0.1":
        return False, "unsupported protocol"
    if r["decision"] != "approve":
        return False, "not an execution authorization"
    if not all(isinstance(r[k], str) and r[k] for k in REQUIRED):
        return False, "required field is empty"
    if "expires_at" in r:
        expires = datetime.fromisoformat(r["expires_at"].replace("Z", "+00:00"))
        if expires <= datetime.now(timezone.utc):
            return False, "expired"
    return True, "ok"

def main():
    valid, reason = validate_receipt(load("valid-receipt.json"))
    assert valid, reason

    invalid, _ = validate_receipt(load("invalid-no-actor.json"))
    assert not invalid, "invalid fixture was accepted"

    print("Trigger Protocol v0.1 conformance: PASS")

if __name__ == "__main__":
    main()
