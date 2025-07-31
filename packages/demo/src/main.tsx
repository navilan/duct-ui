import AppLayout from "./components/AppLayout"

function render(): void {
  const app = document.getElementById('app')
  if (!app) return

  // Empty the pre-rendered contents first
  app.innerHTML = ""

  // AppLayout handles all routing and navigation internally
  // Initialize the layout to bring alive the Duct component tree
  const layout = <AppLayout />

  // Now inject the content
  app.innerHTML = layout.toString()
}

// Initialize the demo app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  render()
})
