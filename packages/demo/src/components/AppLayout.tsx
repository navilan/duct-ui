import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef, isBrowser } from "@duct-ui/core"
import Drawer, { DrawerLogic } from "@duct-ui/components/layout/drawer"
import Sidebar, { SidebarLogic } from "@components/Sidebar"
import DemoHeader from "@components/DemoHeader"
import ThemeToggle from "@components/ThemeToggle"
import { sections, getItemById, getDefaultItem, docsItems, componentDemos } from "../catalog"

export type AppLayoutCategory = 'docs' | 'demos'

export interface AppLayoutEvents extends BaseComponentEvents {
  navigate: (el: HTMLElement, demoId: string) => void
}

export interface AppLayoutLogic {
  refreshChildren: (children: JSX.Element) => void
  updateCurrentItem: (currentDemo: string) => void
  scrollContentToTop: () => void
  navigate: (demoId: string) => void
}

export interface AppLayoutProps {
  currentItem?: string
  category?: AppLayoutCategory
  children?: JSX.Element
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:navigate'?: (el: HTMLElement, demoId: string) => void
}

// Store drawer and sidebar refs to access their logic
const drawerRef = createRef<DrawerLogic>()
const sidebarRef = createRef<SidebarLogic>()
let eventEmitter: EventEmitter<AppLayoutEvents> | undefined
let isDrawerOpen: boolean = false
let navigateFunction: ((demoId: string) => void) | undefined

// Initialize drawer when it becomes available
drawerRef.on('set', (drawerLogic) => {
  if (drawerLogic) {
    isDrawerOpen = window.innerWidth >= 1024
    if (isDrawerOpen) {
      drawerLogic.open()
    } else {
      drawerLogic.close()
    }
  }
})

function getInitialPage(): string {
  let pathname = window.location.pathname.slice(1) // Remove leading /
  let routeType: 'docs' | 'demos' | 'other' = 'other'

  // Remove /docs or /demos prefix if present and track route type
  if (pathname.startsWith('docs/')) {
    pathname = pathname.slice(5) // Remove 'docs/'
    routeType = 'docs'
  } else if (pathname.startsWith('demos/')) {
    pathname = pathname.slice(6) // Remove 'demos/'
    routeType = 'demos'
  } else if (pathname === 'docs') {
    pathname = ''
    routeType = 'docs'
  } else if (pathname === 'demos') {
    pathname = ''
    routeType = 'demos'
  }

  // First try pathname
  if (pathname) {
    const demo = getItemById(pathname)
    if (demo) return demo.id
  }

  // If we're on /docs or /demos with no specific demo, get first demo of that type
  if (routeType === 'docs') {
    const firstDoc = docsItems[0]
    if (firstDoc) return firstDoc.id
  } else if (routeType === 'demos') {
    const firstDemo = componentDemos[0]
    if (firstDemo) return firstDemo.id
  }

  // Fallback to hash if pathname not found
  const hash = window.location.hash.slice(1) // Remove #
  if (hash) {
    const demo = getItemById(hash)
    if (demo) return demo.id
  }

  // Default demo if neither pathname nor hash found
  return getDefaultItem().id
}

function handleNavigation(_navEl: HTMLElement, demoId: string): void {
  if (drawerRef.current && window.innerWidth < 1024) {
    drawerRef.current.close()
    isDrawerOpen = false
  }

  // Find the category that contains this demo and use its page attribute
  const category = sections.find(cat =>
    'items' in cat && cat.items.some(item => item.id === demoId)
  ) as { page: 'docs' | 'demos' } | undefined

  const routePrefix = category?.page || 'docs'
  const newPath = `/${routePrefix}/${demoId}`

  // Update browser history
  window.history.pushState({}, '', newPath)

  // Use the navigate function to update content
  if (navigateFunction) {
    navigateFunction(demoId)
  }

  eventEmitter?.emit('navigate', demoId)
}

function handleMenuToggle(_el: HTMLElement): void {
  if (drawerRef.current) {
    drawerRef.current.toggle()
    isDrawerOpen = !isDrawerOpen
  }
}

