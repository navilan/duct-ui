import path from 'path'
import type { ComponentInfo, ComponentsByCategory, ResourcePaths, ListComponentsArgs } from '../../types.js'
import { discoverComponents } from '../discovery.js'

// Map from component filenames to demo IDs based on the catalog
// This should be updated when new component demos are added
const COMPONENT_DEMO_MAP: Record<string, string> = {
  // Button components
  'button': 'button',
  'icon-button': 'icon-button',
  'toggle': 'toggle',
  'async-toggle': 'async-toggle',

  // Images components
  'icon': 'icon-button',  // Covered in the icon-button demo

  // Input components
  'editable': 'editable-input',

  // Dropdown components
  'menu': 'menu',
  'menu-item': 'menu',      // Covered in the menu demo
  'menu-separator': 'menu', // Covered in the menu demo
  'select': 'select',

  // Data display components
  'tree-view': 'tree-view',
  'list': 'emoji-list', // The list component demo is actually the emoji-list demo

  // Content components
  'markdown': 'markdown',

  // Layout components
  'tabs': 'tabs',
  'modal': 'modal',
  'drawer': 'drawer',
  'sidebar-nav': 'sidebar'  // The sidebar-nav component demo is the sidebar demo

  // All components now have demo coverage!
}

/**
 * Lists all available Duct UI components with optional category filtering
 * and includes links to component demos when available
 */
export async function listComponentsTool(
  args: ListComponentsArgs | undefined,
  resourcePaths: ResourcePaths
) {
  const componentFiles = await discoverComponents(resourcePaths)
  const components: ComponentsByCategory = {}

  for (const file of componentFiles) {
    const componentName = path.basename(file, '.tsx')
    const category = path.dirname(file).split('/')[0]

    // Apply category filter if provided
    if (args?.category && category !== args.category) {
      continue
    }

    if (!components[category]) {
      components[category] = []
    }

    // Look up demo URL from the map
    let demoUrl: string | undefined
    if (args?.includeDemo !== false) { // Include demos by default
      const demoId = COMPONENT_DEMO_MAP[componentName]
      if (demoId) {
        // Create a URL pointing to the duct-ui.org demos
        demoUrl = `https://duct-ui.org/demos/${demoId}`
      }
    }

    const componentInfo: ComponentInfo = {
      name: componentName,
      category,
      path: `components/${file}`,
      ...(demoUrl && { demo: demoUrl })
    }

    components[category].push(componentInfo)
  }

  // Sort categories and components within each category
  const sortedComponents: ComponentsByCategory = {}
  const sortedCategories = Object.keys(components).sort()

  for (const category of sortedCategories) {
    sortedComponents[category] = components[category].sort((a, b) => a.name.localeCompare(b.name))
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(sortedComponents, null, 2),
      },
    ],
  }
}

export const listComponentsToolDefinition = {
  name: 'list-components',
  description: 'List all available Duct UI components with their categories and demo links',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Optional category filter (e.g., button, layout, input)',
      },
      includeDemo: {
        type: 'boolean',
        description: 'Include demo links (default: true)',
      },
    },
  },
}