import type { PageProps } from '@duct-ui/router'
import HomeDemo from '@components/HomeDemo'
import ThemeToggle from '@components/ThemeToggle'

export function getLayout(): string {
  return 'home.html'
}

export function getPageMeta() {
  return {
    title: 'Welcome to Duct Starter',
    description: 'A modern starter template for Duct UI applications with Tailwind CSS'
  }
}

const HomePage = ({ meta, path, env }: PageProps) => {
  return (
    <>
      <HomeDemo />
      <ThemeToggle />
    </>
  )
}

export default HomePage