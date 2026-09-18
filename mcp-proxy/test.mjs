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
const expected = "0e006c8cfb0addee461e4774d4d5609a4c847b4d09ffb5f82d7a3605a121b1dc";
assert.equal(hash(args), expected);

console.log("mcp-proxy smoke tests: PASS");
