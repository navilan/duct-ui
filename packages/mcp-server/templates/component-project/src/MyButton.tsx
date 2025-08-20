import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from '@duct-ui/core/blueprint'
import { EventEmitter } from '@duct-ui/core/shared'
import { cn } from './utils/cn.js'

export interface MyButtonEvents extends BaseComponentEvents {
  click: () => void
}

export interface MyButtonLogic {
  setDisabled(disabled: boolean): void
  getVariant(): string
}

export type MyButtonProps = {
  className?: string
  children?: any
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:click'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<MyButtonProps>) {
  const { className, children, variant = 'primary', disabled = false, ...moreProps } = props

  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500', 
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'

  return (
    <button 
      class={cn(
        baseClasses,
        variantClasses[variant],
        disabled && disabledClasses,
        className
      )}
      disabled={disabled}
      {...moreProps}
    >
      {children || 'Click me'}
    </button>
  )
}

function bind(element: HTMLElement, eventEmitter: EventEmitter<MyButtonEvents>): BindReturn<MyButtonLogic> {
  const button = element as HTMLButtonElement

  // Handle click events
  function handleClick(event: Event) {
    if (button.disabled) return
    
    eventEmitter.emit('click')
  }

  button.addEventListener('click', handleClick)

  function release() {
    button.removeEventListener('click', handleClick)
  }

  // Component logic API
  return {
    setDisabled(disabled: boolean) {
      button.disabled = disabled
      if (disabled) {
        button.classList.add('opacity-50', 'cursor-not-allowed')
      } else {
        button.classList.remove('opacity-50', 'cursor-not-allowed')
      }
    },

    getVariant() {
      return button.dataset.variant || 'primary'
    },

    release
  }
}

const id = { id: "mybutton" }

const MyButton = createBlueprint<MyButtonProps, MyButtonEvents, MyButtonLogic>(
  id,
  render,
  {
    domEvents: ['click'],
    bind
  }
)

export default MyButton