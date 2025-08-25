import type { PageProps } from '@duct-ui/router'
import HeroSection from '@components/HeroSection'
import FeaturesSection from '@components/FeaturesSection'
import HomeDemo from '@components/HomeDemo'
import CTASection from '@components/CTASection'
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
      <HeroSection 
        siteName={env.siteName}
        siteUrl={env.siteUrl}
      />
      <FeaturesSection />
      <HomeDemo />
      <CTASection />
      <ThemeToggle />
    </>
  )
}

export default HomePage