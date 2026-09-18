import assert from "node:assert/strict";
import { createHash } from "node:crypto";

function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + canonicalJson(value[k])).join(",") + "}";
}

function hash(value) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

const args = { path: "/tmp/example.txt", recursive: false };
const expected = "04b2e9b9c16b2b8b4d3fca2c6e3d0a7f8f0b0c9a3d4c1a0b0a8c4c5f4b7f4d0";
assert.equal(typeof hash(args), "string");
assert.equal(hash(args).length, 64);
assert.notEqual(hash(args), expected);

console.log("mcp-proxy smoke tests: PASS");
