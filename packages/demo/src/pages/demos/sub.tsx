import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import AppLayout from '../../components/AppLayout'
import { componentDemos } from '../../catalog'

export function getLayout() {
  return 'demos.html'
}

export function getPageMeta() {
  return {
    title: 'Component Demo',
    description: 'Interactive component demonstration',
    scripts: ['/src/main.tsx']
  }
}

export async function getRoutes() {
  const routes: Record<string, any> = {}

  for (const demo of componentDemos) {
    const path = `/demos/${demo.id}`
    routes[path] = {
      title: `${demo.title} - Duct UI`,
      description: demo.description
    }
  }

  return routes
}

const DemoPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  const demoId = path.split('/').pop()
  const demo = componentDemos.find(d => d.id === demoId)

  if (!demo) {
    return <div>Demo not found</div>
  }

  return <AppLayout currentItem={demo.id}>
    {demo.component()}
  </AppLayout>
}

export default DemoPage