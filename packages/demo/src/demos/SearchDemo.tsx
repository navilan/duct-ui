import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef, isBrowser } from "@duct-ui/core"
import Search, { type SearchLogic, type SearchResult } from "@duct-ui/components/search/search"
import { ClientSearchProvider } from '@duct-ui/client-search-provider'
import DemoLayout from "@components/DemoLayout"
import EventLog, { EventLogLogic } from "@components/EventLog"

export interface SearchDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface SearchDemoLogic {
  // Component logic methods if needed
}

export interface SearchDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

const searchRef = createRef<SearchLogic>()
const customSearchRef = createRef<SearchLogic>()
const eventLogRef = createRef<EventLogLogic>()
let provider: ClientSearchProvider | null = null

async function initializeSearch() {
  if (!isBrowser) return

  if (eventLogRef.current) {
    eventLogRef.current.addEvent('Initializing search provider...')
  }

  try {
    provider = new ClientSearchProvider()

    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Using search provider: ${provider.name}`)
      eventLogRef.current.addEvent('Fetching search index from /search-index.json...')
    }

    const result = await provider.initialize({
      indexUrl: '/search-index.json',
      threshold: 0.3 // Filter out results with scores below 30% of the highest score
    })

    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Search provider initialized successfully - Index size: ${result.indexSize} entries`)
    }
  } catch (error) {
    console.error('Failed to initialize search provider:', error)
    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Failed to initialize search: ${error}`)
    }
  }
}

async function handleBasicSearch(el: HTMLElement, query: string) {
  if (!provider || !query.trim()) {
    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Basic search skipped - Provider: ${!!provider}, Query: "${query.trim()}"`)
    }
    return
  }

  if (eventLogRef.current) {
    eventLogRef.current.addEvent(`Basic search for: "${query}"`)
  }

  try {
    const results = await provider.search(query, { limit: 10 })
    searchRef.current?.setResults(results)
    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Basic search found ${results.length} results for "${query}"`)
      if (results.length > 0) {
        eventLogRef.current.addEvent(`First result: ${results[0].title}`)
      }
    }
  } catch (error) {
    console.error('Basic search error:', error)
    searchRef.current?.setResults([])
    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Basic search error: ${error}`)
    }
  }
}

async function handleCustomSearch(el: HTMLElement, query: string) {
  if (!provider || !query.trim()) {
    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Custom search skipped - Provider: ${!!provider}, Query: "${query.trim()}"`)
    }
    return
  }

  if (eventLogRef.current) {
    eventLogRef.current.addEvent(`Custom search for: "${query}"`)
  }

  try {
    const results = await provider.search(query, { limit: 10 })
    customSearchRef.current?.setResults(results)
    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Custom search found ${results.length} results for "${query}"`)
      if (results.length > 0) {
        eventLogRef.current.addEvent(`First result: ${results[0].title}`)
      }
    }
  } catch (error) {
    console.error('Custom search error:', error)
    customSearchRef.current?.setResults([])
    if (eventLogRef.current) {
      eventLogRef.current.addEvent(`Custom search error: ${error}`)
    }
  }
}

function handleResultSelect(el: HTMLElement, result: SearchResult) {
  if (eventLogRef.current) {
    eventLogRef.current.addEvent(`Selected: ${result.title} (${result.url})`)
  }

  // Navigate to the selected result
  if (result.url.startsWith('/')) {
    window.location.href = result.url
  } else {
    window.open(result.url, '_blank')
  }
}


