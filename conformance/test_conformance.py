#!/usr/bin/env python3
"""Compatibility checks for Trigger Protocol v0.2."""
from test_vectors import valid_receipt,VECTORS
for vector in VECTORS["vectors"]:
 actual=valid_receipt(vector["receipt"])
 assert actual==vector["valid"],vector["name"]
print("Trigger Protocol v0.2 conformance: PASS")
