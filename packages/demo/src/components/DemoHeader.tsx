import IconButton from "@duct-ui/components/button/icon-button"
import { renderProps } from "@duct-ui/core/blueprint"

export interface DemoHeaderProps {
  isMenuOpen?: boolean
  title?: string
  class?: string
  'on:menuToggle'?: (el: HTMLElement) => void
}

// IconButton is now imported directly

// Hamburger icon as string (3 horizontal lines)
const hamburgerIcon = "☰"

export default function DemoHeader(props: DemoHeaderProps) {
  const {
    isMenuOpen = false,
    title = "Duct UI",
    class: className = "",
    'on:menuToggle': onMenuToggle,
    ...moreProps
  } = props

  return (
    <header class={`demo-header bg-base-100 border-b border-base-300 px-4 py-3 flex items-center justify-between lg:hidden ${className}`.trim()} {...renderProps(moreProps)}>
      {/* Left side: Hamburger + Title */}
      <div class="flex items-center gap-4">
        <IconButton
          icon={hamburgerIcon}
          iconClass="w-8 h-8 text-xl"
          class="btn btn-ghost btn-sm"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          data-drawer-trigger
          on:click={onMenuToggle}
        />
        <h1 class="text-lg font-semibold text-base-content h-full mx-0 my-auto align-middle pt-[2px]">{title}</h1>
      </div>

      {/* Right side: Navigation Links */}
      <div class="flex items-center gap-3 text-sm">
        <a href="/docs" class="text-base-content hover:text-primary transition-colors font-medium">Docs</a>
        <a href="/demos" class="text-base-content hover:text-primary transition-colors font-medium">Demos</a>
        <a href="/blog" class="text-base-content hover:text-primary transition-colors font-medium">Blog</a>
      </div>
    </header>
  )
}