import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

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

  const containerClasses = `sidebar-nav ${containerClass} ${className}`.trim()

  return (
    <div
      class={containerClasses}
      {...moreProps}
    >
      {headerContent && (
        <div class={`sidebar-nav-header ${headerClass}`.trim()}>
          {headerContent}
        </div>
      )}

      <nav class={`sidebar-nav-content ${contentClass}`.trim()}>
        {content.map((item, index) => {
          if ('type' in item && item.type === 'separator') {
            return (
              <div data-key={`separator-${index}`} class={`sidebar-nav-separator ${separatorClass}`.trim()}>
                {item.title && (
                  <div class={`sidebar-nav-separator-title ${separatorTitleClass}`.trim()}>
                    {item.title}
                  </div>
                )}
              </div>
            )
          } else {
            const section = item as SidebarNavSection
            return (
              <div data-key={section.id} class={`sidebar-nav-section ${sectionClass}`.trim()}>
                <div class={`sidebar-nav-section-title ${sectionTitleClass}`.trim()}>
                  {section.title}
                </div>
                <ul class={`sidebar-nav-items ${itemsClass}`.trim()}>
                  {section.items.map(navItem => (
                    <li data-key={navItem.id} class={`sidebar-nav-item ${itemClass}`.trim()}>
                      <a
                        href={navItem.href || `/${navItem.id}`}
                        class={`sidebar-nav-item-link ${currentItem === navItem.id ? 'active' : ''} ${itemLinkClass}`.trim()}
                        data-nav-item-id={navItem.id}
                      >
                        <div class={`sidebar-nav-item-content ${itemContentClass}`.trim()}>
                          <div class={`sidebar-nav-item-title ${itemTitleClass}`.trim()}>{navItem.title}</div>
                          {navItem.description && (
                            <div class={`sidebar-nav-item-description ${itemDescriptionClass}`.trim()}>{navItem.description}</div>
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