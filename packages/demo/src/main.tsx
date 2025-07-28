import { createRef } from "@duct-ui/core"
import makeAppLayout from "./components/AppLayout"
import { getDemoById, getDefaultDemo } from "./demos"

// App state
let currentDemo: string
const appLayoutRef = createRef<any>()

function getInitialDemo(): string {
  const hash = window.location.hash.slice(1) // Remove #
  const demo = getDemoById(hash)
  return demo ? demo.id : getDefaultDemo().id
}

function setupRouting(): void {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1)
    const demo = getDemoById(hash)
    if (demo) {
      currentDemo = demo.id
      updateContent()
    }
  })
}

function handleNavigation(_el: HTMLElement, demoId: string): void {
  window.location.hash = demoId
}

function updateContent(): void {
  if (appLayoutRef.current) {
    const currentDemoInfo = getDemoById(currentDemo) || getDefaultDemo()
    appLayoutRef.current.refreshChildren(currentDemoInfo.component())
    appLayoutRef.current.updateCurrentDemo(currentDemo)
  }
}

function render(): void {
  const app = document.getElementById('app')
  if (!app) return

  const currentDemoInfo = getDemoById(currentDemo) || getDefaultDemo()
  const AppLayout = makeAppLayout()

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