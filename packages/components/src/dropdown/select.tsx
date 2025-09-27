import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps, renderProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import Icon, { IconSize, type IconSource } from "../images/icon.js"
import { cn } from "../utils/cn.js"

export type SelectPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'

export type SelectItemIcon = IconSource

export interface SelectItem {
  label: string
  description?: string
  icon?: SelectItemIcon
  isSelected?: boolean
  isDisabled?: boolean
  attributes?: Record<string, any>
}

export interface SelectEvents extends BaseComponentEvents {
  open: () => void
  close: () => void
  selectionChange: (item: SelectItem, index: number) => void
}

export interface SelectLogic {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
  selectItem: (index: number) => void
  getSelectedItem: () => SelectItem | null
  getSelectedIndex: () => number
}

export type SelectProps = {
  items: SelectItem[]
  selectedIcon?: SelectItemIcon
  buttonClass?: string
  menuClass?: string
  itemClass?: string
  labelClass?: string
  descriptionClass?: string
  selectedIconClass?: string
  iconClass?: string
  iconSize?: IconSize
  placement?: SelectPlacement
  disabled?: boolean
  placeholder?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:open'?: (el: HTMLElement) => void
  'on:close'?: (el: HTMLElement) => void
  'on:selectionChange'?: (el: HTMLElement, item: SelectItem, index: number) => void
} & Record<string, any>

function renderIcon(icon: SelectItemIcon, iconSize: IconSize = 'sm', iconClass: string = ""): JSX.Element {
  return <Icon icon={icon} size={iconSize} class={iconClass} />
}

