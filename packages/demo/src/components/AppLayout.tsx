import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import Drawer, { DrawerLogic } from "@duct-ui/components/layout/drawer"
import Sidebar, { SidebarLogic } from "@components/Sidebar"
import DemoHeader from "@components/DemoHeader"
import ThemeToggle from "@components/ThemeToggle"
import { sections, getItemById, getDefaultItem, docsItems, componentDemos } from "../catalog"

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

      <Drawer
        ref={drawerRef}
        isOpen={false}
        persistent={true}
        side="left"
        class="flex-1"
        data-drawer
        drawerContent={
          <Sidebar
            ref={sidebarRef}
            sections={sections}
            currentItem={currentDemo}
            on:navigate={handleNavigation}
            data-sidebar
          />
        }
        mainContent={
          <main class="flex-1 overflow-hidden bg-base-100" data-main-content>
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