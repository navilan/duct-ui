// Centralized help and integration instructions

export function getUsageHelp(): string {
  return `
╔════════════════════════════════════════════════════════════════════════════╗
║                         Duct UI MCP Server                                ║
╚════════════════════════════════════════════════════════════════════════════╝

DESCRIPTION:
  MCP server for the Duct UI framework that provides resources, tools, and 
  prompts to help LLMs understand and work with Duct projects.

USAGE:
  duct-mcp                       # Run stdio server (default: ../../..)
  duct-mcp help                  # Show this help message

ENVIRONMENT VARIABLES:
  DUCT_UI_SOURCE_PATH            # Set Duct source directory path (default: ../../..)

INTEGRATION WITH LLMS:

  Claude Code (stdio transport):
  ──────────────────────────────
  Add the server to Claude Code from your Duct repository:
  
  claude mcp add duct-ui -- node packages/mcp-server/dist/index.js
  
  Or with custom source path:
  
  DUCT_UI_SOURCE_PATH=/path/to/duct claude mcp add duct-ui -- node packages/mcp-server/dist/index.js

  VS Code with Continue.dev:
  ───────────────────────────
  Add to your .continuerc.json:
  
  {
    "models": [...],
    "mcpServers": {
      "duct-ui": {
        "command": "node",
        "args": ["packages/mcp-server/dist/index.js"],
        "cwd": "/path/to/your/duct/repository",
        "env": {
          "DUCT_UI_SOURCE_PATH": "/path/to/your/duct/repository"
        }
      }
    }
  }

  Local Development:
  ──────────────────
  From your Duct repository:
  
  cd packages/mcp-server
  pnpm dev  # Run in development mode

RESOURCES PROVIDED:
  • Core framework files (blueprint, runtime, lifecycle, etc.)
  • Router framework files
  • All UI components with categorization
  • Demo files showing usage patterns
  • Configuration files (TypeScript, Vite, Tailwind)

TOOLS AVAILABLE:
  • list-components - List all available Duct UI components

REQUIREMENTS:
  The server requires access to a Duct repository structure. By default it uses
  ../../.. (repository root), or you can specify a custom path with DUCT_UI_SOURCE_PATH.

For more information, visit: https://github.com/navilan/duct`
}

export function getServerStartupMessage(version: string): string {
  return `╔════════════════════════════════════════════════════════════════════════════╗
║ Duct UI MCP Server (stdio) ${version}                                     ║
║ Run with --help flag for integration instructions                         ║
╚════════════════════════════════════════════════════════════════════════════╝`
}