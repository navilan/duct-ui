#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createMCPServer } from './lib/server.js'
import { getUsageHelp, getServerStartupMessage } from './lib/help.js'
import path from 'path'
import { fileURLToPath } from 'url'

// Parse command line arguments
const args = process.argv.slice(2)

// Check for help command
if (args.includes('--help') || args.includes('-h') || args[0] === 'help') {
  console.log(getUsageHelp())
  process.exit(0)
}

// Get the directory of this file and traverse up to repository root
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get source path from environment variable or default to ../../.. from dist/index.js
const sourcePath = path.resolve(__dirname, process.env.DUCT_UI_SOURCE_PATH || '../../..')

// Run stdio server
const server = createMCPServer(sourcePath)

async function main() {
  console.error('[MCP] Starting stdio server...')
  console.error(`[MCP] Using source path: ${sourcePath}`)
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('[MCP] Stdio transport connected successfully')
  console.error(getServerStartupMessage('v0.1.0'))
}

main().catch((error) => {
  console.error('Server error:', error)
  process.exit(1)
})