function render(props: BaseProps<SelectProps>) {
  const {
    items,
    selectedIcon = "✓",
    buttonClass = "",
    menuClass = "",
    itemClass = "",
    labelClass = "",
    descriptionClass = "",
    selectedIconClass = "",
    iconClass = "",
    iconSize = 'sm',
    placement = "bottom-start",
    disabled = false,
    placeholder = "Select an option",
    class: className = "",
    ...moreProps
  } = props

  const buttonClasses = buttonClass

  // Find selected item
  const selectedItem = items.find(item => item.isSelected)
  const buttonLabel = selectedItem ? selectedItem.label : placeholder

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

  // Render items
  const itemElements = items.map((item, index) => {
    const itemClasses = cn("select-item", item.isDisabled && 'disabled', itemClass)
    const anchorClasses = cn("select-item-anchor", item.isDisabled && 'disabled')
    const iconClasses = cn("select-item-icon", iconClass)
    const iconElement = item.icon ? <>{renderIcon(item.icon, iconSize, iconClasses)}</> : null
    const selectedIconElement = item.isSelected ?
      <span class={cn("select-selected-icon", selectedIconClass)}>{renderIcon(selectedIcon)}</span> :
      <span class={cn("select-selected-icon", selectedIconClass)}></span>
    const attributes = item.attributes || {}

    return (
      <li class={itemClasses} data-index={index} {...attributes}>
        <a class={anchorClasses}>
          {selectedIconElement}
          {iconElement}
          <div class="select-item-content">
            <div class={cn("select-item-label", labelClass)}>{item.label}</div>
            {item.description && (
              <div class={cn("select-item-description", descriptionClass)}>{item.description}</div>
            )}
          </div>
        </a>
      </li>
    )
  })

  return (
    <div
      data-select-open="false"
      class={cn("select-dropdown", finalClasses)}
      {...renderProps(moreProps)}
    >
      <div tabindex="0" role="button" class={cn("select-button", buttonClasses)} data-disabled={disabled}>
        <span class="select-button-label">{buttonLabel}</span>
        <span class="select-button-arrow">▼</span>
      </div>
      <ul
        tabindex="0"
        class={cn("select-menu", menuClass, "dropdown-content absolute")}
        style="display: none;"
      >
        {itemElements}
      </ul>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<SelectEvents>): BindReturn<SelectLogic> {
  const button = el.querySelector('[role="button"]') as HTMLElement
  const menu = el.querySelector('ul') as HTMLElement
  const arrow = el.querySelector('.select-button-arrow') as HTMLElement

  if (!button || !menu) {
    throw new Error('Select component missing required button or menu elements')
  }

  function open() {
    if (isDisabled()) return

    // Close all other menus first
    document.dispatchEvent(new CustomEvent('duct:close-all-menus', { detail: { except: el } }))

    el.dataset.selectOpen = 'true'
    menu.style.display = 'block'
    if (arrow) arrow.style.transform = 'rotate(180deg)'
    eventEmitter.emit('open')
  }

  function close() {
    el.dataset.selectOpen = 'false'
    menu.style.display = 'none'
    if (arrow) arrow.style.transform = 'rotate(0deg)'
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
    return el.dataset.selectOpen === 'true'
  }

  function isDisabled(): boolean {
    return button.hasAttribute('disabled') || button.dataset.disabled === 'true' || button.dataset.disabled === ''
  }

  function selectItem(index: number) {
    const items = getItems()
    if (index < 0 || index >= items.length) return

    const item = items[index]
    if (item.isDisabled) return

    // Update selected state
    items.forEach((item, i) => {
      item.isSelected = i === index
    })

    // Update button label
    const buttonLabel = button.querySelector('.select-button-label') as HTMLElement
    if (buttonLabel) {
      buttonLabel.textContent = item.label
    }

    // Update visual indicators in menu
    const menuItems = menu.querySelectorAll('li')
    menuItems.forEach((li, i) => {
      const anchor = li.querySelector('a')
      const selectedIconElement = anchor?.querySelector('span, img')
      if (selectedIconElement) {
        if (i === index) {
          // Replace with selected icon
          const newIcon = renderIcon(getSelectedIcon())
          selectedIconElement.outerHTML = newIcon.toString()
        } else {
          // Replace with empty placeholder
          selectedIconElement.outerHTML = '<span class="select-selected-icon"></span>'
        }
      }
    })

    eventEmitter.emit('selectionChange', item, index)
    close()
  }

  function getSelectedItem(): SelectItem | null {
    const items = getItems()
    return items.find(item => item.isSelected) || null
  }

  function getSelectedIndex(): number {
    const items = getItems()
    return items.findIndex(item => item.isSelected)
  }

  function getItems(): SelectItem[] {
    // This would need to be passed in or stored somehow
    // For now, we'll parse from the DOM
    const menuItems = menu.querySelectorAll('li')
    const result = Array.from(menuItems).map((li) => {
      const anchor = li.querySelector('a')
      const label = anchor?.querySelector('.select-item-label')?.textContent || ''
      const description = anchor?.querySelector('.select-item-description')?.textContent || undefined
      const selectedIconElement = anchor?.querySelector('.select-selected-icon')
      const hasSelectedIcon = selectedIconElement && selectedIconElement.textContent?.trim() !== ''

      return {
        label,
        description,
        isSelected: hasSelectedIcon,
        isDisabled: li.classList.contains('disabled'),
        attributes: Object.fromEntries(
          Array.from(li.attributes)
            .filter(attr => attr.name.startsWith('data-') && attr.name !== 'data-index')
            .map(attr => [attr.name, attr.value])
        )
      }
    })
    return result as SelectItem[]
  }

  function getSelectedIcon(): SelectItemIcon {
    // This should be stored from props, defaulting to checkmark
    return "✓"
  }

  function handleButtonClick(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  function handleItemClick(e: Event) {
    e.preventDefault()
    e.stopPropagation()

    const target = e.target as HTMLElement
    const li = target.closest('li')
    if (!li) return

    const index = parseInt(li.dataset.index || '0')
    selectItem(index)
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
  menu.addEventListener('click', handleItemClick)
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('duct:close-all-menus', handleCloseAllMenus as EventListener)

  function release() {
    el.removeEventListener('click', handleButtonClick)
    menu.removeEventListener('click', handleItemClick)
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('duct:close-all-menus', handleCloseAllMenus as EventListener)
  }

  return {
    open,
    close,
    toggle,
    isOpen,
    selectItem,
    getSelectedItem,
    getSelectedIndex,
    release
  }
}

const id = { id: "duct/select" }

const Select = createBlueprint<SelectProps, SelectEvents, SelectLogic>(
  id,
  render,
  {
    domEvents: ['click'],
    bind
  },
)

export default Select