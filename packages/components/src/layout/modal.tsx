import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

export interface ModalEvents extends BaseComponentEvents {
  open: (el: HTMLElement) => void
  close: (el: HTMLElement) => void
  overlayClick: (el: HTMLElement) => void
}

export interface ModalLogic {
  show: () => void
  hide: () => void
  isVisible: () => boolean
  toggle: () => void
}

export type ModalContentPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'mid-left' | 'mid-center' | 'mid-right' 
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ModalProps {
  content: () => JSX.Element
  isOpen?: boolean
  contentPosition?: ModalContentPosition
  overlayClass?: string
  contentClass?: string
  closeOnOverlayClick?: boolean
  'on:open'?: (el: HTMLElement) => void
  'on:close'?: (el: HTMLElement) => void
  'on:overlayClick'?: (el: HTMLElement) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<ModalProps>) {
  const {
    content,
    isOpen = false,
    contentPosition = 'mid-center',
    overlayClass = '',
    contentClass = '',
    closeOnOverlayClick = true,
    ...moreProps
  } = props

  const positionClass = `modal-content-${contentPosition}`

  return (
    <div
      class={`modal-container ${positionClass} ${isOpen ? 'modal-visible' : 'modal-hidden'}`}
      data-modal-container
      {...moreProps}
    >
      <div
        class={`modal-overlay ${overlayClass}`}
        data-modal-overlay
      ></div>
      <div
        class={`modal-content ${contentClass}`}
        data-modal-content
      >
        {content()}
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<ModalEvents>, props: any): BindReturn<ModalLogic> {
  const modalContainer = el
  const overlay = el.querySelector('[data-modal-overlay]') as HTMLElement
  const closeOnOverlayClick = props.closeOnOverlayClick !== false
  let isVisible = props.isOpen || false

  function show(): void {
    if (isVisible) return

    isVisible = true
    modalContainer.classList.remove('modal-hidden')
    modalContainer.classList.add('modal-visible')

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    eventEmitter.emit('open')
  }

  function hide(): void {
    if (!isVisible) return

    isVisible = false
    modalContainer.classList.remove('modal-visible')
    modalContainer.classList.add('modal-hidden')

    // Restore body scroll
    document.body.style.overflow = ''

    eventEmitter.emit('close')
  }

  function toggle(): void {
    if (isVisible) {
      hide()
    } else {
      show()
    }
  }

  function getIsVisible(): boolean {
    return isVisible
  }


  function handleCloseClick(event: Event) {
    const target = event.target as HTMLElement
    if (target.hasAttribute('data-modal-close')) {
      hide()
    }
    if (target === overlay && closeOnOverlayClick) {
      eventEmitter.emit('overlayClick')
      hide()
    }
  }

  function handleEscapeKey(event: KeyboardEvent) {
    if (event.key === 'Escape' && isVisible) {
      hide()
    }
  }

  // Listen for close buttons
  el.addEventListener('click', handleCloseClick)

  document.addEventListener('keydown', handleEscapeKey)

  function release() {
    el.removeEventListener('click', handleCloseClick)
    document.removeEventListener('keydown', handleEscapeKey)

    // Restore body scroll on cleanup
    document.body.style.overflow = ''
  }

  return {
    show,
    hide,
    toggle,
    isVisible: getIsVisible,
    release
  }
}

const id = { id: "duct/modal" }

const Modal = createBlueprint<ModalProps, ModalEvents, ModalLogic>(
  id,
  render,
  {
    bind
  }
)

export default Modal