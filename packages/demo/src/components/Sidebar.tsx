import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import SidebarNav from "@duct-ui/components/layout/sidebar-nav"
import ductLogo from "../icons/duct-logo.svg"

export interface SidebarEvents extends BaseComponentEvents {
  navigate: (el: HTMLElement, demoId: string) => void
}

let eventEmitter: EventEmitter<SidebarEvents> | undefined

function handleNavigate(navEl: HTMLElement, itemId: string): void {
  eventEmitter?.emit('navigate', itemId)
}

export interface SidebarLogic {
  updateCurrentDemo: (currentDemo: string) => void
}

export interface SidebarProps {
  categories: Array<{
    id: string
    title: string
    demos: Array<{ id: string; title: string; description?: string }>
  } | { type: 'separator', title?: string }>
  currentDemo: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:navigate'?: (el: HTMLElement, demoId: string) => void
}

// SidebarNav is now imported directly

function render(props: BaseProps<SidebarProps>) {
  const { categories, currentDemo, ...moreProps } = props

  // Transform demo categories to sidebar content
  const content = categories.map(category => {
    if ('type' in category && category.type === 'separator') {
      return category
    } else {
      const demoCategory = category as {
        id: string
        title: string
        demos: Array<{ id: string; title: string; description?: string }>
      }
      return {
        id: demoCategory.id,
        title: demoCategory.title,
        items: demoCategory.demos.map(demo => ({
          id: demo.id,
          title: demo.title,
          description: demo.description
        }))
      }
    }
  })

  const headerContent = (
    <>
      <div class="flex flex-col items-center mb-8">
        <a href="/">
          <img class="h-36 aspect-square" src={ductLogo} />
        </a>
        <div class="flex flex-col text-center justify-center">
          <h1 class="text-xl font-bold text-base-content">Duct UI</h1>
          <p class="text-sm text-base-content -mt-2">A compact, DOM first UI library</p>
          <div class="flex flex-row gap-3 mt-2">
            <a
              href="https://github.com/navilan/duct-ui"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-3 py-1.5 text-sm text-base-content hover:bg-base-300 rounded-md transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>

            <a
              href="https://www.npmjs.com/package/@duct-ui/core"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 px-3 py-1.5 text-sm text-base-content hover:bg-base-300 rounded-md transition-colors"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.377h-3.456L12.04 19.17H5.113z" />
              </svg>
              NPM
            </a>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center">
        <img alt="NPM Version" src="https://img.shields.io/npm/v/%40duct-ui%2Fcore?style=for-the-badge" />
      </div>
      <div class="bg-neutral/10 flex flex-col text-info p-4 rounded-xl">
        <span>pnpm install @duct-ui/core</span>
        <span>pnpm install @duct-ui/components</span>
      </div>

    </>
  )

  return (
    <div {...moreProps}>
      <SidebarNav
        content={content}
        currentItem={currentDemo}
        headerContent={headerContent}
        on:navigate={handleNavigate}
      />
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<SidebarEvents>): BindReturn<SidebarLogic> {
  let currentDemo = ''
  eventEmitter = _eventEmitter

  function updateCurrentDemo(newDemo: string): void {
    currentDemo = newDemo

    // Update the sidebar nav's current item attribute for consistency
    const sidebarNavEl = el.querySelector('[data-duct-id*="sidebar-nav"]')
    if (sidebarNavEl) {
      sidebarNavEl.setAttribute('data-current-item', newDemo)
    }

    // Remove active class from all navigation links to ensure clean state
    const allNavLinks = el.querySelectorAll('a[data-nav-item-id]')
    allNavLinks.forEach(link => {
      link.classList.remove('active')
    })

    // Add active class to new active link
    const newActiveLink = el.querySelector(`a[data-nav-item-id="${newDemo}"]`)
    if (newActiveLink) {
      newActiveLink.classList.add('active')
    }
  }

  function release() { }

  return {
    updateCurrentDemo,
    release
  }
}

const id = { id: "duct-demo/sidebar" }

const Sidebar = createBlueprint<SidebarProps, SidebarEvents, SidebarLogic>(
  id,
  render,
  {
    bind
  }
)

export default Sidebar