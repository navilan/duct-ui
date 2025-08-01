import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import NotFoundPage from '../components/NotFoundPage'

export function getLayout() {
  return '404.html'
}

export function getPageMeta() {
  return {
    title: '404 - Page Not Found | Duct UI',
    description: 'The page you are looking for could not be found.'
  }
}

const NotFoundPageComponent: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  return <NotFoundPage />
}

export default NotFoundPageComponent