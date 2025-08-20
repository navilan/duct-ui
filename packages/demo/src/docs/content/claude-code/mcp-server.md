## Using the Duct UI MCP Server (Recommended)

The fastest way to get started with Duct UI in Claude Code is to use our Model Context Protocol (MCP) server. It provides instant access to framework knowledge, component catalog, and project creation tools.{.lead}

### Quick Setup

```bash
# Clone and build the Duct UI repository
git clone git@github.com:navilan/duct-ui.git
cd duct-ui
pnpm build

# Add the MCP server to Claude Code
claude mcp add duct-ui -- node packages/mcp-server/dist/index.js
```

### Available Tools

Once connected, you can use these powerful tools:

#### 🧠 Framework Learning
- **Instant Knowledge**: Access all core files, components, and documentation automatically
- **Component Catalog**: List all available components with demo links
- **Best Practices**: Learn Duct patterns from real implementations

```plaintext
# Example prompts:
"Please understand the duct-ui framework by reading through its resources"
"List duct-ui components with demo links"
```

#### 🚀 Project Creation
- **Component Libraries**: Generate complete TypeScript component projects
- **Static Websites**: Create blog-ready websites with full Duct UI integration
- **Template System**: All projects use latest versions and best practices

```plaintext
# Example prompts:
"Create a new Duct UI component library project named 'my-components' in './my-library'"
"Create a new static website project named 'My Blog' in './my-website'"
```

### What You Get

- **📚 Complete Framework Knowledge**: All core files, components, and patterns
- **🎨 Component Catalog**: Browse all components with live demo links
- **⚡ Instant Project Setup**: Generate production-ready projects in seconds
- **🔧 Proper Configuration**: TypeScript, build scripts, and dependencies handled
- **📖 Template Learning**: Projects follow established Duct UI patterns

> **💡 Pro Tip**: The MCP server automatically stays in sync with the latest Duct UI patterns and components. No more manual updates needed!
