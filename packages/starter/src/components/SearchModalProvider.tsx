import { createBlueprint, type BaseProps, createRef, renderProps } from '@duct-ui/core'
import type { BindReturn } from '@duct-ui/core/blueprint'
import { SearchModal, type SearchModalLogic } from '@duct-ui/components'
import { CloudflareSearchProvider } from '@duct-ui/cloudflare-search-provider'
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

export interface SearchModalProviderLogic {
  getSearchModal: () => SearchModalLogic | null
}

interface SearchModalProviderProps {
  workerUrl?: string
}

const searchModalRef = createRef<SearchModalLogic>()

let cloudflareSearchProvider: CloudflareSearchProvider | null = null
let clientSearchProvider: ClientSearchProvider | null = null
let activeSearchProvider: CloudflareSearchProvider | ClientSearchProvider | null = null

// Perform search with active provider
async function performSearch(_el: HTMLElement, query: string) {
  if (!searchModalRef.current || !activeSearchProvider || !query.trim()) {
    searchModalRef.current?.setResults([])
    return
  }

  try {
    const results = await activeSearchProvider.search(query)
    searchModalRef.current.setResults(results)
  } catch (error) {
    console.error('Search failed:', error)

    // If server-side search fails, try falling back to client-side search
    if (activeSearchProvider === cloudflareSearchProvider && clientSearchProvider) {
      console.log('Server-side search failed, trying client-side fallback...')
      try {
        const fallbackResults = await clientSearchProvider.search(query)
        searchModalRef.current.setResults(fallbackResults)
        // Switch to client-side search for future queries
        activeSearchProvider = clientSearchProvider
        return
      } catch (fallbackError) {
        console.error('Client-side fallback also failed:', fallbackError)
      }
    }

    searchModalRef.current?.setResults([])
  }
}

// Handle search result selection
function handleSelect(_el: HTMLElement, result: any) {
  if (result && result.url) {
    // Hide the modal before navigating
    searchModalRef.current?.hide()
    // Navigate to the selected result
    window.location.href = result.url
  }
}

function render(props: BaseProps<SearchModalProviderProps>) {
  const {
    workerUrl = import.meta.env.VITE_SEARCH_WORKER_URL || '/api',
    ...moreProps
  } = props

  return (
    <div class="search-modal-provider" {...renderProps(moreProps)}>
      <SearchModal
        ref={searchModalRef}
        placeholder="Search pages, posts, and content..."
        hotkey="k"
        hotkeyCombination={["cmd"]}
        data-search-modal
        on:search={performSearch}
        on:select={handleSelect}
      />
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: any, props: BaseProps<SearchModalProviderProps>): BindReturn<SearchModalProviderLogic> {
  const workerUrl = props.workerUrl || import.meta.env.VITE_SEARCH_WORKER_URL || '/api'

  // Initialize search providers with fallback
  async function initializeSearchProviders() {
    // Try Cloudflare search provider first (server-side)
    try {
      cloudflareSearchProvider = new CloudflareSearchProvider({
        workerUrl: workerUrl,
        timeout: 5000 // Shorter timeout for fallback scenario
      })

      const result = await cloudflareSearchProvider.initialize({
        workerUrl: workerUrl
      })

      activeSearchProvider = cloudflareSearchProvider
      console.log(`Server-side search initialized: ${result.indexSize} documents indexed`)
      return
    } catch (error) {
      console.log('Server-side search unavailable, falling back to client-side search:', error)
    }

    // Fallback to client-side search provider
    try {
      clientSearchProvider = new ClientSearchProvider()
      const result = await clientSearchProvider.initialize({
        indexUrl: '/search-index.json' // This file should be generated during build
      })

      activeSearchProvider = clientSearchProvider
      console.log(`Client-side search initialized: ${result.indexSize} documents indexed`)
    } catch (error) {
      console.error('Both server-side and client-side search failed to initialize:', error)
      activeSearchProvider = null
    }
  }

  // Initialize when component loads
  initializeSearchProviders()

  function getSearchModal(): SearchModalLogic | null {
    return searchModalRef.current
  }

  return {
    getSearchModal,
    release: () => {
      // Component cleanup is handled by individual components
    }
  }
}

const id = { id: "starter/search-modal-provider" }

const SearchModalProvider = createBlueprint<SearchModalProviderProps, {}, SearchModalProviderLogic>(
  id,
  render,
  { bind }
)

export default SearchModalProvider