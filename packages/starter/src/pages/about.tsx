import type { PageProps } from '@duct-ui/router'
import AboutContainer from '@components/AboutContainer'
import ThemeToggle from '@components/ThemeToggle'
import SearchModalProvider from '@components/SearchModalProvider'

export function getLayout(): string {
  return 'page.html'
}

export function getPageMeta() {
  return {
    title: 'About Us - Duct Starter',
    description: 'Learn more about our team and mission'
  }
}

const AboutPage = ({ meta, path, env }: PageProps) => {
  return (
    <>
      <SearchModalProvider />
      <AboutContainer />
      <ThemeToggle />
    </>
  )
}

export default AboutPage