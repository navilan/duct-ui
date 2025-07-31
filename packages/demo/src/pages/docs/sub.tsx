import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import AppLayout from '../../components/AppLayout'
import { docsItems } from '../../catalog'

export function getLayout() {
  return 'demos.html'
}

export function getPageMeta() {
  return {
    title: 'Duct UI Documentation',
    description: 'Documentation and guides for Duct UI framework',
    scripts: ['/src/main.tsx']
  }
}

export async function getRoutes() {
  // Generate routes for documentation pages only
  const routes: Record<string, any> = {}

  for (const doc of docsItems) {
    const path = `/docs/${doc.id}`
    routes[path] = {
      title: `${doc.title} - Duct UI`,
      description: doc.description
    }
  }

  return routes
}

const DocsPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // Extract the doc ID from the path
  const docId = path.split('/').pop() || ''
  const doc = docsItems.find(d => d.id === docId)

  // If no doc found, render empty layout
  if (!doc) {
    return <AppLayout currentItem={docId}>
      <div class="p-8">
        <h1 class="text-2xl font-bold">Documentation not found</h1>
        <p class="text-base-content/70">The documentation page "{docId}" could not be found.</p>
      </div>
    </AppLayout>
  }

  // Render the app layout with the specific documentation component as children
  return <AppLayout currentItem={docId}>
    {doc.component()}
  </AppLayout>
}

export default DocsPage