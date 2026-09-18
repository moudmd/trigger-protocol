#!/usr/bin/env node
import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

for await (const line of rl) {
  if (!line.trim()) continue;

  let message;
  try {
    message = JSON.parse(line);
  } catch {
    continue;
  }

  if (message.method === "initialize") {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion: "2025-11-25",
        capabilities: { tools: {} },
        serverInfo: { name: "trigger-protocol-demo", version: "0.1.0" }
      }
    }) + "\n");
    continue;
  }

  if (message.method === "notifications/initialized") continue;

  if (message.method === "tools/list") {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        tools: [{
          name: "hello",
          description: "A harmless demo tool.",
          inputSchema: {
            type: "object",
            properties: { name: { type: "string" } },
            required: ["name"]
          }
        }]
      }
    }) + "\n");
    continue;
  }

  if (message.method === "tools/call") {
    const name = message.params?.name;
    const args = message.params?.arguments ?? {};

    if (name !== "hello") {
      process.stdout.write(JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32602, message: "Unknown tool" }
      }) + "\n");
      continue;
    }

    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        content: [{ type: "text", text: `Hello, ${args.name ?? "world"}.` }]
      }
    }) + "\n");
    continue;
  }

  if (message.id !== undefined) {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: "Method not found" }
    }) + "\n");
  }
}
