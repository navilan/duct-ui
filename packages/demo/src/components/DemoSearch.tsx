import { createBlueprint, type BaseProps, renderProps } from "@duct-ui/core/blueprint"
import { createRef } from "@duct-ui/core"
import Search, { type SearchLogic, type SearchResult } from "@duct-ui/components/search/search"
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

export interface DemoSearchProps {
  placeholder?: string
  searchIcon?: string
  searchIconSize?: 'sm' | 'md' | 'lg'
  inputClass?: string
  dropdownClass?: string
  resultItemClass?: string
  resultTitleClass?: string
  resultExcerptClass?: string
  resultUrlClass?: string
  loadingClass?: string
  noResultsClass?: string
  maxResults?: number
  'on:select'?: (el: HTMLElement, result: SearchResult) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

// Initialize the search provider once
const searchProvider = new ClientSearchProvider()
let isInitialized = false

const initPromise = searchProvider.initialize({
  indexUrl: '/search-index.json',
  threshold: 0.3,
  limit: 10
}).then(() => {
  isInitialized = true
}).catch(error => {
  console.error('Failed to initialize search provider:', error)
})

const searchRef = createRef<SearchLogic>()

async function handleSearch(el: HTMLElement, query: string) {
  if (!query.trim()) {
    searchRef.current?.setResults([])
    return
  }

  try {
    // Wait for initialization if not done yet
    await initPromise
    
    if (!isInitialized) {
      searchRef.current?.setResults([])
      return
    }

    const maxResults = el.dataset.maxResults ? parseInt(el.dataset.maxResults) : 8
    const results = await searchProvider.search(query, { limit: maxResults })
    searchRef.current?.setResults(results)
  } catch (error) {
    console.error('Search error:', error)
    searchRef.current?.setResults([])
  }
}

function render(props: BaseProps<DemoSearchProps>) {
  const {
    placeholder = "Search...",
    searchIcon = "🔍",
    searchIconSize = "sm",
    inputClass = "input input-bordered w-full",
    dropdownClass = "absolute top-full left-0 right-0 mt-2 z-50 bg-base-100 shadow-xl border border-base-300 rounded-lg max-h-80 overflow-y-auto",
    resultItemClass = "px-4 py-3 hover:bg-base-200 transition-colors cursor-pointer border-b border-base-300 last:border-b-0",
    resultTitleClass = "font-medium text-base-content mb-1 truncate",
    resultExcerptClass = "text-base-content/70 text-sm mb-1 line-clamp-2",
    resultUrlClass = "text-primary text-xs truncate",
    loadingClass = "text-base-content/60 italic px-4 py-3 text-center",
    noResultsClass = "text-base-content/60 px-4 py-3 text-center",
    maxResults = 8,
    'on:select': onSelect,
    ...restProps
  } = props

  return (
    <div data-max-results={maxResults.toString()} {...renderProps(restProps)}>
      <Search
        ref={searchRef}
        placeholder={placeholder}
        searchIcon={searchIcon}
        searchIconSize={searchIconSize}
        inputClass={inputClass}
        dropdownClass={dropdownClass}
        resultItemClass={resultItemClass}
        resultTitleClass={resultTitleClass}
        resultExcerptClass={resultExcerptClass}
        resultUrlClass={resultUrlClass}
        loadingClass={loadingClass}
        noResultsClass={noResultsClass}
        on:search={handleSearch}
        on:select={onSelect || ((el, result) => {
          // Default behavior: navigate to the result
          if (result.url.startsWith('/')) {
            window.location.href = result.url
          } else {
            window.open(result.url, '_blank')
          }
        })}
      />
    </div>
  )
}

const id = { id: "duct-demo/demo-search" }

const DemoSearch = createBlueprint(id, render)

export default DemoSearch