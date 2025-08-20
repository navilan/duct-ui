import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { ResourcePaths, ConfigFile } from '../types.js'
import { discoverComponents, discoverDemoFiles } from './discovery.js'
import { 
  listComponentsTool, 
  listComponentsToolDefinition,
  createComponentProjectTool,
  createComponentProjectToolDefinition,
  createStaticWebsiteTool,
  createStaticWebsiteToolDefinition
} from './tools/index.js'

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper function to get resource paths based on source directory
function getResourcePaths(sourcePath: string): ResourcePaths {
  return {
    core: path.join(sourcePath, 'packages/core/src'),
    components: path.join(sourcePath, 'packages/components/src'),
    demo: path.join(sourcePath, 'packages/demo/src'),
    router: path.join(sourcePath, 'packages/router/src'),
    docs: path.join(sourcePath, 'packages/demo/src/docs/content')
  }
}

// Core files to expose for training
const CORE_FILES = [
  'blueprint.ts',
  'runtime.ts',
  'ref.ts',
  'lifecycle.ts',
  'shared.ts',
  'index.ts'
]

// Router files to expose
const ROUTER_FILES = [
  'index.ts'
]

// Helper function to get config files based on source directory
function getConfigFiles(sourcePath: string): ConfigFile[] {
  return [
    { path: path.join(sourcePath, 'packages/core/package.json'), name: 'Core package.json' },
    { path: path.join(sourcePath, 'packages/components/package.json'), name: 'Components package.json' },
    { path: path.join(sourcePath, 'packages/demo/package.json'), name: 'Demo package.json' },
    { path: path.join(sourcePath, 'packages/router/package.json'), name: 'Router package.json' },
    { path: path.join(sourcePath, 'packages/demo/vite.config.ts'), name: 'Demo Vite config' },
    { path: path.join(sourcePath, 'tsconfig.base.json'), name: 'Base TypeScript config' },
    { path: path.join(sourcePath, 'tailwind.config.ts'), name: 'Tailwind config' }
  ]
}

// Helper function to read file content
export async function readFileContent(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return `Error reading file: ${error}`
  }
}

// Create and configure the MCP server
export function createMCPServer(sourcePath: string): Server {
  const RESOURCE_PATHS = getResourcePaths(sourcePath)
  const CONFIG_FILES = getConfigFiles(sourcePath)
  const server = new Server(
    {
      name: '@duct-ui/mcp-server',
      version: '0.1.0',
    },
    {
      capabilities: {
        resources: {
          list: true,
          read: true
        },
        tools: {
          list: true,
          call: true
        },
      },
    }
  )

  // Handle list resources request
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    console.error('[MCP] Received ListResources request')
    const resources = []

    // Add core framework files
    for (const file of CORE_FILES) {
      resources.push({
        uri: `duct://core/${file}`,
        mimeType: 'text/typescript',
        name: `Core: ${file}`,
        description: `Duct core framework - ${file.replace('.ts', '')} module`
      })
    }

    // Add router files
    for (const file of ROUTER_FILES) {
      resources.push({
        uri: `duct://router/${file}`,
        mimeType: 'text/typescript',
        name: `Router: ${file}`,
        description: `Duct router framework - ${file.replace('.ts', '')} module`
      })
    }

    // Add discovered components
    const componentFiles = await discoverComponents(RESOURCE_PATHS)
    for (const file of componentFiles) {
      const componentName = path.basename(file, '.tsx')
      const category = path.dirname(file).split('/')[0]
      
      resources.push({
        uri: `duct://components/${file}`,
        mimeType: 'text/typescript',
        name: `Component: ${componentName}`,
        description: `Duct UI component - ${category}/${componentName}`
      })
    }

    // Add component utilities
    resources.push({
      uri: `duct://components/utils/cn.ts`,
      mimeType: 'text/typescript',
      name: 'Utility: cn (class names)',
      description: 'Tailwind CSS class merging utility using tailwind-merge and clsx'
    })

    // Add demo files for usage examples
    const demoFiles = await discoverDemoFiles(RESOURCE_PATHS)
    for (const file of demoFiles) {
      const fileName = path.basename(file, '.tsx')
      const dirName = path.dirname(file)
      
      resources.push({
        uri: `duct://demo/${file}`,
        mimeType: 'text/typescript',
        name: `Demo: ${fileName}`,
        description: `Demo/example - ${dirName}/${fileName}`
      })
    }

    // Add config files
    for (const config of CONFIG_FILES) {
      const extension = path.extname(config.path)
      const mimeType = extension === '.json' ? 'application/json' : 'text/typescript'
      
      resources.push({
        uri: `duct://config/${path.basename(config.path)}`,
        mimeType,
        name: config.name,
        description: `Configuration file - ${config.name}`
      })
    }

    console.error(`[MCP] Returning ${resources.length} resources`)
    return { resources }
  })

  // Handle read resource request
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri
    console.error(`[MCP] Received ReadResource request for: ${uri}`)
    const parts = uri.replace('duct://', '').split('/')
    const category = parts[0]
    const filePath = parts.slice(1).join('/')

    let fullPath: string
    let content: string

    try {
      switch (category) {
        case 'core':
          fullPath = path.join(RESOURCE_PATHS.core, filePath)
          content = await readFileContent(fullPath)
          break

        case 'components':
          fullPath = path.join(RESOURCE_PATHS.components, filePath)
          content = await readFileContent(fullPath)
          break

        case 'router':
          fullPath = path.join(RESOURCE_PATHS.router, filePath)
          content = await readFileContent(fullPath)
          break

        case 'demo':
          fullPath = path.join(RESOURCE_PATHS.demo, filePath)
          content = await readFileContent(fullPath)
          break

        case 'config':
          const configFile = CONFIG_FILES.find(c => path.basename(c.path) === filePath)
          if (configFile) {
            fullPath = configFile.path
            content = await readFileContent(fullPath)
          } else {
            throw new Error(`Unknown config file: ${filePath}`)
          }
          break

        default:
          throw new Error(`Unknown resource category: ${category}`)
      }

      const extension = path.extname(filePath)
      let mimeType = 'text/typescript'
      if (extension === '.json') mimeType = 'application/json'
      if (extension === '.md') mimeType = 'text/markdown'

      console.error(`[MCP] Successfully read ${filePath} (${content.length} bytes)`)
      return {
        contents: [
          {
            uri,
            mimeType,
            text: content,
          },
        ],
      }
    } catch (error) {
      console.error(`[MCP] Error reading resource: ${error}`)
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `Error reading resource: ${error}`,
          },
        ],
      }
    }
  })

  // Handle list tools request
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error('[MCP] Received ListTools request')
    return {
      tools: [
        listComponentsToolDefinition,
        createComponentProjectToolDefinition,
        createStaticWebsiteToolDefinition,
      ],
    }
  })

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    console.error(`[MCP] Received CallTool request: ${name}`, args ? `with args: ${JSON.stringify(args)}` : '')

    switch (name) {
      case 'list-components':
        return await listComponentsTool(args, RESOURCE_PATHS)

      case 'create-component-project':
        return await createComponentProjectTool(args, RESOURCE_PATHS)

      case 'create-static-website':
        return await createStaticWebsiteTool(args, RESOURCE_PATHS)

      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  })

  return server
}