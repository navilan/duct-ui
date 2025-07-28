import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

export interface DrawerEvents extends BaseComponentEvents {
  open: () => void
  close: () => void
}

export interface DrawerLogic {
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
}

export type DrawerProps = {
  isOpen?: boolean
  side?: 'left' | 'right'
  overlay?: boolean
  persistent?: boolean
  drawerContent?: any
  mainContent?: any
  class?: string
  drawerClass?: string
  contentClass?: string
  overlayClass?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:open'?: (el: HTMLElement) => void
  'on:close'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<DrawerProps>) {
  const {
    isOpen = false,
    side = 'left',
    overlay = true,
    persistent = false,
    drawerContent,
    mainContent,
    class: className = "",
    drawerClass = "",
    contentClass = "",
    overlayClass = "",
    ...moreProps
  } = props

  const containerClasses = `drawer ${side === 'right' ? 'drawer-right' : 'drawer-left'} ${isOpen ? 'drawer-open' : ''} ${persistent ? 'drawer-persistent' : ''} ${className}`.trim()

  return (
    <div
      class={containerClasses}
      data-drawer-open={isOpen}
      data-drawer-side={side}
      data-drawer-persistent={persistent}
      {...moreProps}
    >
      {overlay && !persistent && (
        <div 
          class={`drawer-overlay ${overlayClass}`.trim()}
          data-drawer-overlay
        ></div>
      )}
      
      <div class={`drawer-content ${drawerClass}`.trim()}>
        {drawerContent}
      </div>
      
      <div class={`drawer-main ${contentClass}`.trim()}>
        {mainContent}
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<DrawerEvents>): BindReturn<DrawerLogic> {
  const overlay = el.querySelector('[data-drawer-overlay]') as HTMLElement
  
  function open() {
    el.setAttribute('data-drawer-open', 'true')
    el.classList.add('drawer-open')
    eventEmitter.emit('open')
  }

  function close() {
    el.setAttribute('data-drawer-open', 'false')
    el.classList.remove('drawer-open')
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
    return el.getAttribute('data-drawer-open') === 'true'
  }

  function isPersistent(): boolean {
    return el.getAttribute('data-drawer-persistent') === 'true'
  }

  function handleOverlayClick(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    if (!isPersistent()) {
      close()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen() && !isPersistent()) {
      close()
    }
  }

  function handleClickOutside(e: Event) {
    const target = e.target as HTMLElement
    const drawerContent = el.querySelector('.drawer-content') as HTMLElement
    const trigger = target.closest('[data-drawer-trigger]')
    
    // Close drawer if clicked outside the drawer content area and drawer is open and not persistent
    // Don't close if clicked on a drawer trigger element
    if (!isPersistent() && isOpen() && drawerContent && !drawerContent.contains(target) && !trigger) {
      close()
    }
  }

  // Event listeners
  if (overlay) {
    overlay.addEventListener('click', handleOverlayClick)
  }
  
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)

  function release() {
    if (overlay) {
      overlay.removeEventListener('click', handleOverlayClick)
    }
    document.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('click', handleClickOutside)
  }

  return {
    open,
    close,
    toggle,
    isOpen,
    release
  }
}

const id = { id: "duct/drawer" }

export default () => {
  return createBlueprint<DrawerProps, DrawerEvents, DrawerLogic>(
    id,
    render,
    {
      domEvents: ['click'],
      bind
    },
  )
}