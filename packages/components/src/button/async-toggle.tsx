import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from '@duct-ui/core/blueprint'
import { EventEmitter } from '@duct-ui/core/shared'

export type AsyncToggleState = 'on' | 'off' | 'loading'

export interface AsyncToggleEvents extends BaseComponentEvents {
  'switched-on': (el: HTMLElement) => void
  'switched-off': (el: HTMLElement) => void
  error: (el: HTMLElement, error: Error) => void
}

export interface AsyncToggleLogic {
  refreshState: () => Promise<void>
  getCurrentState: () => AsyncToggleState
  release: () => void
}

export interface AsyncToggleLoadData {
  initialState: AsyncToggleState
}

export type AsyncToggleProps = {
  onLabel?: string
  offLabel?: string
  loadingLabel?: string
  onClass?: string
  offClass?: string
  loadingClass?: string
  disabled?: boolean
  isOn: () => Promise<boolean>
  switchOn: () => Promise<void>
  switchOff: () => Promise<void>
  'on:switched-on'?: (el: HTMLElement) => void
  'on:switched-off'?: (el: HTMLElement) => void
  'on:error'?: (el: HTMLElement, error: Error) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<AsyncToggleProps>) {
  const {
    onLabel = 'On',
    offLabel = 'Off',
    loadingLabel = 'Loading...',
    class: className = '',
    disabled = false,
    onClass, offClass, loadingClass,
    isOn, switchOn, switchOff,
    ...moreProps
  } = props

  return (
    <button
      class={`btn ${className}`.trim()}
      disabled={disabled}
      data-async-toggle
      {...moreProps}
    >
      <span data-toggle-label>{loadingLabel}</span>
    </button>
  )
}

async function load(
  el: HTMLElement,
  props: AsyncToggleProps
): Promise<AsyncToggleLoadData> {
  try {
    const isCurrentlyOn = await props.isOn()
    return {
      initialState: isCurrentlyOn ? 'on' : 'off'
    }
  } catch (error) {
    console.error('AsyncToggle: Error loading initial state:', error)
    return {
      initialState: 'off'
    }
  }
}

function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<AsyncToggleEvents>,
  props: AsyncToggleProps,
  loadData?: AsyncToggleLoadData
): BindReturn<AsyncToggleLogic> {
  const button = el as HTMLButtonElement
  const labelSpan = button.querySelector('[data-toggle-label]') as HTMLSpanElement

  let currentState: AsyncToggleState = loadData?.initialState ?? 'loading'
  let isProcessing = false

  const {
    onLabel = 'On',
    offLabel = 'Off',
    loadingLabel = 'Loading...',
    onClass = '',
    offClass = '',
    loadingClass = 'loading'
  } = props

  const onClasses = onClass.split(' ').filter(c => !!c)
  const offClasses = offClass.split(' ').filter(c => !!c)
  const loadingClasses = loadingClass.split(' ').filter(c => !!c)

  function updateUI() {
    // Update label
    switch (currentState) {
      case 'on':
        labelSpan.textContent = onLabel
        break
      case 'off':
        labelSpan.textContent = offLabel
        break
      case 'loading':
        labelSpan.textContent = loadingLabel
        break
    }

    // Remove all state-specific classes
    const allStateClasses = [
      ...onClasses,
      ...offClasses,
      ...loadingClasses
    ]

    button.classList.remove(...allStateClasses)

    // Add classes for current state
    let classesToAdd: string[] = []
    switch (currentState) {
      case 'on':
        classesToAdd = [...onClasses]
        break
      case 'off':
        classesToAdd = [...offClasses]
        break
      case 'loading':
        classesToAdd = [...loadingClasses]
        break
    }

    button.classList.add(...classesToAdd)

    // Update disabled state
    button.disabled = props.disabled || currentState === 'loading'
  }

  async function handleClick() {
    if (isProcessing || currentState === 'loading') return

    isProcessing = true
    const previousState = currentState
    currentState = 'loading'
    updateUI()

    try {
      if (previousState === 'off') {
        await props.switchOn()
      } else {
        await props.switchOff()
      }

      // Check actual state after the operation
      const actualState = await props.isOn()
      currentState = actualState ? 'on' : 'off'
      updateUI()

      // Emit the appropriate event
      if (currentState === 'on') {
        eventEmitter.emit('switched-on', button)
      } else {
        eventEmitter.emit('switched-off', button)
      }
    } catch (error) {
      // Revert to previous state on error
      currentState = previousState
      updateUI()

      console.error('AsyncToggle: Error during toggle operation:', error)
      eventEmitter.emit('error', button, error as Error)
    } finally {
      isProcessing = false
    }
  }

  async function refreshState(): Promise<void> {
    if (isProcessing) return

    isProcessing = true
    const previousState = currentState
    currentState = 'loading'
    updateUI()

    try {
      const actualState = await props.isOn()
      currentState = actualState ? 'on' : 'off'
      updateUI()
    } catch (error) {
      // Revert to previous state on error
      currentState = previousState
      updateUI()

      console.error('AsyncToggle: Error refreshing state:', error)
      eventEmitter.emit('error', button, error as Error)
    } finally {
      isProcessing = false
    }
  }

  function getCurrentState(): AsyncToggleState {
    return currentState
  }

  // Set initial UI state
  updateUI()

  // Add click event listener
  button.addEventListener('click', handleClick)

  return {
    refreshState,
    getCurrentState,
    release: () => {
      button.removeEventListener('click', handleClick)
    }
  }
}

const id = { id: 'duct/async-toggle' }

export default () => {
  return createBlueprint<AsyncToggleProps, AsyncToggleEvents, AsyncToggleLogic, AsyncToggleLoadData>(
    id,
    render,
    { bind, load }
  )
}