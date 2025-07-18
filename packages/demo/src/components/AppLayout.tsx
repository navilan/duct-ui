import makeDrawer from "@duct-ui/components/layout/drawer"
import Sidebar from "./Sidebar"
import DemoHeader from "./DemoHeader"
import { demoCategories } from "../demos"

export interface AppLayoutProps {
  currentDemo: string
  children: JSX.Element
  'on:navigate'?: (el: HTMLElement, demoId: string) => void
}

// Layout state
let isDrawerOpen: boolean = false
let drawerComponent: any

function setInitialDrawerState(): void {
  // On desktop (lg and up), drawer should be open by default
  // On mobile/tablet, drawer should be closed by default
  isDrawerOpen = window.innerWidth >= 1024
}

function setupResizeHandler(): void {
  window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= 1024

    // Auto-open drawer on desktop, close on mobile
    if (isDesktop && !isDrawerOpen) {
      isDrawerOpen = true
      if (drawerComponent) {
        drawerComponent.open()
      }
    } else if (!isDesktop && isDrawerOpen) {
      isDrawerOpen = false
      if (drawerComponent) {
        drawerComponent.close()
      }
    }
  })
}

function handleNavigation(el: HTMLElement, demoId: string, onNavigate?: (el: HTMLElement, demoId: string) => void): void {
  // Call parent navigation handler
  if (onNavigate) {
    onNavigate(el, demoId)
  }
  
  // Close drawer on mobile after navigation
  if (drawerComponent && window.innerWidth < 1024) {
    drawerComponent.close()
    isDrawerOpen = false
  }
}

function handleMenuToggle(_el: HTMLElement): void {
  if (drawerComponent) {
    drawerComponent.toggle()
    isDrawerOpen = !isDrawerOpen
  }
}

// Initialize drawer component
const Drawer = makeDrawer()
Drawer.getLogic().then(c => {
  drawerComponent = c
  setInitialDrawerState()
  setupResizeHandler()
  
  if (isDrawerOpen) {
    drawerComponent.open()
  } else {
    drawerComponent.close()
  }
})

export default function AppLayout(props: AppLayoutProps) {
  const {
    currentDemo,
    children,
    'on:navigate': onNavigate,
    ...moreProps
  } = props

  return (
    <div class="h-screen bg-base-100 flex flex-col" {...moreProps}>
      <DemoHeader
        isMenuOpen={isDrawerOpen}
        on:menuToggle={handleMenuToggle}
      />

      <Drawer
        isOpen={isDrawerOpen}
        persistent={true}
        side="left"
        class="flex-1"
        drawerContent={
          <Sidebar
            categories={demoCategories}
            currentDemo={currentDemo}
            on:navigate={(el: HTMLElement, demoId: string) => handleNavigation(el, demoId, onNavigate)}
          />
        }
        mainContent={
          <main class="flex-1 overflow-hidden bg-base-100">
            {children}
          </main>
        }
      />
    </div>
  )
}