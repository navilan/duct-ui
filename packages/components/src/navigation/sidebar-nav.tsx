import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"

export interface SidebarNavEvents extends BaseComponentEvents {
  navigate: (el: HTMLElement, itemId: string) => void
}

export interface SidebarNavLogic {}

export interface SidebarNavItem {
  id: string
  title: string
  description?: string
  href?: string
}

export interface SidebarNavSection {
  id: string
  title: string
  items: SidebarNavItem[]
}

export type SidebarNavProps = {
  sections: SidebarNavSection[]
  currentItem?: string
  width?: string
  headerContent?: any
  class?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:navigate'?: (el: HTMLElement, itemId: string) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<SidebarNavProps>) {
  const {
    sections,
    currentItem,
    width = "w-64",
    headerContent,
    class: className = "",
    ...moreProps
  } = props

  const containerClasses = `${width} bg-base-200 h-screen overflow-y-auto border-r border-base-300 ${className}`.trim()

  return (
    <div
      class={containerClasses}
      {...moreProps}
    >
      {headerContent && (
        <div class="p-4 border-b border-base-300">
          {headerContent}
        </div>
      )}

      <nav class="p-2">
        {sections.map(section => (
          <div data-key={section.id} class="mb-4">
            <div class="px-4 py-2 text-sm font-semibold text-base-content/60 uppercase tracking-wider">
              {section.title}
            </div>
            <ul class="menu menu-sm">
              {section.items.map(item => (
                <li data-key={item.id}>
                  <a
                    href={item.href || `#${item.id}`}
                    class={`block px-4 py-2 rounded-lg hover:bg-base-300 transition-colors ${
                      currentItem === item.id 
                        ? 'bg-primary text-primary-content' 
                        : 'text-base-content'
                    }`}
                    data-nav-item-id={item.id}
                  >
                    <div>
                      <div class="font-medium">{item.title}</div>
                      {item.description && (
                        <div class="text-xs opacity-70">{item.description}</div>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<SidebarNavEvents>): BindReturn<SidebarNavLogic> {
  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    const link = target.closest('a[data-nav-item-id]')
    if (link) {
      e.preventDefault()
      const itemId = link.getAttribute('data-nav-item-id')
      if (itemId) {
        eventEmitter.emit('navigate', itemId)
      }
    }
  }

  el.addEventListener('click', handleClick)

  function release() {
    el.removeEventListener('click', handleClick)
  }

  return {
    release
  }
}

const id = { id: "duct/sidebar-nav" }

export default () => {
  return createBlueprint<SidebarNavProps, SidebarNavEvents, SidebarNavLogic>(
    id,
    render,
    {
      domEvents: ['click'],
      customEvents: ['bind', 'navigate', 'release'],
      bind
    }
  )
}