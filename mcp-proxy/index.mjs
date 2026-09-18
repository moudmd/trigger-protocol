import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

const NS = "https://trigger-protocol.org/ns/mcp-proxy";

function usage() {
  console.error(`
Usage:
  npx trigger-mcp-proxy -- <mcp-server-command> [args...]

Options:
  --mode observe|gate     observe is transparent (default); gate enforces receipts
  --receipt <file>        Trigger Receipt JSON used by --mode gate
  --tool <name>           In gate mode, allow this tool in addition to the receipt
  --help                  Show this help

Examples:
  npx trigger-mcp-proxy -- npx -y @modelcontextprotocol/server-filesystem /tmp
  npx trigger-mcp-proxy --mode gate --receipt ./trigger-receipt.json -- npx -y <mcp-server>
`);
}

function parseArgs(argv) {
  let mode = "observe";
  let receiptPath = null;
  const allowedTools = [];
  let i = 0;
  for (; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--") { i++; break; }
    if (arg === "--help" || arg === "-h") return { help: true };
    if (arg === "--mode") {
      mode = argv[++i];
      if (!["observe", "gate"].includes(mode)) throw new Error("--mode must be observe or gate");
      continue;
    }
    if (arg === "--receipt") {
      receiptPath = argv[++i];
      if (!receiptPath) throw new Error("--receipt requires a file");
      continue;
    }
    if (arg === "--tool") {
      const tool = argv[++i];
      if (!tool) throw new Error("--tool requires a tool name");
      allowedTools.push(tool);
      continue;
    }
    throw new Error(`unknown option: ${arg}`);
  }
  const command = argv.slice(i);
  if (!command.length) throw new Error("missing upstream MCP server command; use -- <command> [args...]");
  if (mode === "gate" && !receiptPath && !allowedTools.length) {
    throw new Error("gate mode requires --receipt or at least one --tool");
  }
  return { mode, receiptPath, allowedTools, command };
}

function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalJson).join(",") + "]";
  return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + canonicalJson(value[k])).join(",") + "}";
}

function sha256(value) {
  return createHash("sha256").update(canonicalJson(value)).digest("hex");
}

function loadReceipt(path) {
  const receipt = JSON.parse(readFileSync(path, "utf8"));
  const required = ["id", "protocol", "proposal_id", "decision_id", "actor", "authority_id", "action", "issued_at"];
  for (const key of required) if (receipt[key] === undefined) throw new Error(`receipt missing ${key}`);
  if (receipt.protocol !== "trigger/0.2") throw new Error("receipt protocol must be trigger/0.2");
  if (receipt.expires_at && Date.parse(receipt.expires_at) <= Date.now()) throw new Error("receipt is expired");
  if (receipt.revoked === true) throw new Error("receipt is revoked");
  return receipt;
}

function receiptAllows(receipt, toolName, args) {
  if (!receipt) return false;
  if (receipt.action !== "mcp.tools/call") return false;

  const scope = receipt.scope;
  if (typeof scope === "string" && scope !== "*" && scope !== toolName) return false;
  if (Array.isArray(scope) && !scope.includes("*") && !scope.includes(toolName)) return false;

  const mcp = receipt.extensions?.[NS];
  if (mcp?.tool_name && mcp.tool_name !== toolName) return false;
  if (mcp?.arguments_sha256 && mcp.arguments_sha256 !== sha256(args ?? {})) return false;
  return true;
}

function jsonRpcError(id, code, message, data = {}) {
  return JSON.stringify({ jsonrpc: "2.0", id, error: { code, message, data } }) + "\n";
}

function logEvent(event, extra = {}) {
  console.error(JSON.stringify({
    source: "trigger-mcp-proxy",
    protocol: "trigger/0.2",
    event,
    timestamp: new Date().toISOString(),
    ...extra
  }));
}

export async function run(argv) {
  const options = parseArgs(argv);
  if (options.help) { usage(); return; }

  let receipt = options.receiptPath ? loadReceipt(options.receiptPath) : null;
  const child = spawn(options.command[0], options.command.slice(1), {
    stdio: ["pipe", "pipe", "inherit"],
    env: process.env
  });

  child.on("error", (error) => {
    console.error(`upstream process error: ${error.message}`);
    process.exitCode = 1;
  });

  child.on("exit", (code, signal) => {
    if (signal) console.error(`upstream exited by ${signal}`);
    else if (code !== 0) console.error(`upstream exited with code ${code}`);
    process.exitCode = code ?? 1;
  });

  const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });
  rl.on("line", (line) => {
    if (!line.trim()) return;
    let message;
    try { message = JSON.parse(line); }
    catch { child.stdin.write(line + "\n"); return; }

    if (options.mode === "observe" || message.method !== "tools/call") {
      child.stdin.write(line + "\n");
      return;
    }

    const toolName = message.params?.name;
    const args = message.params?.arguments ?? {};
    const receiptOk = receiptAllows(receipt, toolName, args);
    const allowlisted = options.allowedTools.includes(toolName);

    if (receiptOk || allowlisted) {
      logEvent("authorized", {
        request_id: message.id ?? null,
        tool: toolName,
        receipt_id: receipt?.id ?? null,
        authorization: receiptOk ? "trigger-receipt" : "local-allowlist"
      });
      child.stdin.write(line + "\n");
      return;
    }

    logEvent("blocked", {
      request_id: message.id ?? null,
      tool: toolName,
      reason: "no-valid-trigger"
    });

    if (message.id !== undefined) {
      process.stdout.write(jsonRpcError(message.id, -32001, "Trigger Protocol authorization required", {
        protocol: "trigger/0.2",
        action: "mcp.tools/call",
        tool: toolName ?? null
      }));
    }
  });

  child.stdout.on("data", chunk => process.stdout.write(chunk));
  process.stdin.on("end", () => child.stdin.end());
}
