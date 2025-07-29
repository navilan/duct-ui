import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

export type ToggleState = 'on' | 'off'

export interface ToggleEvents extends BaseComponentEvents {
  change: (el: HTMLElement, state: ToggleState) => void
}

export interface ToggleLogic {
  getState: () => ToggleState
  setState: (state: ToggleState) => void
  toggle: () => void
}

export interface ToggleProps {
  onLabel: string
  offLabel: string
  initialState?: ToggleState
  onClass?: string
  offClass?: string
  class?: string
  'on:change'?: (el: HTMLElement, state: ToggleState) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<ToggleProps>) {
  const {
    onLabel,
    offLabel,
    initialState = 'off',
    onClass = 'btn-primary',
    offClass = 'btn-outline',
    class: additionalClass = '',
    ...moreProps
  } = props

  const isOn = initialState === 'on'
  const currentClass = isOn ? onClass : offClass
  const currentLabel = isOn ? onLabel : offLabel

  return (
    <button
      class={`btn ${currentClass} ${additionalClass}`.trim()}
      data-toggle-btn
      {...moreProps}
    >
      {currentLabel}
    </button>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<ToggleEvents>, props: any): BindReturn<ToggleLogic> {
  const toggleBtn = el as HTMLButtonElement

  // Access classes from props instead of data attributes
  const onClass = props.onClass || 'btn-primary'
  const offClass = props.offClass || 'btn-outline'
  const additionalClass = props.class || ''
  const onLabel = props.onLabel
  const offLabel = props.offLabel

  let currentState: ToggleState = props.initialState || 'off'

  function updateUI() {
    if (!toggleBtn) return

    const isOn = currentState === 'on'
    const newClass = isOn ? onClass : offClass
    const newLabel = isOn ? onLabel : offLabel

    // Update button class including additional classes
    toggleBtn.className = `btn ${newClass} ${additionalClass}`.trim()
    toggleBtn.textContent = newLabel
  }

  function getState(): ToggleState {
    return currentState
  }

  function setState(state: ToggleState): void {
    currentState = state
    updateUI()
    eventEmitter.emit('change', state)
  }

  function toggle(): void {
    const newState = currentState === 'on' ? 'off' : 'on'
    setState(newState)
  }

  function handleClick() {
    toggle()
  }

  // Set up event listeners
  if (toggleBtn) {
    toggleBtn.addEventListener('click', handleClick)
  }

  function release() {
    if (toggleBtn) {
      toggleBtn.removeEventListener('click', handleClick)
    }
  }

  return {
    getState,
    setState,
    toggle,
    release
  }
}

const id = { id: "duct/toggle" }

const Toggle = createBlueprint<ToggleProps, ToggleEvents, ToggleLogic>(
  id,
  render,
  {
    bind
  }
)

export default Toggle