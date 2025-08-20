// Type definitions for the MCP server

export interface ComponentInfo {
  name: string
  category: string
  path: string
  demo?: string
}

export interface ComponentsByCategory {
  [category: string]: ComponentInfo[]
}

export interface ResourcePaths {
  core: string
  components: string
  demo: string
  router: string
  docs?: string
}

export interface ConfigFile {
  path: string
  name: string
}

export interface ListComponentsArgs {
  category?: string
  includeDemo?: boolean
}