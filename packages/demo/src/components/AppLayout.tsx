import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import Drawer, { DrawerLogic } from "@duct-ui/components/layout/drawer"
import Sidebar, { SidebarLogic } from "./Sidebar"
import DemoHeader from "./DemoHeader"
import ThemeToggle from "./ThemeToggle"
import { demoCategories } from "../demos"

export interface AppLayoutEvents extends BaseComponentEvents {
  navigate: (el: HTMLElement, demoId: string) => void
}

export interface AppLayoutLogic {
  refreshChildren: (children: JSX.Element) => void
  updateCurrentDemo: (currentDemo: string) => void
  scrollContentToTop: () => void
}

export interface AppLayoutProps {
  currentDemo: string
  children: JSX.Element
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:navigate'?: (el: HTMLElement, demoId: string) => void
}

// Store drawer and sidebar refs to access their logic
const drawerRef = createRef<DrawerLogic>()
const sidebarRef = createRef<SidebarLogic>()
let eventEmitter: EventEmitter<AppLayoutEvents> | undefined
let isDrawerOpen: boolean = false

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

function handleNavigation(_navEl: HTMLElement, demoId: string): void {
  if (drawerRef.current && window.innerWidth < 1024) {
    drawerRef.current.close()
    isDrawerOpen = false
  }
  eventEmitter?.emit('navigate', demoId)
  if (sidebarRef.current) {
    sidebarRef.current.updateCurrentDemo(demoId)
  }
}

function handleMenuToggle(_el: HTMLElement): void {
  if (drawerRef.current) {
    drawerRef.current.toggle()
    isDrawerOpen = !isDrawerOpen
  }
}

function render(props: BaseProps<AppLayoutProps>) {
  const {
    currentDemo,
    children,
    ...moreProps
  } = props


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
            categories={demoCategories}
            currentDemo={currentDemo}
            on:navigate={handleNavigation}
            data-sidebar
          />
        }
        mainContent={
          <main class="flex-1 overflow-hidden bg-base-100" data-main-content>
            {children}
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
  function refreshChildren(children: JSX.Element): void {
    if (mainContent) {
      mainContent.innerHTML = children.toString()
    }
  }

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

  function updateCurrentDemo(demoId: string) {
    if (sidebarRef.current) {
      sidebarRef.current.updateCurrentDemo(demoId)
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
    updateCurrentDemo,
    scrollContentToTop,
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