function render(props: BaseProps<SearchDemoProps>) {
  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Search Component"
        description="Full-text search with FlexSearch and real-time results across documentation and demos"
        sourcePath="/demos/SearchDemo.tsx"
      >
        <div>
          <div class="space-y-8">

            {/* Basic Search with Default Styling */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Basic Search (Default CSS)</h2>
              <div class="max-w-2xl">
                <Search
                  ref={searchRef}
                  placeholder="Search documentation and demos..."
                  searchIcon="🔍"
                  searchIconSize="sm"
                  on:search={handleBasicSearch}
                  on:select={handleResultSelect}
                />
                <p class="text-sm text-base-content/60 mt-2">
                  This uses the default search CSS styles with proper positioning, padding, and separators.
                </p>
              </div>

              {/* Quick Search Buttons - Associated with Basic Search */}
              <div class="mt-6">
                <h3 class="text-lg font-medium mb-3">Quick Searches</h3>
                <div class="bg-primary/10 rounded-lg p-4">
                  <p class="text-sm text-base-content/70 mb-3">
                    Click any term below to search the demo site content:
                  </p>
                  <div class="flex flex-wrap gap-2" data-quick-search-buttons>
                    {['components', 'button', 'lifecycle', 'blueprint', 'modal', 'search', 'typescript'].map(term => (
                      <button
                        class="btn btn-xs btn-outline btn-primary"
                        data-quick-search-button
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div class="divider"></div>

            {/* Custom Styled Search */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Custom Styled Search</h2>
              <div class="max-w-2xl">
                <Search
                  ref={customSearchRef}
                  placeholder="Custom styled search..."
                  searchIcon="🔍"
                  searchIconSize="sm"
                  containerClass="w-full"
                  inputClass="input input-bordered text-base pl-10"
                  dropdownClass="absolute top-full left-0 right-0 mt-1 z-50 bg-base-100 shadow-xl border border-base-300 rounded-lg max-h-96 overflow-y-auto"
                  resultItemClass="px-4 py-3 hover:bg-base-200 transition-all duration-200 cursor-pointer border-b border-base-300 last:border-b-0"
                  resultTitleClass="font-semibold text-base-content mb-1"
                  resultExcerptClass="text-base-content/70 text-sm mb-1"
                  resultUrlClass="text-primary text-xs"
                  loadingClass="text-base-content/60 italic px-4 py-3 text-center"
                  noResultsClass="text-base-content/60 px-4 py-3 text-center"
                  on:search={handleCustomSearch}
                  on:select={handleResultSelect}
                />
                <p class="text-sm text-base-content/60 mt-2">
                  This uses custom DaisyUI classes with theme-aware colors and spacing.
                </p>
              </div>
            </div>

            {/* Search Features - Separate Section */}
            <div class="mt-8">
              <h2 class="text-2xl font-semibold mb-4">Search Features</h2>
              <div class="bg-secondary/10 rounded-lg p-4">
                <ul class="space-y-2 text-sm text-base-content/80">
                  <li class="flex items-start gap-2">
                    <span class="text-secondary">•</span>
                    <span><strong>Debounced input:</strong> Search triggers after 300ms of typing</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-secondary">•</span>
                    <span><strong>Keyboard navigation:</strong> Use ↑↓ arrows to navigate results</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-secondary">•</span>
                    <span><strong>Multi-field search:</strong> Searches title, description, content, and tags</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-secondary">•</span>
                    <span><strong>Cached index:</strong> Fast subsequent searches with IndexedDB caching</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="text-secondary">•</span>
                    <span><strong>Custom icons:</strong> Supports emoji, SVG imports, or image URLs</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Event Log */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Event Log</h2>
              <EventLog
                ref={eventLogRef}
                title="Search Events"
                maxHeight="max-h-48"
                data-event-log-component
              />
            </div>

            {/* Features Documentation */}
            <div class="bg-base-200 p-6 rounded-lg">
              <h3 class="text-lg font-medium mb-3">Implementation Details:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>FlexSearch Document API</strong> - High-performance full-text search</li>
                  <li><strong>Real search data</strong> - Uses actual demo site content index</li>
                  <li><strong>IndexedDB caching</strong> - Persistent cache with localStorage fallback</li>
                  <li><strong>Framework agnostic</strong> - Uses functional CSS classes, not framework-dependent</li>
                </ul>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Customizable styling</strong> - Every CSS class can be overridden</li>
                  <li><strong>Event-driven</strong> - <code>on:search</code>, <code>on:select</code> events</li>
                  <li><strong>Component logic access</strong> - <code>setQuery()</code>, <code>setResults()</code></li>
                  <li><strong>Keyboard shortcuts</strong> - Arrow navigation, Enter to select, Escape to close</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<SearchDemoEvents>): BindReturn<SearchDemoLogic> {
  initializeSearch()
  // Add event listeners for quick search buttons
  const quickSearchButtons = el.querySelectorAll('[data-quick-search-button]')

  function handleButtonClick(event: Event) {
    const button = event.target as HTMLButtonElement
    const term = button.textContent?.trim()
    if (term && searchRef.current) {
      searchRef.current.setQuery(term)
      if (eventLogRef.current) {
        eventLogRef.current.addEvent(`Quick search triggered: "${term}"`)
      }
    }
  }

  quickSearchButtons.forEach(button => {
    button.addEventListener('click', handleButtonClick)
  })

  return {
    release: () => {
      // Remove event listeners
      quickSearchButtons.forEach(button => {
        button.removeEventListener('click', handleButtonClick)
      })
    }
  }
}

const id = { id: "duct-demo/search-demo" }

const SearchDemo = createBlueprint<SearchDemoProps, SearchDemoEvents, SearchDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default SearchDemo