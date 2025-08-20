import path from 'path'
import { promises as fs } from 'fs'
import type { ResourcePaths } from '../../types.js'

export interface CreateComponentProjectArgs {
  name: string
  description?: string
  author?: string
  outputPath: string
}

/**
 * Creates a new component library project using the component-project template
 */
export async function createComponentProjectTool(
  args: Partial<CreateComponentProjectArgs> | undefined,
  resourcePaths: ResourcePaths
) {
  if (!args?.name) {
    return {
      content: [
        {
          type: 'text',
          text: 'Please provide a name for your component project (e.g., "my-ui-components")',
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
          text: 'Please provide an output path where the project should be created (e.g., "./my-component-project")',
        },
      ],
      isError: true,
    }
  }
  const { name, description = 'A Duct UI component library', author = 'Your Name', outputPath } = args
  
  // Get template path (relative to mcp-server)
  const templatePath = path.resolve(path.dirname(resourcePaths.core), '../mcp-server/templates/component-project')
  const targetPath = path.resolve(outputPath)
  
  console.error(`[MCP] Creating component project "${name}" at ${targetPath}`)
  
  try {
    // Ensure target directory exists
    await fs.mkdir(targetPath, { recursive: true })
    
    // Copy template files and process templates
    await copyAndProcessTemplate(templatePath, targetPath, {
      name,
      description,
      author
    })
    
    console.error(`[MCP] Successfully created component project "${name}"`)
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            message: `Component project "${name}" created successfully`,
            path: targetPath,
            nextSteps: [
              `cd ${path.basename(targetPath)}`,
              'pnpm install',
              'pnpm run build',
              'pnpm run dev'
            ]
          }, null, 2)
        }
      ]
    }
  } catch (error) {
    console.error(`[MCP] Error creating component project: ${error}`)
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: `Failed to create component project: ${error}`
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

export const createComponentProjectToolDefinition = {
  name: 'create-component-project',
  description: 'Create a new Duct UI component library project from template',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Project name (will be used as package name)',
      },
      description: {
        type: 'string',
        description: 'Project description (optional)',
      },
      author: {
        type: 'string',
        description: 'Author name (optional)',
      },
      outputPath: {
        type: 'string',
        description: 'Output directory path where the project will be created',
      },
    },
    required: ['name', 'outputPath'],
  },
}