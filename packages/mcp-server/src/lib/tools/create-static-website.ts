import path from 'path'
import { promises as fs } from 'fs'
import type { ResourcePaths } from '../../types.js'

export interface CreateStaticWebsiteArgs {
  name: string
  description?: string
  author?: string
  outputPath: string
}

/**
 * Creates a new static website project with blog using the static-website template
 */
export async function createStaticWebsiteTool(
  args: Partial<CreateStaticWebsiteArgs> | undefined,
  resourcePaths: ResourcePaths
) {
  if (!args?.name) {
    return {
      content: [
        {
          type: 'text',
          text: 'Please provide a name for your website (e.g., "My Blog" or "Company Website")',
        },
      ],
      isError: true,
    }
  }

  if (!args?.outputPath) {
    return {
      content: [
        {
          type: 'text',
          text: 'Please provide an output path where the website should be created (e.g., "./my-website")',
        },
      ],
      isError: true,
    }
  }
  const { name, description = 'A modern static website built with Duct UI', author = 'Your Name', outputPath } = args
  
  // Get template path (relative to mcp-server)
  const templatePath = path.resolve(path.dirname(resourcePaths.core), '../mcp-server/templates/static-website')
  const targetPath = path.resolve(outputPath)
  
  console.error(`[MCP] Creating static website "${name}" at ${targetPath}`)
  
  try {
    // Ensure target directory exists
    await fs.mkdir(targetPath, { recursive: true })
    
    // Copy template files and process templates
    await copyAndProcessTemplate(templatePath, targetPath, {
      name,
      description,
      author
    })
    
    console.error(`[MCP] Successfully created static website "${name}"`)
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Static website "${name}" created successfully`,
            path: targetPath,
            features: [
              'Blog functionality with markdown support',
              'Responsive design with Tailwind CSS',
              'Static site generation with Duct UI',
              'TypeScript support',
              'Development server with hot reload'
            ],
            nextSteps: [
              `cd ${path.basename(targetPath)}`,
              'pnpm install',
              'pnpm run dev',
              'Add your content to src/blog/',
              'Customize pages/ and src/components/',
              'pnpm run build'
            ]
          }, null, 2)
        }
      ]
    }
  } catch (error) {
    console.error(`[MCP] Error creating static website: ${error}`)
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: `Failed to create static website: ${error}`
          }, null, 2)
        }
      ]
    }
  }
}

/**
 * Recursively copy template files and process template variables
 */
async function copyAndProcessTemplate(
  sourcePath: string, 
  targetPath: string, 
  variables: Record<string, string>
): Promise<void> {
  const entries = await fs.readdir(sourcePath, { withFileTypes: true })
  
  for (const entry of entries) {
    const sourceFile = path.join(sourcePath, entry.name)
    const targetFile = path.join(targetPath, entry.name)
    
    if (entry.isDirectory()) {
      await fs.mkdir(targetFile, { recursive: true })
      await copyAndProcessTemplate(sourceFile, targetFile, variables)
    } else {
      // Read file content
      let content = await fs.readFile(sourceFile, 'utf-8')
      
      // Process template variables
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g')
        content = content.replace(regex, value)
      }
      
      // Write processed content
      await fs.writeFile(targetFile, content, 'utf-8')
    }
  }
}

export const createStaticWebsiteToolDefinition = {
  name: 'create-static-website',
  description: 'Create a new static website project with blog using Duct UI',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Website name (will be used as site title)',
      },
      description: {
        type: 'string',
        description: 'Website description (optional)',
      },
      author: {
        type: 'string',
        description: 'Author name (optional)',
      },
      outputPath: {
        type: 'string',
        description: 'Output directory path where the website will be created',
      },
    },
    required: ['name', 'outputPath'],
  },
}