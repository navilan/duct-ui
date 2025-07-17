import makeSidebarNav from "@duct-ui/components/navigation/sidebar-nav"
import ductLogo from "../icons/duct-logo.svg"

export interface SidebarProps {
  categories: Array<{
    id: string
    title: string
    demos: Array<{ id: string; title: string; description?: string }>
  }>
  currentDemo: string
  'on:navigate'?: (el: HTMLElement, demoId: string) => void
}

const SidebarNav = makeSidebarNav()

export default function Sidebar(props: SidebarProps) {
  const { categories, currentDemo, ...moreProps } = props

  // Transform demo categories to sidebar sections
  const sections = categories.map(category => ({
    id: category.id,
    title: category.title,
    items: category.demos.map(demo => ({
      id: demo.id,
      title: demo.title,
      description: demo.description
    }))
  }))

  const headerContent = (
    <div>
      <img class="h-24 aspect-square" src={ductLogo} />
      <h1 class="text-xl font-bold text-base-content">Duct UI</h1>
      <p class="text-sm text-base-content mb-4">A DOM first compact UI library</p>

      <h3 class="text-md text-base-content/70">Component Demos</h3>
    </div>
  )

  return (
    <SidebarNav
      sections={sections}
      currentItem={currentDemo}
      headerContent={headerContent}
      {...moreProps}
    />
  )
}