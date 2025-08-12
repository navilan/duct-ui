import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import AppLayout from '@components/AppLayout'
import { componentDemos } from '../../catalog'

export function getLayout() {
  return 'demos.html'
}

export function getPageMeta() {
  return {
    title: 'Component Demos - Duct UI',
    description: 'Interactive demos showcasing Duct UI components'
  }
}

const DemosPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // For the index page, show the first demo
  const current = componentDemos[0]

  return <AppLayout currentItem={current.id}>
    {current.component()}
  </AppLayout>
}

export default DemosPage