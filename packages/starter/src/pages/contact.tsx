import type { PageProps } from '@duct-ui/router'
import ContactContainer from '@components/ContactContainer'
import ThemeToggle from '@components/ThemeToggle'
import SearchModalProvider from '@components/SearchModalProvider'

export function getLayout(): string {
  return 'page.html'
}

export function getPageMeta() {
  return {
    title: 'Contact Us - Duct Starter',
    description: 'Get in touch with our team'
  }
}

const ContactPage = ({ meta, path, env }: PageProps) => {
  return (
    <>
      <SearchModalProvider />
      <ContactContainer />
      <ThemeToggle />
    </>
  )
}

export default ContactPage