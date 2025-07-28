import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import makeDrawer, { DrawerLogic } from "@duct-ui/components/layout/drawer"
import makeSidebar, { SidebarLogic } from "./Sidebar"
import DemoHeader from "./DemoHeader"
import { demoCategories } from "../demos"

export interface AppLayoutEvents extends BaseComponentEvents {
  navigate: (el: HTMLElement, demoId: string) => void
}

export interface AppLayoutLogic {
  refreshChildren: (children: JSX.Element) => void
  updateCurrentDemo: (currentDemo: string) => void
}

export interface AppLayoutProps {
  currentDemo: string
  children: JSX.Element
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:navigate'?: (el: HTMLElement, demoId: string) => void
}

// Store drawer component reference to access its logic
let drawerComponentInstance: DrawerLogic
const sidebarRef = createRef<SidebarLogic>()
let eventEmitter: EventEmitter<AppLayoutEvents> | undefined
const Drawer = makeDrawer()
let isDrawerOpen: boolean = false

// Get drawer logic when component is created
Drawer.getLogic().then(logic => {
  drawerComponentInstance = logic
  isDrawerOpen = window.innerWidth >= 1024
  if (isDrawerOpen) {
    drawerComponentInstance.open()
  } else {
    drawerComponentInstance.close()
  }
})

const Sidebar = makeSidebar()

function handleNavigation(_navEl: HTMLElement, demoId: string): void {
  if (drawerComponentInstance && window.innerWidth < 1024) {
    drawerComponentInstance.close()
    isDrawerOpen = false
  }
  eventEmitter?.emit('navigate', demoId)
  if (sidebarRef.current) {
    sidebarRef.current.updateCurrentDemo(demoId)
  }
}

function handleMenuToggle(_el: HTMLElement): void {
  if (drawerComponentInstance) {
    drawerComponentInstance.toggle()
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
      if (drawerComponentInstance) {
        drawerComponentInstance.open()
      }
    } else if (!isDesktop && isDrawerOpen) {
      isDrawerOpen = false
      if (drawerComponentInstance) {
        drawerComponentInstance.close()
      }
    }
  }

  function updateCurrentDemo(demoId: string) {
    if (sidebarRef.current) {
      sidebarRef.current.updateCurrentDemo(demoId)
    }
  }

  window.addEventListener('resize', handleResize)

  function release() {
    window.removeEventListener('resize', handleResize)
  }

  return {
    refreshChildren,
    updateCurrentDemo,
    release
  }
}

const id = { id: "duct-demo/app-layout" }

export default () => {
  return createBlueprint<AppLayoutProps, AppLayoutEvents, AppLayoutLogic>(
    id,
    render,
    {
      bind
    }
  )
}