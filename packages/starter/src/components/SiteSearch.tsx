import { createBlueprint, type BaseProps, renderProps } from '@duct-ui/core'
import type { BindReturn } from '@duct-ui/core/blueprint'

export interface SiteSearchLogic {
  openSearch: () => void
}

interface SiteSearchProps {
  showButton?: boolean
  "on:search"?: (_el: HTMLElement) => void
}


function render(props: BaseProps<SiteSearchProps>) {
  const {
    showButton = true,
    ...moreProps
  } = props

  return (
    <div class="site-search" {...renderProps(moreProps)}>
      {/* Search trigger button */}
      {showButton && (
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            class="btn btn-outline hover:bg-primary/80 hover:text-accent btn-lg gap-2 min-w-64"
            data-open-search
          >
            <span class="text-lg">🔍</span>
            Search site content
            <kbd class="kbd bg-primary">⌘k</kbd>
          </button>
        </div>
      )}
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: any, props: BaseProps<SiteSearchProps>): BindReturn<SiteSearchLogic> {
  const openButton = el.querySelector('[data-open-search]') as HTMLButtonElement

  function openSearch() {
    // Call the onOpenSearch callback if provided
    eventEmitter.emit('search')
  }

  // Open search button handler (only if button exists)
  if (openButton) {
    openButton.addEventListener('click', openSearch)
  }

  return {
    openSearch,
    release: () => {
      if (openButton) {
        openButton.removeEventListener('click', openSearch)
      }
    }
  }
}

const id = { id: "starter/site-search" }

const SiteSearch = createBlueprint<SiteSearchProps, {}, SiteSearchLogic>(
  id,
  render,
  { bind }
)

export default SiteSearch