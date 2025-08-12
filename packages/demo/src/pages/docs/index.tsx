import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import AppLayout from '@components/AppLayout'
import { docsItems } from '../../catalog'

export function getLayout() {
  return 'demos.html'
}

export function getPageMeta() {
  return {
    title: 'Duct UI Documentation',
    description: 'Documentation and guides for Duct UI framework'
  }
}

const DocsPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // For the index page, show the first documentation page
  const firstDoc = docsItems[0]

  return <AppLayout currentItem={firstDoc.id}>
    {firstDoc.component()}
  </AppLayout>
}

export default DocsPage