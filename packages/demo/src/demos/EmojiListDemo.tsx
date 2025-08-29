import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import List, { type ListLogic } from "@duct-ui/components/data-display/list"
import Button from "@duct-ui/components/button/button"
import Select from "@duct-ui/components/dropdown/select"
import Toggle, { type ToggleState } from "@duct-ui/components/button/toggle"
import DemoLayout from "@components/DemoLayout"
import EventLog, { EventLogLogic } from "@components/EventLog"
import EmojiItem, { type EmojiItemLogic } from "@components/EmojiItem"
import type { SelectItem } from "@duct-ui/components/dropdown/select"

export interface EmojiListDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface EmojiListDemoLogic {
  // Component logic methods if needed
}

export interface EmojiListDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

// Sample emoji data
const emojiData = {
  "grinning": { emoji: "😀", name: "Grinning Face", category: "Smileys & Emotion" },
  "joy": { emoji: "😂", name: "Face with Tears of Joy", category: "Smileys & Emotion" },
  "heart": { emoji: "❤️", name: "Red Heart", category: "Smileys & Emotion" },
  "fire": { emoji: "🔥", name: "Fire", category: "Objects" },
  "rocket": { emoji: "🚀", name: "Rocket", category: "Travel & Places" },
  "star": { emoji: "⭐", name: "Star", category: "Objects" },
  "unicorn": { emoji: "🦄", name: "Unicorn", category: "Animals & Nature" },
  "pizza": { emoji: "🍕", name: "Pizza", category: "Food & Drink" },
  "coffee": { emoji: "☕", name: "Hot Beverage", category: "Food & Drink" },
  "cake": { emoji: "🎂", name: "Birthday Cake", category: "Food & Drink" },
  "thumbsup": { emoji: "👍", name: "Thumbs Up", category: "People & Body" },
  "clap": { emoji: "👏", name: "Clapping Hands", category: "People & Body" },
  "wave": { emoji: "👋", name: "Waving Hand", category: "People & Body" },
  "sunglasses": { emoji: "😎", name: "Smiling Face with Sunglasses", category: "Smileys & Emotion" },
  "party": { emoji: "🎉", name: "Party Popper", category: "Activities" },
  "gift": { emoji: "🎁", name: "Gift", category: "Objects" },
  "music": { emoji: "🎵", name: "Musical Note", category: "Objects" },
  "laptop": { emoji: "💻", name: "Laptop", category: "Objects" },
  "phone": { emoji: "📱", name: "Mobile Phone", category: "Objects" },
  "book": { emoji: "📚", name: "Books", category: "Objects" },
  "bulb": { emoji: "💡", name: "Light Bulb", category: "Objects" },
  "medal": { emoji: "🏅", name: "Sports Medal", category: "Activities" },
  "rainbow": { emoji: "🌈", name: "Rainbow", category: "Travel & Places" },
  "diamond": { emoji: "💎", name: "Gem Stone", category: "Objects" },
  "crown": { emoji: "👑", name: "Crown", category: "Objects" }
}

type EmojiKey = keyof (typeof emojiData)

// Using refs instead of global variables
const eventLogRef = createRef<EventLogLogic>()
const emojiListRef = createRef<ListLogic<Record<string, any>, EmojiItemLogic>>()
let currentCategory = "all"
let currentPage = 0
const pageSize = 8
let showFavoritesOnly = false
const favoriteEmojis = new Set<string>() // Track favorites globally

function addToLog(message: string) {
  if (eventLogRef.current) {
    eventLogRef.current.addEvent(message)
  }
}

// Filter and pagination logic
function getFilteredEmojis(page: number): Record<string, any> {
  let filteredEntries = Object.entries(emojiData)

  // Filter by favorites first
  if (showFavoritesOnly) {
    filteredEntries = filteredEntries.filter(([key, _]) => favoriteEmojis.has(key))
  }

  // Filter by category
  if (currentCategory !== "all") {
    filteredEntries = filteredEntries.filter(([_, item]) =>
      item.category === currentCategory
    )
  }

  // Apply pagination
  const startIndex = page * pageSize
  const endIndex = startIndex + pageSize
  const paginatedEntries = filteredEntries.slice(startIndex, endIndex)

  // Convert back to object
  return Object.fromEntries(paginatedEntries)
}

function getTotalPages(): number {
  let filteredEntries = Object.entries(emojiData)

  // Filter by favorites first
  if (showFavoritesOnly) {
    filteredEntries = filteredEntries.filter(([key, _]) => favoriteEmojis.has(key))
  }

  // Filter by category
  if (currentCategory !== "all") {
    filteredEntries = filteredEntries.filter(([_, item]) =>
      item.category === currentCategory
    )
  }

  return Math.ceil(filteredEntries.length / pageSize)
}

// Event handlers
function handleEmojiClick(el: HTMLElement, emoji: string) {
  addToLog(`Clicked emoji: ${emoji}`)
}

function handleEmojiToggleFavorite(_emojiKey: string, isFavorite: boolean) {
  const emojiKey = _emojiKey as EmojiKey
  if (isFavorite) {
    favoriteEmojis.add(emojiKey)
    addToLog(`Added ${emojiData[emojiKey].emoji} to favorites`)
  } else {
    favoriteEmojis.delete(emojiKey)
    addToLog(`Removed ${emojiData[emojiKey].emoji} from favorites`)
  }
}

async function handleCategoryChange(el: HTMLElement, item: SelectItem) {
  currentCategory = item.label === "All Categories" ? "all" : item.label
  currentPage = 0
  updatePageLabel()
  addToLog(`Changed category to: ${item.label}`)

  if (emojiListRef.current) {
    await emojiListRef.current.refresh(0)
  }
}

