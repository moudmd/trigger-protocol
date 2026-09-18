#!/usr/bin/env python3
"""Validate a Trigger Receipt without external dependencies."""

import json
import sys
from datetime import datetime, timezone

REQUIRED = [
    "receipt_id", "protocol", "proposal_id", "decision",
    "actor", "authority", "action", "issued_at"
]

def error(message):
    print(f"INVALID: {message}", file=sys.stderr)
    raise SystemExit(1)

def main():
    if len(sys.argv) != 2:
        print("usage: trigger-validate.py RECEIPT.json", file=sys.stderr)
        raise SystemExit(2)

    try:
        with open(sys.argv[1], encoding="utf-8") as f:
            r = json.load(f)
    except Exception as exc:
        error(f"cannot read JSON: {exc}")

    for key in REQUIRED:
        if key not in r or not isinstance(r[key], str) or not r[key]:
            error(f"missing or empty field: {key}")

    if r["protocol"] != "trigger/0.1":
        error("unsupported protocol")

    if r["decision"] != "approve":
        error("receipt is not an approval")

    try:
        issued = datetime.fromisoformat(r["issued_at"].replace("Z", "+00:00"))
    except ValueError:
        error("invalid issued_at")

    if issued > datetime.now(timezone.utc):
        error("issued_at is in the future")

    if "expires_at" in r:
        try:
            expires = datetime.fromisoformat(r["expires_at"].replace("Z", "+00:00"))
        except ValueError:
            error("invalid expires_at")
        if expires <= datetime.now(timezone.utc):
            error("receipt has expired")

    print("VALID: Trigger Protocol v0.1 approval")
    print(f"receipt_id={r['receipt_id']}")
    print(f"action={r['action']}")
    print(f"authority={r['authority']}")

if __name__ == "__main__":
    main()