function render(props: BaseProps<AppLayoutProps>) {
  const {
    currentItem,
    category,
    children,
    ...moreProps
  } = props

  // If no currentItem provided, determine from URL
  const currentDemo = currentItem || getInitialPage()

  // If no children provided, get content from catalog
  const content = children || (() => {
    const currentDemoInfo = getItemById(currentDemo) || getDefaultItem()
    return currentDemoInfo.component()
  })()


  return (
    <div class="h-screen bg-base-100 flex flex-col" {...moreProps}>
      <DemoHeader
        isMenuOpen={false}
        on:menuToggle={handleMenuToggle}
        data-header
      />

      {/* Navigation header - matches content pages layout */}
      <header class="border-b border-base-300 bg-base-100/80 backdrop-blur-sm flex-shrink-0">
        <nav class="max-w-6xl mx-auto px-4 py-3">
          <div class="flex items-center justify-end">
            {/* Navigation Links */}
            <div class="hidden md:flex items-center gap-6">
              <a href="/" class="text-base-content hover:text-primary transition-colors font-medium">Home</a>
              <a href="/docs" class="text-base-content hover:text-primary transition-colors font-medium">Documentation</a>
              <a href="/demos" class="text-base-content hover:text-primary transition-colors font-medium">Demos</a>
              <a href="/blog" class="text-base-content hover:text-primary transition-colors font-medium">Blog</a>
              <a href="https://github.com/navilan/duct-ui" target="_blank" rel="noopener noreferrer" class="text-base-content hover:text-primary transition-colors font-medium flex items-center gap-1">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
            
            {/* Mobile Menu Button */}
            <div class="dropdown dropdown-end md:hidden">
              <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-50">
                <li><a href="/">Home</a></li>
                <li><a href="/docs">Documentation</a></li>
                <li><a href="/demos">Demos</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="https://github.com/navilan/duct-ui" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <Drawer
        ref={drawerRef}
        isOpen={false}
        persistent={true}
        side="left"
        class="flex-1 min-h-0 !h-full"
        drawerClass="!h-full"
        contentClass="!h-full"
        data-drawer
        drawerContent={
          <Sidebar
            ref={sidebarRef}
            currentItem={currentDemo}
            category={category}
            on:navigate={handleNavigation}
            data-sidebar
          />
        }
        mainContent={
          <main class="flex-1 overflow-hidden bg-base-100 min-h-0" data-main-content>
            {content}
          </main>
        }
      />

      <ThemeToggle />
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<AppLayoutEvents>): BindReturn<AppLayoutLogic> {
  eventEmitter = _eventEmitter
  const mainContent = el.querySelector('[data-main-content]') as HTMLElement
  let currentPage = getInitialPage()

  function refreshChildren(children: JSX.Element): void {
    if (mainContent) {
      mainContent.innerHTML = children.toString()
    }
  }

  function setupRouting(): void {
    window.addEventListener('popstate', () => {
      let pathname = window.location.pathname.slice(1) // Remove leading /
      let routeType: 'docs' | 'demos' | 'other' = 'other'

      // Remove /docs or /demos prefix if present and track route type
      if (pathname.startsWith('docs/')) {
        pathname = pathname.slice(5) // Remove 'docs/'
        routeType = 'docs'
      } else if (pathname.startsWith('demos/')) {
        pathname = pathname.slice(6) // Remove 'demos/'
        routeType = 'demos'
      } else if (pathname === 'docs') {
        pathname = ''
        routeType = 'docs'
      } else if (pathname === 'demos') {
        pathname = ''
        routeType = 'demos'
      }

      // First try pathname
      let demo = null
      if (pathname) {
        demo = getItemById(pathname)
      }

      // If we're on /docs or /demos with no specific demo, get first demo of that type
      if (!demo) {
        if (routeType === 'docs') {
          demo = docsItems[0]
        } else if (routeType === 'demos') {
          demo = componentDemos[0]
        }
      }

      // Fallback to hash if pathname not found
      if (!demo) {
        const hash = window.location.hash.slice(1) // Remove #
        if (hash) {
          demo = getItemById(hash)
        }
      }

      // Use found demo or default
      const targetDemo = demo || getDefaultItem()
      currentPage = targetDemo.id
      updateContent()
    })
  }

  function updateContent(): void {
    const currentDemoInfo = getItemById(currentPage) || getDefaultItem()

    // Update page title
    document.title = `${currentDemoInfo.title} - Duct UI`
    refreshChildren(currentDemoInfo.component())
    updateCurrentItem(currentPage)
    scrollContentToTop()
  }

  function navigate(demoId: string): void {
    currentPage = demoId
    updateContent()
  }

  // Store the navigate function so handleNavigation can access it
  navigateFunction = navigate

  // Setup routing on initialization
  setupRouting()

  // Set initial page title
  const currentDemoInfo = getItemById(currentPage) || getDefaultItem()
  document.title = `${currentDemoInfo.title} - Duct UI`

  function handleResize() {
    const isDesktop = window.innerWidth >= 1024
    if (isDesktop && !isDrawerOpen) {
      isDrawerOpen = true
      if (drawerRef.current) {
        drawerRef.current.open()
      }
    } else if (!isDesktop && isDrawerOpen) {
      isDrawerOpen = false
      if (drawerRef.current) {
        drawerRef.current.close()
      }
    }
  }

  function updateCurrentItem(demoId: string) {
    if (sidebarRef.current) {
      sidebarRef.current.updateCurrentItem(demoId)
    }
  }

  function scrollContentToTop() {
    if (drawerRef.current) {
      drawerRef.current.scrollToTop()
    }
  }

  window.addEventListener('resize', handleResize)

  function release() {
    window.removeEventListener('resize', handleResize)
  }


  return {
    refreshChildren,
    updateCurrentItem,
    scrollContentToTop,
    navigate,
    release
  }
}

const id = { id: "duct-demo/app-layout" }

const AppLayout = createBlueprint<AppLayoutProps, AppLayoutEvents, AppLayoutLogic>(
  id,
  render,
  {
    bind
  }
)

export default AppLayout