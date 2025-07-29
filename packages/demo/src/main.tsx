import { createRef } from "@duct-ui/core"
import AppLayout, { AppLayoutLogic } from "./components/AppLayout"
import { getDemoById, getDefaultDemo } from "./demos"

// App state
let currentDemo: string
const appLayoutRef = createRef<AppLayoutLogic>()

function getInitialDemo(): string {
  let pathname = window.location.pathname.slice(1) // Remove leading /
  
  // Remove /docs prefix if present
  if (pathname.startsWith('docs/')) {
    pathname = pathname.slice(5) // Remove 'docs/'
  }
  
  // First try pathname
  if (pathname) {
    const demo = getDemoById(pathname)
    if (demo) return demo.id
  }
  
  // Fallback to hash if pathname not found
  const hash = window.location.hash.slice(1) // Remove #
  if (hash) {
    const demo = getDemoById(hash)
    if (demo) return demo.id
  }
  
  // Default demo if neither pathname nor hash found
  return getDefaultDemo().id
}

function setupRouting(): void {
  window.addEventListener('popstate', () => {
    let pathname = window.location.pathname.slice(1) // Remove leading /
    
    // Remove /docs prefix if present
    if (pathname.startsWith('docs/')) {
      pathname = pathname.slice(5) // Remove 'docs/'
    }
    
    // First try pathname
    let demo = null
    if (pathname) {
      demo = getDemoById(pathname)
    }
    
    // Fallback to hash if pathname not found
    if (!demo) {
      const hash = window.location.hash.slice(1) // Remove #
      if (hash) {
        demo = getDemoById(hash)
      }
    }
    
    // Use found demo or default
    const targetDemo = demo || getDefaultDemo()
    currentDemo = targetDemo.id
    updateContent()
  })
}

function handleNavigation(_el: HTMLElement, demoId: string): void {
  window.history.pushState({}, '', `/docs/${demoId}`)
  currentDemo = demoId
  updateContent()
}

function updateContent(): void {
  if (appLayoutRef.current) {
    const currentDemoInfo = getDemoById(currentDemo) || getDefaultDemo()
    appLayoutRef.current.refreshChildren(currentDemoInfo.component())
    appLayoutRef.current.updateCurrentDemo(currentDemo)
    appLayoutRef.current.scrollContentToTop()
  }
}

function render(): void {
  const app = document.getElementById('app')
  if (!app) return

  const currentDemoInfo = getDemoById(currentDemo) || getDefaultDemo()

  const layout = (
    <AppLayout
      ref={appLayoutRef}
      currentDemo={currentDemo}
      on:navigate={handleNavigation}
    >
      {currentDemoInfo.component()}
    </AppLayout>
  )

  app.innerHTML = layout.toString()

}

function initializeDemoApp(): void {
  currentDemo = getInitialDemo()
  setupRouting()
  render()
}

// Initialize the demo app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initializeDemoApp()
})