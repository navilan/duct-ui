import { createBlueprint, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"

export type IconSource = string | { default: string } | { src: string }
export type IconSize = 'sm' | 'md' | 'lg' | 'xl'

export interface IconEvents extends BaseComponentEvents {
  // Icons typically don't need custom events, but extending for consistency
}


export interface IconLogic {
  // Icons typically don't need logic, but extending for consistency
}

export type IconProps = {
  icon: IconSource
  size?: IconSize
  class?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function getSizeClasses(size: 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  switch (size) {
    case 'sm':
      return 'w-4 h-4'
    case 'md':
      return 'w-5 h-5'
    case 'lg':
      return 'w-6 h-6'
    case 'xl':
      return 'w-8 h-8'
    default:
      return 'w-5 h-5'
  }
}

function render(props: BaseProps<IconProps>) {
  const {
    icon,
    size = 'md',
    class: className = "",
    ...moreProps
  } = props

  const sizeClasses = getSizeClasses(size)
  const finalClasses = `${sizeClasses} ${className}`.trim()

  if (typeof icon === 'string') {
    return (
      <span class={className} {...moreProps}>
        {icon}
      </span>
    )
  }

  if (typeof icon === 'object') {
    if ('default' in icon) {
      // Imported SVG module
      return (
        <img src={icon.default} alt="" class={finalClasses} {...moreProps} />
      )
    }
    if ('src' in icon) {
      // Direct URL/path
      return (
        <img src={icon.src} alt="" class={finalClasses} {...moreProps} />
      )
    }
  }

  // Fallback for invalid icon
  return <span></span>
}

const id = { id: "duct/icon" }

export default () => {
  return createBlueprint<IconProps, IconEvents, IconLogic>(
    id,
    render,
    {
      customEvents: ['bind', 'release']
    },
  )
}