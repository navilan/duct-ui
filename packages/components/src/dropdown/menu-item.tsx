import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, BaseProps } from "@duct-ui/core/blueprint"
import makeIcon, { type IconSource } from "../images/icon"

export interface MenuItemEvents extends BaseComponentEvents {
  click: (el: HTMLElement, event: MouseEvent) => void
}

export interface MenuItemLogic {
  click: () => void
  setDisabled: (disabled: boolean) => void
  isDisabled: () => boolean
}

export type MenuItemIcon = IconSource

export type MenuItemProps = {
  label: string
  icon?: MenuItemIcon
  disabled?: boolean
  class?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:click'?: (el: HTMLElement, event: MouseEvent) => void
} & Record<string, any>

function renderIcon(icon: MenuItemIcon): JSX.Element {
  const IconComponent = makeIcon()
  return <IconComponent icon={icon} size="sm" class="mr-2" />
}

function render(props: BaseProps<MenuItemProps>) {
  const {
    label,
    icon,
    disabled = false,
    class: className = "",
    ...moreProps
  } = props

  const disabledClass = disabled ? 'disabled' : ''
  const itemClasses = `${className} ${disabledClass}`.trim()

  const iconElement = icon ? renderIcon(icon) : null

  return (
    <li class={itemClasses} {...moreProps}>
      <a class={disabled ? 'disabled' : ''}>
        {iconElement}{label}
      </a>
    </li>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<MenuItemEvents>): BindReturn<MenuItemLogic> {
  const anchor = el.querySelector('a') as HTMLElement

  if (!anchor) {
    throw new Error('MenuItem component missing required anchor element')
  }

  function click() {
    if (!isDisabled()) {
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })
      anchor.dispatchEvent(clickEvent)
    }
  }

  function setDisabled(disabled: boolean) {
    if (disabled) {
      el.classList.add('disabled')
      anchor.classList.add('disabled')
      anchor.setAttribute('aria-disabled', 'true')
    } else {
      el.classList.remove('disabled')
      anchor.classList.remove('disabled')
      anchor.removeAttribute('aria-disabled')
    }
  }

  function isDisabled(): boolean {
    return el.classList.contains('disabled') || anchor.classList.contains('disabled')
  }

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!isDisabled()) {
      eventEmitter.emit('click', e)

      // Close all menus when item is clicked
      document.dispatchEvent(new CustomEvent('duct:close-all-menus', { detail: { except: null } }))
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled()) {
      e.preventDefault()
      e.stopPropagation()
      click()
    }
  }

  // Event listeners
  anchor.addEventListener('click', handleClick)
  anchor.addEventListener('keydown', handleKeydown)

  // Make focusable for keyboard navigation
  if (!anchor.hasAttribute('tabindex')) {
    anchor.setAttribute('tabindex', '0')
  }

  function release() {
    anchor.removeEventListener('click', handleClick)
    anchor.removeEventListener('keydown', handleKeydown)
  }

  return {
    click,
    setDisabled,
    isDisabled,
    release
  }
}

const id = { id: "duct/menu-item" }

export default () => {
  return createBlueprint<MenuItemProps, MenuItemEvents, MenuItemLogic>(
    id,
    render,
    {
      domEvents: ['click'],
      bind
    },
  )
}