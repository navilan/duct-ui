import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps, renderProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { cn } from "../utils/cn.js"
import Icon, { type IconSource, type IconSize } from "../images/icon.js"
import SearchResultComponent, { type SearchResult as SearchResultType } from "./search-result.js"

export type SearchResult = SearchResultType

export interface SearchEvents extends BaseComponentEvents {
  search: (query: string) => void
  select: (result: SearchResult) => void
  open: () => void
  close: () => void
}

export interface SearchLogic {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
  setQuery: (query: string) => void
  getQuery: () => string
  setResults: (results: SearchResult[]) => void
  getResults: () => SearchResult[]
  selectResult: (index: number) => void
}

export type SearchProps = {
  placeholder?: string
  searchIcon?: IconSource
  searchIconSize?: IconSize
  searchIconClass?: string
  inputClass?: string
  containerClass?: string
  dropdownClass?: string
  resultsClass?: string
  resultItemClass?: string
  resultTitleClass?: string
  resultExcerptClass?: string
  resultUrlClass?: string
  noResultsClass?: string
  loadingClass?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:search'?: (el: HTMLElement, query: string) => void
  'on:select'?: (el: HTMLElement, result: SearchResult) => void
  'on:open'?: (el: HTMLElement) => void
  'on:close'?: (el: HTMLElement) => void
} & Record<string, any>

function renderSearchIcon(icon: IconSource, size?: IconSize, iconClass: string = ""): JSX.Element {
  return <Icon icon={icon} size={size} class={iconClass} />
}

