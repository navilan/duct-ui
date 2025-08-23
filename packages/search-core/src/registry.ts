import type { SearchProvider } from './types.js'

export class SearchProviderRegistry {
  private providers = new Map<string, SearchProvider>()
  
  register(provider: SearchProvider): void {
    this.providers.set(provider.name, provider)
  }
  
  get(name: string): SearchProvider | undefined {
    return this.providers.get(name)
  }
  
  has(name: string): boolean {
    return this.providers.has(name)
  }
  
  list(): string[] {
    return Array.from(this.providers.keys())
  }
  
  clear(): void {
    this.providers.clear()
  }
}

export const registry = new SearchProviderRegistry()