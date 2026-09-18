#!/usr/bin/env node
import { run } from "../mcp-proxy/index.mjs";

run(process.argv.slice(2)).catch((error) => {
  console.error(`trigger-mcp-proxy: ${error.message}`);
  process.exitCode = 1;
});
