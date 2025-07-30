import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import LandingPage from '../components/LandingPage'

export function getLayout() {
  return 'default.html'
}

export function getPageMeta() {
  return {
    title: 'Duct UI - Modern UI Framework',
    description: 'A component-based UI framework with clear separation between templates and logic',
    scripts: ['/src/landing.tsx']
  }
}

const HomePage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  return <LandingPage />
}

export default HomePage