let pageLabelEl: HTMLSpanElement | undefined

function updatePageLabel() {
  if (!pageLabelEl) {
    pageLabelEl = document.getElementById('page-label') as HTMLSpanElement
  }
  pageLabelEl.innerText = `Page ${currentPage + 1} of ${getTotalPages()}`
}

async function handlePrevPage() {
  if (currentPage > 0) {
    currentPage--
    updatePageLabel()
    addToLog(`Previous page: ${currentPage + 1}`)
    if (emojiListRef.current) {
      await emojiListRef.current.refresh(currentPage)
    }
  }
}

async function handleNextPage() {
  if (currentPage < getTotalPages() - 1) {
    currentPage++
    updatePageLabel()
    addToLog(`Next page: ${currentPage + 1}`)
    if (emojiListRef.current) {
      await emojiListRef.current.refresh(currentPage)
    }
  }
}

async function handleToggleFavorites(_el: HTMLElement, state: ToggleState) {
  showFavoritesOnly = state === 'on'
  currentPage = 0
  updatePageLabel()
  if (showFavoritesOnly) {
    if (favoriteEmojis.size > 0) {
      addToLog(`Showing ${favoriteEmojis.size} favorites`)
    } else {
      addToLog('No favorites to show')
    }
  } else {
    addToLog('Showing all emojis')
  }

  if (emojiListRef.current) {
    await emojiListRef.current.refresh(0)
  }
}

function render(props: BaseProps<EmojiListDemoProps>) {
  // Category options
  const categories = Array.from(new Set(Object.values(emojiData).map(item => item.category)))
  const categoryOptions: SelectItem[] = [
    { label: "All Categories", isSelected: true },
    ...categories.map(category => ({ label: category }))
  ]

  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="List Component Demo"
        description="Interactive emoji list with filtering, pagination, and component logic access"
        sourcePath="/demos/EmojiListDemo.tsx"
      >
        <div>
          <div class="space-y-6">

            <div class="flex flex-wrap gap-4 items-center p-4 bg-base-200 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium">Category:</span>
                <Select
                  items={categoryOptions}
                  placeholder="Select category"
                  class="w-48"
                  buttonClass="btn btn-sm btn-outline"
                  menuClass="menu bg-base-200 rounded-box z-[1] w-48 p-2 shadow"
                  on:selectionChange={handleCategoryChange}
                />
              </div>

              <div class="flex items-center gap-2">
                <Button
                  label="← Previous"
                  class="btn btn-sm btn-outline"
                  on:click={handlePrevPage}
                />
                <span class="text-sm px-2" id="page-label">
                  Page {currentPage + 1} of {getTotalPages()}
                </span>
                <Button
                  label="Next →"
                  class="btn btn-sm btn-outline"
                  on:click={handleNextPage}
                />
              </div>

              <Toggle
                onLabel="Show All"
                offLabel="Show Favorites"
                initialState={showFavoritesOnly ? 'on' : 'off'}
                onClass="btn-warning"
                offClass="btn-outline"
                class="btn btn-sm"
                on:change={handleToggleFavorites}
              />
            </div>

            <div>
              <h2 class="text-xl font-semibold mb-4">Emoji Collection</h2>
              <List
                ref={emojiListRef}
                getItems={getFilteredEmojis}
                ItemComponent={EmojiItem}
                itemProps={{
                  showCategory: currentCategory === "all",
                  "on:click": handleEmojiClick,
                  onToggleFavorite: handleEmojiToggleFavorite,
                  isFavorite: (key: string) => favoriteEmojis.has(key)
                }}
                containerClass="grid grid-cols-1 md:grid-cols-2 gap-3"
                initialPage={0}
              />
            </div>

            {/* Event Log */}
            <div>
              <h2 class="text-xl font-semibold mb-4">Activity Log</h2>
              <EventLog
                ref={eventLogRef}
                title="Emoji List Events"
                maxHeight="max-h-48"
                data-event-log-component
              />
            </div>

            <div class="bg-base-200 p-6 rounded-lg">
              <h3 class="text-lg font-medium mb-3">List Component Features Demonstrated:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Function-based items</strong> - `getItems(page)` enables dynamic data loading</li>
                  <li><strong>Pagination</strong> - Built-in page management with `refresh(page)` method</li>
                  <li><strong>Filtering</strong> - Category filtering applied in the `getItems` function</li>
                  <li><strong>Item Props</strong> - Common props spread to all item components</li>
                </ul>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Component Logic Access</strong> - Access list methods via component ref</li>
                  <li><strong>State Management</strong> - Individual item state (favorites) accessible from parent</li>
                  <li><strong>Event Handling</strong> - Item click events bubble up to parent</li>
                  <li><strong>Responsive Layout</strong> - Grid layout adapts to screen size</li>
                </ul>
              </div>

              <div class="mt-4 p-3 bg-info-content rounded border border-info/20">
                <p class="text-sm text-info/70">
                  <strong>Try it:</strong> Click the star button to favorite emojis, then click "Show Favorites"
                  to filter the list to only show your favorite emojis. The favorites state is managed globally
                  and persists across pagination and category changes!
                </p>
              </div>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<EmojiListDemoEvents>): BindReturn<EmojiListDemoLogic> {
  return {
    release: () => {
      // Ref cleanup is handled automatically
    }
  }
}

const id = { id: "duct-demo/emoji-list-demo" }

const EmojiListDemo = createBlueprint<EmojiListDemoProps, EmojiListDemoEvents, EmojiListDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default EmojiListDemo