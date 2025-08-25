import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { createRef } from "@duct-ui/core"
import { EventEmitter } from "@duct-ui/core/shared"
import { cn } from "../utils/cn.js"
import Search, { type SearchEvents, type SearchLogic, type SearchResult } from "./search.js"
import Modal, { type ModalEvents, type ModalLogic } from "../layout/modal.js"

export interface SearchModalEvents extends BaseComponentEvents {
  open: () => void
  close: () => void
  search: (query: string) => void
  select: (result: SearchResult) => void
}

export interface SearchModalLogic {
  show: () => void
  hide: () => void
  toggle: () => void
  isVisible: () => boolean
  setResults: (results: SearchResult[]) => void
  getQuery: () => string
}

export interface SearchModalProps {
  placeholder?: string
  searchProvider?: (query: string) => Promise<SearchResult[]>
  hotkey?: string
  hotkeyCombination?: string[]
  modalClass?: string
  searchClass?: string
  contentClass?: string
  'on:open'?: () => void
  'on:close'?: () => void
  'on:search'?: (el: HTMLElement, query: string) => void
  'on:select'?: (el: HTMLElement, result: SearchResult) => void
}

// Create refs for child components at module level
const modalRef = createRef<ModalLogic>()
const searchRef = createRef<SearchLogic>()

function render(props: BaseProps<SearchModalProps>) {
  const {
    placeholder = "Search...",
    hotkey = "k",
    hotkeyCombination = ["cmd"],
    modalClass = "",
    searchClass = "",
    contentClass = "",
    'on:search': onSearch,
    'on:select': onSelect,
    'on:open': onOpen,
    'on:close': onClose,
    ...moreProps
  } = props

  const hotkeyDisplay = hotkeyCombination.includes("cmd") || hotkeyCombination.includes("ctrl")
    ? `${hotkeyCombination.includes("cmd") ? "⌘" : "Ctrl+"}${hotkey.toUpperCase()}`
    : hotkey.toUpperCase()

  return (
    <div {...moreProps}>
      <Modal
        ref={modalRef}
        isOpen={false}
        contentPosition="top-center"
        closeOnOverlayClick={true}
        overlayClass={cn("search-modal", modalClass)}
        contentClass={cn("search-modal-content", contentClass)}
      >
        <div class="search-modal-inner">
          {/* Search Header */}
          <div class="search-modal-header">
            <Search
              ref={searchRef}
              placeholder={placeholder}
              searchIcon="🔍"
              class={cn("search-modal-search", searchClass)}
              containerClass="search-modal-search-container"
              inputClass="search-modal-input"
              dropdownClass="search-modal-dropdown"
              resultsClass="search-modal-results"
              resultItemClass="search-modal-result-item"
              resultTitleClass="search-modal-result-title"
              resultExcerptClass="search-modal-result-excerpt"
              resultUrlClass="search-modal-result-url"
              noResultsClass="search-modal-no-results"
              loadingClass="search-modal-loading"
              on:search={onSearch}
              on:select={onSelect}
            />
          </div>

          {/* Empty State */}
          <div class="search-modal-empty-state" data-empty-state>
            <div class="search-modal-empty-icon">🔍</div>
            <div class="search-modal-empty-title">Start typing to search</div>
            <div class="search-modal-empty-subtitle">Find pages, posts, and content across the site</div>
          </div>

          {/* Footer */}
          <div class="search-modal-footer">
            <div class="search-modal-footer-shortcuts">
              <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
              <span><kbd>↵</kbd> select</span>
              <span><kbd>esc</kbd> close</span>
            </div>
          </div>

          {/* Hotkey Hint - Below Footer */}
          <div class="search-modal-hotkey-hint">
            Press <kbd class="search-modal-kbd">{hotkeyDisplay}</kbd> to bring this up
          </div>
        </div>
      </Modal>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<SearchModalEvents>, props: BaseProps<SearchModalProps>): BindReturn<SearchModalLogic> {
  const emptyState = el.querySelector('[data-empty-state]') as HTMLElement

  if (!emptyState) {
    throw new Error('SearchModal: Missing required elements')
  }

  let isInitialized = false

  // Initialize global hotkey listener
  function initializeHotkey() {
    if (isInitialized) return

    const hotkey = props.hotkey || "k"
    const combination = props.hotkeyCombination || ["cmd"]

    function handleGlobalKeydown(e: KeyboardEvent) {
      const isCmd = combination.includes("cmd") && (e.metaKey || e.ctrlKey)
      const isCtrl = combination.includes("ctrl") && e.ctrlKey
      const isShift = combination.includes("shift") && e.shiftKey
      const isAlt = combination.includes("alt") && e.altKey

      const matchesModifiers = isCmd || isCtrl ||
        (combination.includes("shift") && isShift) ||
        (combination.includes("alt") && isAlt)

      if (matchesModifiers && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault()
        show()
      }
    }

    document.addEventListener('keydown', handleGlobalKeydown)
    isInitialized = true

    return () => {
      document.removeEventListener('keydown', handleGlobalKeydown)
      isInitialized = false
    }
  }

  const cleanupHotkey = initializeHotkey()

  // Initialize global click listener for trigger elements
  function handleGlobalClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    // Check if the clicked element or any of its parents has the trigger attribute
    const trigger = target.closest('[data-duct-search-modal-trigger]')
    if (trigger) {
      e.preventDefault()
      show()
    }
  }

  // Add the global click listener
  document.addEventListener('click', handleGlobalClick)

  function show() {
    if (!modalRef.current) return
    modalRef.current.show()
    // Focus the search input when modal opens
    setTimeout(() => {
      const input = el.querySelector('input')
      if (input) {
        input.focus()
      }
    }, 100)
    eventEmitter.emit('open')
  }

  function hide() {
    if (!modalRef.current) return
    modalRef.current.hide()
    // Clear search when modal closes
    if (searchRef.current) {
      searchRef.current.setQuery('')
      searchRef.current.close()
    }
    eventEmitter.emit('close')
  }

  function toggle() {
    if (!modalRef.current) return
    if (modalRef.current.isVisible()) {
      hide()
    } else {
      show()
    }
  }

  function isVisible(): boolean {
    return modalRef.current?.isVisible() ?? false
  }

  function setResults(results: SearchResult[]) {
    if (!searchRef.current) return
    searchRef.current.setResults(results)

    // Show/hide empty state based on search activity
    const hasQuery = searchRef.current.getQuery().trim().length > 0
    const hasResults = results.length > 0

    if (hasQuery || hasResults) {
      emptyState.style.display = 'none'
    } else {
      emptyState.style.display = 'block'
    }
  }

  function getQuery(): string {
    return searchRef.current?.getQuery() ?? ''
  }

  // Event handling is done through 'on:' props in render function

  function release() {
    if (cleanupHotkey) {
      cleanupHotkey()
    }
    // Remove the global click listener
    document.removeEventListener('click', handleGlobalClick)
    // Component cleanup is handled by individual components
  }

  return {
    show,
    hide,
    toggle,
    isVisible,
    setResults,
    getQuery,
    release
  }
}

const id = { id: "duct/search-modal" }

const SearchModal = createBlueprint<SearchModalProps, SearchModalEvents, SearchModalLogic>(
  id,
  render,
  {
    bind
  }
)

export default SearchModal