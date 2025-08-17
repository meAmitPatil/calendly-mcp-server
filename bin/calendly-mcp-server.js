#!/usr/bin/env node

/**
 * CLI entry point for Calendly MCP Server
 * Allows running via npx calendly-mcp-server
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the main server file
const serverPath = join(__dirname, '..', 'dist', 'index.js');

// Spawn the main server process with all arguments passed through
const serverProcess = spawn('node', [serverPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env
});

// Handle process termination
process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});

// Exit with the same code as the server process
serverProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code || 0);
  }
});

serverProcess.on('error', (error) => {
  console.error('Failed to start Calendly MCP Server:', error.message);
  process.exit(1);
});