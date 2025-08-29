import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { cn } from "../utils/cn.js"

export interface SearchResult {
  url: string
  title: string
  excerpt: string
  score?: number
}

export interface SearchResultEvents extends BaseComponentEvents {
  click: (result: SearchResult) => void
}

export interface SearchResultLogic {
  getResult: () => SearchResult
  setActive: (active: boolean) => void
  isActive: () => boolean
}

export type SearchResultProps = {
  result: SearchResult
  isActive?: boolean
  itemClass?: string
  titleClass?: string
  excerptClass?: string
  urlClass?: string
  'on:click'?: (el: HTMLElement, result: SearchResult) => void
} & Record<string, any>

function render(props: BaseProps<SearchResultProps>) {
  const {
    result,
    isActive = false,
    itemClass = "",
    titleClass = "",
    excerptClass = "",
    urlClass = "",
    class: className = "",
    ...moreProps
  } = props

  return (
    <div
      class={cn(itemClass || "search-result-item", isActive && "selected", className)}
      {...renderProps(moreProps)}
    >
      <div class={cn(titleClass || "search-result-title")}>
        {result.title}
      </div>
      <div class={cn(excerptClass || "search-result-excerpt")}>
        {result.excerpt}
      </div>
      <div class={cn(urlClass || "search-result-url")}>
        {result.url}
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<SearchResultEvents>, props: BaseProps<SearchResultProps>): BindReturn<SearchResultLogic> {
  let isActive = props.isActive || false

  function handleClick() {
    eventEmitter.emit('click', props.result)
  }

  function setActive(active: boolean) {
    isActive = active
    el.classList.toggle('active', active)
  }

  function getResult(): SearchResult {
    return props.result
  }

  function getIsActive(): boolean {
    return isActive
  }

  // Add click event listener
  el.addEventListener('click', handleClick)

  function release() {
    el.removeEventListener('click', handleClick)
  }

  return {
    getResult,
    setActive,
    isActive: getIsActive,
    release
  }
}

const id = { id: "duct/search-result" }

const SearchResultComponent = createBlueprint<SearchResultProps, SearchResultEvents, SearchResultLogic>(
  id,
  render,
  {
    bind
  }
)

export default SearchResultComponent