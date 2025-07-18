import makeAppLayout from "./components/AppLayout"
import { getDemoById, getDefaultDemo } from "./demos"

// App state
let currentDemo: string
let appLayoutLogic: any = null

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
  if (appLayoutLogic) {
    const currentDemoInfo = getDemoById(currentDemo) || getDefaultDemo()
    appLayoutLogic.refreshChildren(currentDemoInfo.component())
    appLayoutLogic.updateCurrentDemo(currentDemo)
  }
}

function render(): void {
  const app = document.getElementById('app')
  if (!app) return

  const currentDemoInfo = getDemoById(currentDemo) || getDefaultDemo()
  const AppLayout = makeAppLayout()

  const layout = (
    <AppLayout
      currentDemo={currentDemo}
      on:navigate={handleNavigation}
    >
      {currentDemoInfo.component()}
    </AppLayout>
  )

  app.innerHTML = layout.toString()

  // Get the layout logic for future updates
  AppLayout.getLogic().then(logic => {
    appLayoutLogic = logic
  })
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