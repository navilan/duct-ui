import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { cn } from "../utils/cn.js"

export interface SidebarNavEvents extends BaseComponentEvents {
  navigate: (el: HTMLElement, itemId: string) => void
}

export interface SidebarNavLogic { }

export interface SidebarNavItem {
  id: string
  title: string
  description?: string
  href?: string
}

export interface SidebarNavSeparator {
  type: 'separator'
  title?: string
}

export interface SidebarNavSection {
  id: string
  title: string
  items: SidebarNavItem[]
}

export type SidebarNavContent = SidebarNavSection | SidebarNavSeparator

export type SidebarNavProps = {
  content: SidebarNavContent[]
  currentItem?: string
  width?: string
  headerContent?: any
  class?: string
  containerClass?: string
  headerClass?: string
  contentClass?: string
  sectionClass?: string
  sectionTitleClass?: string
  separatorClass?: string
  separatorTitleClass?: string
  itemsClass?: string
  itemClass?: string
  itemLinkClass?: string
  itemContentClass?: string
  itemTitleClass?: string
  itemDescriptionClass?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:navigate'?: (el: HTMLElement, itemId: string) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<SidebarNavProps>) {
  const {
    content,
    currentItem,
    headerContent,
    class: className = "",
    containerClass = "",
    headerClass = "",
    contentClass = "",
    sectionClass = "",
    sectionTitleClass = "",
    separatorClass = "",
    separatorTitleClass = "",
    itemsClass = "",
    itemClass = "",
    itemLinkClass = "",
    itemContentClass = "",
    itemTitleClass = "",
    itemDescriptionClass = "",
    ...moreProps
  } = props

  const containerClasses = cn("sidebar-nav", containerClass, className)

  return (
    <div
      class={containerClasses}
      {...moreProps}
    >
      {headerContent && (
        <div class={cn("sidebar-nav-header", headerClass)}>
          {headerContent}
        </div>
      )}

      <nav class={cn("sidebar-nav-content", contentClass)}>
        {content.map((item, index) => {
          if ('type' in item && item.type === 'separator') {
            return (
              <div data-key={`separator-${index}`} class={cn("sidebar-nav-separator", separatorClass)}>
                {item.title && (
                  <div class={cn("sidebar-nav-separator-title", separatorTitleClass)}>
                    {item.title}
                  </div>
                )}
              </div>
            )
          } else {
            const section = item as SidebarNavSection
            return (
              <div data-key={section.id} class={cn("sidebar-nav-section", sectionClass)}>
                <div class={cn("sidebar-nav-section-title", sectionTitleClass)}>
                  {section.title}
                </div>
                <ul class={cn("sidebar-nav-items", itemsClass)}>
                  {section.items.map(navItem => (
                    <li data-key={navItem.id} class={cn("sidebar-nav-item", itemClass)}>
                      <a
                        href={navItem.href || `/docs/${navItem.id}`}
                        class={cn("sidebar-nav-item-link", currentItem === navItem.id && 'active', itemLinkClass)}
                        data-nav-item-id={navItem.id}
                      >
                        <div class={cn("sidebar-nav-item-content", itemContentClass)}>
                          <div class={cn("sidebar-nav-item-title", itemTitleClass)}>{navItem.title}</div>
                          {navItem.description && (
                            <div class={cn("sidebar-nav-item-description", itemDescriptionClass)}>{navItem.description}</div>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
        })}
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

const SidebarNav = createBlueprint<SidebarNavProps, SidebarNavEvents, SidebarNavLogic>(
  id,
  render,
  {
    domEvents: ['click'],
    bind
  }
)

export default SidebarNav