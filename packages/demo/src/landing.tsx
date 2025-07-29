import LandingPage from "./components/LandingPage"

function render(): void {
  const app = document.getElementById('app')
  if (!app) return

  const landingPage = LandingPage({})
  app.innerHTML = landingPage.toString()
}

// Initialize the landing page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  render()
})