function render(props: BaseProps<SearchProps>) {
  const {
    placeholder = "Search...",
    searchIcon = "🔍",
    searchIconSize = "sm",
    searchIconClass = "",
    inputClass = "",
    containerClass = "",
    dropdownClass = "",
    resultsClass = "",
    resultItemClass = "",
    resultTitleClass = "",
    resultExcerptClass = "",
    resultUrlClass = "",
    noResultsClass = "",
    loadingClass = "",
    class: className = "",
    ...moreProps
  } = props

  const searchIconElement = renderSearchIcon(searchIcon, searchIconSize, cn("search-icon", searchIconClass))

  return (
    <div
      data-search-open="false"
      class={cn("search-container", containerClass, className)}
      {...renderProps(moreProps)}
    >
      <div class={cn("search-input-wrapper")}>
        {searchIconElement}
        <input
          type="text"
          placeholder={placeholder}
          class={cn(inputClass || "search-input")}
          data-search-input
        />
      </div>
      <div
        class={cn(dropdownClass || "search-dropdown")}
        data-search-dropdown
        style="display: none;"
      >
        <div class={cn(resultsClass || "search-results")} data-search-results>
          <div class={cn(loadingClass || "search-loading")} data-search-loading style="display: none;">
            Loading...
          </div>
          <div class={cn(noResultsClass || "search-no-results")} data-search-no-results style="display: none;">
            No results found
          </div>
        </div>
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<SearchEvents>, props: BaseProps<SearchProps>): BindReturn<SearchLogic> {
  const input = el.querySelector('[data-search-input]') as HTMLInputElement
  const dropdown = el.querySelector('[data-search-dropdown]') as HTMLElement
  const results = el.querySelector('[data-search-results]') as HTMLElement
  const loadingEl = el.querySelector('[data-search-loading]') as HTMLElement
  const noResultsEl = el.querySelector('[data-search-no-results]') as HTMLElement

  if (!input || !dropdown || !results || !loadingEl || !noResultsEl) {
    throw new Error('Search component missing required elements')
  }

  let searchResults: SearchResult[] = []
  let debounceTimeout: number | null = null
  let selectedIndex = -1

  function open() {
    el.dataset.searchOpen = 'true'
    dropdown.style.display = 'block'
    eventEmitter.emit('open')
  }

  function close() {
    el.dataset.searchOpen = 'false'
    dropdown.style.display = 'none'
    selectedIndex = -1
    eventEmitter.emit('close')
  }

  function toggle() {
    if (isOpen()) {
      close()
    } else {
      open()
    }
  }

  function isOpen(): boolean {
    return el.dataset.searchOpen === 'true'
  }

  function setQuery(query: string) {
    input.value = query
    handleSearch(query)
  }

  function getQuery(): string {
    return input.value
  }

  function setResults(results: SearchResult[]) {
    searchResults = results
    renderResults()
  }

  function getResults(): SearchResult[] {
    return searchResults
  }

  function selectResult(index: number) {
    if (index >= 0 && index < searchResults.length) {
      const result = searchResults[index]
      eventEmitter.emit('select', result)
      close()
    }
  }

  function showLoading() {
    loadingEl.style.display = 'block'
    noResultsEl.style.display = 'none'
    clearResultItems()
  }

  function hideLoading() {
    loadingEl.style.display = 'none'
  }

  function showNoResults() {
    noResultsEl.style.display = 'block'
  }

  function hideNoResults() {
    noResultsEl.style.display = 'none'
  }

  function clearResultItems() {
    const existingItems = results.querySelectorAll('[data-result-item]')
    existingItems.forEach(item => item.remove())
  }

  function renderResults() {
    hideLoading()
    clearResultItems()

    if (searchResults.length === 0) {
      showNoResults()
      return
    }

    hideNoResults()

    // Create results HTML using SearchResult components
    const resultElements = searchResults.map((result, index) =>
      SearchResultComponent({
        result,
        isActive: index === selectedIndex,
        itemClass: props.resultItemClass,
        titleClass: props.resultTitleClass,
        excerptClass: props.resultExcerptClass,
        urlClass: props.resultUrlClass,
        'data-result-item': '',
        'data-index': index.toString(),
        'on:click': (el: HTMLElement, result: SearchResult) => {
          const index = parseInt(el.dataset.index || '0')
          selectResult(index)
        }
      })
    )

    // Convert JSX elements to HTML and append
    resultElements.forEach(resultElement => {
      const htmlString = resultElement.toString()
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlString
      const renderedElement = tempDiv.firstElementChild as HTMLElement
      if (renderedElement) {
        results.appendChild(renderedElement)
      }
    })
  }

  function handleSearch(query: string) {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    debounceTimeout = setTimeout(() => {
      if (query.trim()) {
        showLoading()
        open()
        eventEmitter.emit('search', query)
      } else {
        close()
      }
    }, 300) as any
  }

  function handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement
    handleSearch(target.value)
  }

  function handleInputFocus() {
    if (input.value.trim() && searchResults.length > 0) {
      open()
    }
  }

  function handleResultClick(e: Event) {
    const target = e.target as HTMLElement
    const item = target.closest('[data-result-item]') as HTMLElement
    if (item) {
      const index = parseInt(item.dataset.index || '0')
      selectResult(index)
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen()) return

    switch (e.key) {
      case 'Escape':
        close()
        input.blur()
        break
      case 'ArrowDown':
        e.preventDefault()
        selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1)
        updateSelectedHighlight()
        break
      case 'ArrowUp':
        e.preventDefault()
        selectedIndex = Math.max(selectedIndex - 1, -1)
        updateSelectedHighlight()
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectResult(selectedIndex)
        }
        break
    }
  }

  function updateSelectedHighlight() {
    const items = results.querySelectorAll('[data-result-item]')
    items.forEach((item, index) => {
      item.classList.toggle('selected', index === selectedIndex)
    })
  }

  function handleClickOutside(e: Event) {
    const target = e.target as HTMLElement
    if (!el.contains(target) && isOpen()) {
      close()
    }
  }

  // Event listeners
  input.addEventListener('input', handleInputChange)
  input.addEventListener('focus', handleInputFocus)
  input.addEventListener('keydown', handleKeydown)
  results.addEventListener('click', handleResultClick)
  document.addEventListener('click', handleClickOutside)

  function release() {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    input.removeEventListener('input', handleInputChange)
    input.removeEventListener('focus', handleInputFocus)
    input.removeEventListener('keydown', handleKeydown)
    results.removeEventListener('click', handleResultClick)
    document.removeEventListener('click', handleClickOutside)
  }

  return {
    open,
    close,
    toggle,
    isOpen,
    setQuery,
    getQuery,
    setResults,
    getResults,
    selectResult,
    release
  }
}

const id = { id: "duct/search" }

const Search = createBlueprint<SearchProps, SearchEvents, SearchLogic>(
  id,
  render,
  {
    bind
  }
)

export default Search