import { createBlueprint, type BaseComponentEvents, type BaseProps, type BindReturn, renderProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import Button from "@duct-ui/components/button/button"
import EventLog from "@components/EventLog"
import DemoLayout from "@components/DemoLayout"
import Markdown from "@duct-ui/components/content/markdown/markdown"

export interface SearchModalDemoEvents extends BaseComponentEvents {
  log: (el: HTMLElement, event: string) => void
}

export interface SearchModalDemoLogic {
  refresh: () => void
}

export interface SearchModalDemoProps extends BaseProps<SearchModalDemoProps> {}

function render(props: BaseProps<SearchModalDemoProps>) {
  return (
    <DemoLayout title="Search Modal" subtitle="A modal dialog for searching content with keyboard shortcuts">
      <div class="space-y-6">
        {/* Demo Section */}
        <div class="card bg-base-200">
          <div class="card-body">
            <h3 class="card-title text-lg">Integrated Search Modal</h3>
            <div class="space-y-4">
              <p class="text-sm text-base-content/70">
                The search modal is integrated into the application. Click any button below or press <kbd class="kbd kbd-sm">⌘</kbd> + <kbd class="kbd kbd-sm">K</kbd> (or <kbd class="kbd kbd-sm">Ctrl</kbd> + <kbd class="kbd kbd-sm">K</kbd> on Windows/Linux) to open it.
              </p>

              <div class="flex gap-2">
                <Button
                  label="Open Search Modal"
                  class="btn btn-primary"
                  data-duct-search-modal-trigger
                />
              </div>

              <p class="text-sm text-base-content/70">
                The search modal includes all documentation pages and demo components, allowing you to quickly navigate anywhere in the application.
              </p>
            </div>
          </div>
        </div>

        {/* Global Trigger Section */}
        <div class="card bg-base-200">
          <div class="card-body">
            <h3 class="card-title text-lg">Global Search Triggers</h3>
            <p class="text-sm text-base-content/70">
              You can trigger the search modal from anywhere using the <code class="text-xs bg-base-300 px-1 py-0.5 rounded">data-duct-search-modal-trigger</code> attribute:
            </p>

<Markdown content={`
~~~html
<button data-duct-search-modal-trigger>Search</button>
~~~
`} />


            <div class="flex gap-2 mt-4">
              <button
                data-duct-search-modal-trigger
                class="btn btn-secondary"
              >
                🔍 Search (Global Trigger)
              </button>

              <a
                href="#"
                data-duct-search-modal-trigger
                class="link link-primary flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Link
              </a>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div class="card bg-base-200">
          <div class="card-body">
            <h3 class="card-title text-lg">Features</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li>Keyboard shortcut support (⌘/Ctrl + K)</li>
              <li>Escape key to close</li>
              <li>Type-ahead search with filtering</li>
              <li>Click outside to dismiss</li>
              <li>Global trigger support via data attribute</li>
              <li>Integrated with application navigation</li>
              <li>Searches all documentation and demo pages</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoLayout>
  )
}

function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<SearchModalDemoEvents>
): BindReturn<SearchModalDemoLogic> {
  function refresh() {
    // Refresh logic if needed
  }

  return {
    refresh
  }
}

const id = { id: 'duct-demo/search-modal' }

const SearchModalDemo = createBlueprint<SearchModalDemoProps, SearchModalDemoEvents, SearchModalDemoLogic>(
  id,
  render,
  { bind }
)

export default SearchModalDemo