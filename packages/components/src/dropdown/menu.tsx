import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { cn } from "../utils/cn.js"

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'

export interface MenuEvents extends BaseComponentEvents {
  open: () => void
  close: () => void
}

export interface MenuLogic {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

export type MenuProps = {
  label: string
  buttonClass?: string
  menuClass?: string
  placement?: MenuPlacement
  disabled?: boolean
  children?: any
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:open'?: (el: HTMLElement) => void
  'on:close'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<MenuProps>) {
  const {
    label,
    buttonClass = "btn",
    menuClass = "menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow",
    placement = "bottom-start",
    disabled = false,
    children,
    class: className = "",
    ...moreProps
  } = props

  const buttonClasses = cn(buttonClass, disabled && "btn-disabled")

  // Determine dropdown classes based on placement
  let dropdownClasses = "dropdown relative"
  switch (placement) {
    case 'bottom-start':
      dropdownClasses = "dropdown relative"
      break
    case 'bottom-end':
      dropdownClasses = "dropdown dropdown-end relative"
      break
    case 'bottom':
      dropdownClasses = "dropdown dropdown-bottom relative"
      break
    case 'top-start':
      dropdownClasses = "dropdown dropdown-top relative"
      break
    case 'top-end':
      dropdownClasses = "dropdown dropdown-top dropdown-end relative"
      break
    case 'top':
      dropdownClasses = "dropdown dropdown-top relative"
      break
  }

  // Merge with user-provided class
  const finalClasses = cn(dropdownClasses, className)

  return (
    <div
      data-menu-open="false"
      class={finalClasses}
      {...renderProps(moreProps)}
    >
      <div tabindex="0" role="button" class={buttonClasses} data-disabled={disabled}>
        {label}
      </div>
      <ul
        tabindex="0"
        class={cn(menuClass, "dropdown-content absolute")}
        style="display: none;"
      >
        {children}
      </ul>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<MenuEvents>): BindReturn<MenuLogic> {
  const button = el.querySelector('[role="button"]') as HTMLElement
  const menu = el.querySelector('ul') as HTMLElement

  if (!button || !menu) {
    throw new Error('Menu component missing required button or menu elements')
  }

  function open() {
    if (isDisabled()) return

    // Close all other menus first
    document.dispatchEvent(new CustomEvent('duct:close-all-menus', { detail: { except: el } }))

    el.dataset.menuOpen = 'true'
    menu.style.display = 'block'
    eventEmitter.emit('open')
  }

  function close() {
    el.dataset.menuOpen = 'false'
    menu.style.display = 'none'
    eventEmitter.emit('close')
  }

  function toggle() {
    if (isOpen()) {
      close()
    } else {
      open()
    }
  }

  function isOpen(): boolean {
    return el.dataset.menuOpen === 'true'
  }

  function isDisabled(): boolean {
    return button.hasAttribute('disabled') || button.dataset.disabled === 'true' || button.dataset.disabled === ''
  }

  function handleButtonClick(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  function handleClickOutside(e: Event) {
    const target = e.target as HTMLElement
    if (!el.contains(target) && isOpen()) {
      close()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen()) {
      close()
      button.focus()
    }
  }

  function handleCloseAllMenus(e: CustomEvent) {
    if (e.detail.except !== el && isOpen()) {
      close()
    }
  }

  // Event listeners
  el.addEventListener('click', handleButtonClick)
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('duct:close-all-menus', handleCloseAllMenus as EventListener)

  function release() {
    el.removeEventListener('click', handleButtonClick)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('duct:close-all-menus', handleCloseAllMenus as EventListener)
  }

  return {
    open,
    close,
    toggle,
    isOpen,
    release
  }
}

const id = { id: "duct/menu" }

const Menu = createBlueprint<MenuProps, MenuEvents, MenuLogic>(
  id,
  render,
  {
    domEvents: ['click'],
    bind
  },
)

export default Menu