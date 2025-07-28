import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

export interface EmojiItemEvents extends BaseComponentEvents {
  click: (el: HTMLElement, emoji: string) => void
}

export interface EmojiItemLogic {
  getEmoji: () => string
  getName: () => string
  toggleFavorite: () => void
  isFavorite: () => boolean
}

export interface EmojiItemProps {
  item: { emoji: string; name: string; category: string }
  itemKey: string
  showCategory?: boolean
  onClick?: (emoji: string) => void
  onToggleFavorite?: (key: string, isFavorite: boolean) => void
  isFavorite?: (key: string) => boolean
  'on:click'?: (el: HTMLElement, emoji: string) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<EmojiItemProps>) {
  const {
    item,
    itemKey,
    showCategory = true,
    isFavorite,
    ...moreProps
  } = props

  const isCurrentlyFavorite = isFavorite ? isFavorite(itemKey) : false

  return (
    <div
      class="flex items-center gap-3 p-3 rounded-lg bg-base-100 hover:bg-base-200 cursor-pointer transition-colors border border-base-300"
      data-emoji-key={itemKey}
      {...moreProps}
    >
      <div class="text-2xl" data-emoji>
        {item.emoji}
      </div>
      <div class="flex-1">
        <div class="font-medium text-base-content">
          {item.name}
        </div>
        {showCategory && (
          <div class="text-sm text-base-content/60">
            {item.category}
          </div>
        )}
      </div>
      <div class="flex items-center gap-2">
        <button
          class={`btn btn-xs ${isCurrentlyFavorite ? 'btn-warning' : 'btn-ghost'}`}
          data-favorite-btn
          title="Toggle favorite"
        >
          <span data-favorite-icon>{isCurrentlyFavorite ? '★' : '☆'}</span>
        </button>
        <button
          class="btn btn-xs btn-primary"
          data-copy-btn
          title="Copy emoji"
        >
          Copy
        </button>
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<EmojiItemEvents>, props: any): BindReturn<EmojiItemLogic> {
  const emojiKeyAttr = el.getAttribute('data-emoji-key')
  const emojiElement = el.querySelector('[data-emoji]') as HTMLElement
  const favoriteBtn = el.querySelector('[data-favorite-btn]') as HTMLElement
  const favoriteIcon = el.querySelector('[data-favorite-icon]') as HTMLElement
  const copyBtn = el.querySelector('[data-copy-btn]') as HTMLElement

  function getEmoji(): string {
    return emojiElement?.textContent || ''
  }

  function getName(): string {
    return emojiKeyAttr || ''
  }

  function toggleFavorite(): void {
    const currentState = props.isFavorite ? props.isFavorite(emojiKeyAttr) : false
    const newState = !currentState
    
    // Call parent's toggle function
    if (props.onToggleFavorite && emojiKeyAttr) {
      props.onToggleFavorite(emojiKeyAttr, newState)
    }
    
    // Update UI immediately
    if (favoriteIcon) {
      favoriteIcon.textContent = newState ? '★' : '☆'
    }
    if (favoriteBtn) {
      favoriteBtn.className = `btn btn-xs ${newState ? 'btn-warning' : 'btn-ghost'}`
    }
  }

  function isFavorite(): boolean {
    return props.isFavorite ? props.isFavorite(emojiKeyAttr) : false
  }

  function handleClick(e: Event) {
    const target = e.target as HTMLElement
    if (target.closest('[data-favorite-btn]')) {
      toggleFavorite()
      return
    }

    if (target.closest('[data-copy-btn]')) {
      const emoji = getEmoji()
      navigator.clipboard.writeText(emoji).then(() => {
        const originalText = copyBtn.textContent
        copyBtn.textContent = 'Copied!'
        setTimeout(() => {
          copyBtn.textContent = originalText
        }, 1000)
      })
      return
    }

    // Main click handler
    const emoji = getEmoji()
    eventEmitter.emit('click', emoji)
  }

  // Set up event listeners
  el.addEventListener('click', handleClick)

  function release() {
    el.removeEventListener('click', handleClick)
  }

  return {
    getEmoji,
    getName,
    toggleFavorite,
    isFavorite,
    release
  }
}

const id = { id: "duct-demo/emoji-item" }

export default () => {
  return createBlueprint<EmojiItemProps, EmojiItemEvents, EmojiItemLogic>(
    id,
    render,
    {
      domEvents: [],
      bind
    }
  )
}