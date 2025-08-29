import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { cn } from "../utils/cn.js"

export interface TabItem {
  id: string
  label: string
  content: () => JSX.Element
  disabled?: boolean
}

export interface TabsEvents extends BaseComponentEvents {
  change: (el: HTMLElement, activeTabId: string) => void
}

export interface TabsLogic {
  getActiveTab: () => string
  setActiveTab: (tabId: string) => void
  getTabItems: () => TabItem[]
}

export interface TabsProps {
  items: TabItem[]
  activeTabId?: string
  tabClass?: string
  activeTabClass?: string
  contentClass?: string
  'on:change'?: (el: HTMLElement, activeTabId: string) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<TabsProps>) {
  const {
    items,
    activeTabId,
    tabClass = 'tab',
    activeTabClass = 'tab-active',
    contentClass = 'tab-content',
    ...moreProps
  } = props

  const currentActiveId = activeTabId || items[0]?.id || ''

  return (
    <div class="tabs-container" data-tabs-container {...renderProps(moreProps)}>
      {/* Tab Navigation */}
      <div class="tabs tabs-bordered" data-tab-nav>
        {items.map(item => {
          const isActive = item.id === currentActiveId
          const isDisabled = item.disabled || false
          const tabClasses = cn(
            tabClass,
            isActive && activeTabClass,
            isDisabled && 'tab-disabled'
          )

          return (
            <button
              data-tab-key={item.id}
              class={tabClasses}
              data-tab-btn={item.id}
              disabled={isDisabled}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div class="tab-content-container" data-tab-content-container>
        {items.map(item => {
          const isActive = item.id === currentActiveId
          return (
            <div
              data-tab-key={item.id}
              class={cn(contentClass, isActive ? 'block' : 'hidden')}
              data-tab-content={item.id}
            >
              {item.content()}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<TabsEvents>, props: any): BindReturn<TabsLogic> {
  // Get the tabs container first
  const tabsContainer = el

  // Query only direct children to avoid selecting nested tabs
  const tabNav = tabsContainer.querySelector(':scope > [data-tab-nav]') as HTMLElement
  const tabButtons = tabNav ? tabNav.querySelectorAll(':scope > [data-tab-btn]') as NodeListOf<HTMLButtonElement> : []
  const tabContentContainer = tabsContainer.querySelector(':scope > [data-tab-content-container]') as HTMLElement

  const items: TabItem[] = props.items || []
  const tabClass = props.tabClass || 'tab'
  const activeTabClass = props.activeTabClass || 'tab-active'
  const contentClass = props.contentClass || 'tab-content'

  let activeTabId = props.activeTabId || items[0]?.id || ''

  function updateUI() {
    // Update tab buttons
    tabButtons.forEach(btn => {
      const tabId = btn.getAttribute('data-tab-btn')
      const isActive = tabId === activeTabId
      const item = items.find(i => i.id === tabId)
      const isDisabled = item?.disabled || false

      // Rebuild classes completely
      btn.className = cn(
        tabClass,
        isActive && activeTabClass,
        isDisabled && 'tab-disabled'
      )
    })

    // Update tab content visibility
    if (tabContentContainer) {
      const tabContents = tabContentContainer.querySelectorAll(':scope > [data-tab-content]') as NodeListOf<HTMLElement>

      tabContents.forEach(content => {
        const tabId = content.getAttribute('data-tab-content')
        const isActive = tabId === activeTabId

        // Rebuild content classes
        content.className = cn(
          contentClass,
          isActive ? 'block' : 'hidden'
        )
      })
    }
  }

  function getActiveTab(): string {
    return activeTabId
  }

  function setActiveTab(tabId: string): void {
    const item = items.find(i => i.id === tabId)
    if (!item || item.disabled) return

    activeTabId = tabId
    updateUI()
    eventEmitter.emit('change', activeTabId)
  }

  function getTabItems(): TabItem[] {
    return [...items]
  }

  function handleTabClick(event: Event) {
    const target = event.target as HTMLButtonElement
    const tabId = target.getAttribute('data-tab-btn')
    if (tabId && !target.disabled) {
      setActiveTab(tabId)
    }
  }

  // Set up event listeners
  tabButtons.forEach(btn => {
    btn.addEventListener('click', handleTabClick)
  })

  // Initialize UI with the active tab
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    updateUI()
  })

  function release() {
    tabButtons.forEach(btn => {
      btn.removeEventListener('click', handleTabClick)
    })
  }

  return {
    getActiveTab,
    setActiveTab,
    getTabItems,
    release
  }
}

const id = { id: "duct/tabs" }

const Tabs = createBlueprint<TabsProps, TabsEvents, TabsLogic>(
  id,
  render,
  {
    bind
  }
)

export default Tabs