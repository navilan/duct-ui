import makeSidebar from "./components/Sidebar"
import { demoCategories, getDemoById, getDefaultDemo } from "./demos"

const Sidebar = makeSidebar()

class DemoApp {
  private currentDemo: string
  private sidebarComponent: any

  constructor() {
    this.currentDemo = this.getInitialDemo()
    this.setupRouting()
    this.render()
  }

  private getInitialDemo(): string {
    const hash = window.location.hash.slice(1) // Remove #
    const demo = getDemoById(hash)
    return demo ? demo.id : getDefaultDemo().id
  }

  private setupRouting(): void {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1)
      const demo = getDemoById(hash)
      if (demo) {
        this.currentDemo = demo.id
        this.render()
      }
    })
  }

  private handleNavigation = (el: HTMLElement, demoId: string): void => {
    window.location.hash = demoId
  }

  private render(): void {
    const app = document.getElementById('app')
    if (!app) return

    const currentDemoInfo = getDemoById(this.currentDemo) || getDefaultDemo()
    
    // Create the main layout
    const layout = (
      <div class="flex h-screen bg-base-100">
        <Sidebar 
          categories={demoCategories}
          currentDemo={this.currentDemo}
          on:navigate={this.handleNavigation}
        />
        <main class="flex-1 overflow-hidden">
          {currentDemoInfo.component()}
        </main>
      </div>
    )

    app.innerHTML = layout.toString()
  }
}

// Initialize the demo app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new DemoApp()
})