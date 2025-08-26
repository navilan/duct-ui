import { createBlueprint, type BaseProps, createRef, renderProps, isBrowser } from '@duct-ui/core'
import type { BindReturn } from '@duct-ui/core/blueprint'
import SearchModal, { type SearchModalLogic } from '@duct-ui/components/search/search-modal'
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

export interface SearchModalProviderLogic {
  getSearchModal: () => SearchModalLogic | null
}

interface SearchModalProviderProps {}

const searchModalRef = createRef<SearchModalLogic>()

let clientSearchProvider: ClientSearchProvider | null = null

// Perform search with client-side provider
async function performSearch(_el: HTMLElement, query: string) {
  if (!searchModalRef.current || !clientSearchProvider || !query.trim()) {
    searchModalRef.current?.setResults([])
    return
  }

  try {
    const results = await clientSearchProvider.search(query, { limit: 10 })
    searchModalRef.current.setResults(results)
  } catch (error) {
    console.error('Search failed:', error)
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
  const { ...moreProps } = props

  return (
    <div class="search-modal-provider" {...renderProps(moreProps)}>
      <SearchModal
        ref={searchModalRef}
        placeholder="Search documentation, demos, and blog posts..."
        hotkey="k"
        hotkeyCombination={["cmd"]}
        data-search-modal
        on:search={performSearch}
        on:select={handleSelect}
      />
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: any): BindReturn<SearchModalProviderLogic> {
  // Initialize search provider
  async function initializeSearchProvider() {
    if (!isBrowser) return

    try {
      clientSearchProvider = new ClientSearchProvider()
      const result = await clientSearchProvider.initialize({
        indexUrl: '/search-index.json',
        threshold: 0.3 // Filter out results with scores below 30% of the highest score
      })

      console.log(`Client-side search initialized: ${result.indexSize} documents indexed`)
    } catch (error) {
      console.error('Failed to initialize client-side search:', error)
      clientSearchProvider = null
    }
  }

  // Initialize when component loads
  initializeSearchProvider()

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

const id = { id: "demo/search-modal-provider" }

const SearchModalProvider = createBlueprint<SearchModalProviderProps, {}, SearchModalProviderLogic>(
  id,
  render,
  { bind }
)

export default SearchModalProvider