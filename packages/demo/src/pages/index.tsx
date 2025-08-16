import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import LandingPage from '@components/LandingPage'

export function getLayout() {
  return 'landing.html'
}

export function getPageMeta() {
  return {
    title: 'Duct UI - Web Framework for the Age of AI',
    description: 'Built for clarity and explicitness. Component library + static site generator designed for seamless human-AI collaboration in web development.'
  }
}

const HomePage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  return <LandingPage />
}

export default HomePage