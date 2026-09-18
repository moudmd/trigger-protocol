import { createInterface } from "node:readline";

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

rl.on("line", line => {
  if (!line.trim()) return;
  const message = JSON.parse(line);

  if (message.method === "tools/list") {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      result: { tools: [{ name: "delete_file", description: "Fake irreversible delete for Trigger Protocol demo." }] }
    }) + "\n");
    return;
  }

  if (message.method === "tools/call" && message.params?.name === "delete_file") {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        content: [{ type: "text", text: "DEMO: delete_file reached the executor. No real file was deleted." }]
      }
    }) + "\n");
    return;
  }

  process.stdout.write(JSON.stringify({
    jsonrpc: "2.0",
    id: message.id ?? null,
    error: { code: -32601, message: "Method not found" }
  }) + "\n");
});
