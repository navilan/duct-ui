## Page Components

Page components in Duct SSG return either:

- **Duct components** (created with `createBlueprint`) - These are reinstantiated on the client with full logic binding and interactivity
- **Plain JSX** - Rendered as static HTML with no client-side presence or interactivity

Each page component must export specific functions:

```typescript
// src/pages/about/index.tsx
import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import AboutContent from '../../components/AboutContent' // A Duct component

export function getLayout(): string {
  return 'shell.html'  // Layout template to use
}

export function getPageContext(): Record<string, any> {
  return {
    title: 'About Us',
    description: 'Learn more about our company',
    openGraph: {
      title: 'About Us - My Site',
      description: 'Learn more about our company and mission',
      image: '/images/about-og.jpg'
    }
  }
}

// Example 1: Returning a Duct component (with client-side interactivity)
const AboutPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // AboutContent is created with createBlueprint and will be
  // reinstantiated on the client with full logic binding
  return <AboutContent />
}

// Example 2: Returning plain JSX (static HTML only)
const StaticAboutPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // This JSX will be rendered as static HTML with no client-side presence
  return (
    <div class="container mx-auto px-4 py-8">
      <h1>About Us</h1>
      <p>This is static content with no interactivity.</p>
    </div>
  )
}

export default AboutPage // Use the interactive version
```