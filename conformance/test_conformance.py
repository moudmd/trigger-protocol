#!/usr/bin/env python3
"""Compatibility checks for Trigger Protocol v0.2."""
import json
from pathlib import Path

from test_vectors import valid_receipt, VECTORS

ROOT=Path(__file__).resolve().parent
decision=json.loads((ROOT.parent/"examples"/"decision-rejection.json").read_text(encoding="utf-8"))

for vector in VECTORS["vectors"]:
    actual=valid_receipt(vector["receipt"])
    assert actual==vector["valid"],vector["name"]

assert decision["protocol"]=="trigger/0.2"
assert decision["decision"]=="reject"
assert all(isinstance(decision[k],str) and decision[k] for k in (
    "id","proposal_id","proposal_hash","actor","issued_at"
))
assert decision["decision"] not in ("approve",)

print("Trigger Protocol v0.2 conformance: PASS")
