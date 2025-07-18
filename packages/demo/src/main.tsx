import AppLayout from "./components/AppLayout"
import { getDemoById, getDefaultDemo } from "./demos"

// App state
let currentDemo: string

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
      render()
    }
  })
}

function handleNavigation(_el: HTMLElement, demoId: string): void {
  window.location.hash = demoId
}

function render(): void {
  const app = document.getElementById('app')
  if (!app) return

  const currentDemoInfo = getDemoById(currentDemo) || getDefaultDemo()

  const layout = (
    <AppLayout
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