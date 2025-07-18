
import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, BaseProps } from "@duct-ui/core/blueprint"

export type EditableMode = 'input' | 'label'

export interface InputEvents extends BaseComponentEvents {
  change: (el: HTMLElement, text: string) => void
}

export interface InputLogic {
  toggleEdit: () => void
  beginEdit: () => void
  cancelEdit: () => void
  commit: () => void
  getText: () => string
  setText: (text: string) => void
  getMode: () => EditableMode
  isEditing: () => boolean
}

export type InputProps = {
  text: string
  labelClass: string
  inputClass: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:change'?: (el: HTMLElement, text: string) => void
} & Record<string, any>

function render(props: BaseProps<InputProps>) {
  const {
    labelClass,
    inputClass,
    text,
    ...moreProps
  } = props

  return (
    <div
      data-editable-mode="label"
      {...moreProps}
    >
      <label class={labelClass} style="display: block;">{text}</label>
      <input class={inputClass} type="text" value={text} style="display: none;" />
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<InputEvents>): BindReturn<InputLogic> {
  function showLabel() {
    const label = getLabel()
    if (label) label.style.display = 'block'
  }

  function hideLabel() {
    const label = getLabel()
    if (label) label.style.display = 'none'
  }

  function showInput() {
    const input = getInput()
    if (input) {
      input.style.display = 'block'
      input.focus()
    }
  }

  function hideInput() {
    const input = getInput()
    if (input) input.style.display = 'none'
  }

  function toggleEdit() {
    let mode = getMode()
    if (mode === 'label') {
      beginEdit()
    } else {
      cancelEdit()
    }
  }

  function beginEdit() {
    el.dataset.editableMode = 'input'
    hideLabel()
    showInput()
  }

  function getInput(): HTMLInputElement | undefined {
    const inputs = el.getElementsByTagName('input')
    if (inputs.length === 0) {
      return
    }
    return inputs[0]
  }

  function getLabel(): HTMLLabelElement | undefined {
    const labels = el.getElementsByTagName('label')
    if (labels.length === 0) {
      return
    }
    return labels[0]
  }


  function resetInput() {
    const input = getInput()
    if (input) {
      input.value = getText()
    }
  }

  function cancelEdit() {
    console.log("canceling edit")
    resetInput()
    el.dataset.editableMode = 'label'
    hideInput()
    showLabel()
  }

  function commit() {
    const mode = getMode()
    if (mode === 'label') return
    const input = getInput()
    const label = getLabel()
    if (!input || !label) return
    const newText = input.value
    label.innerText = newText
    eventEmitter.emit('change', newText)
  }

  function getMode(): EditableMode {
    return (el.dataset.editableMode ?? 'label') as EditableMode
  }

  function getText() {
    const label = getLabel()
    return label ? label.innerText : ""
  }

  function setText(text: string) {
    const label = getLabel()
    const input = getInput()
    if (label) label.innerText = text
    if (input) input.value = text
  }

  function isEditing(): boolean {
    return getMode() === 'input'
  }

  function blurHandler(e: FocusEvent) {
    const focusingOn = e.relatedTarget as HTMLElement
    if (focusingOn && focusingOn.closest('[data-editable-control')) {
      return
    }
    cancelEdit()
  }

  function clickOutsideHandler(e: Event) {
    const clicked = e.target as HTMLElement
    if (el.contains(clicked)) {
      return
    }

    // Don't cancel if clicking on control buttons or elements with data-editable-control
    if (clicked.closest('[data-editable-control]') ||
      clicked.closest('button') ||
      clicked.hasAttribute('data-editable-control]')) {
      return
    }

    if (isEditing()) {
      cancelEdit()
    }
  }

  function keyHandler(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      commit()
      cancelEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  function labelClickHandler(e: Event) {
    e.preventDefault()
    if (getMode() === 'label') {
      beginEdit()
    }
  }

  const input = getInput()
  const label = getLabel()

  if (input) {
    input.addEventListener('blur', blurHandler)
    input.addEventListener('keydown', keyHandler)
  }

  if (label) {
    label.addEventListener('click', labelClickHandler)
  }

  document.addEventListener('click', clickOutsideHandler)

  function release() {
    input?.removeEventListener('blur', blurHandler)
    input?.removeEventListener('keydown', keyHandler)
    label?.removeEventListener('click', labelClickHandler)
    document.removeEventListener('click', clickOutsideHandler)
  }

  return {
    toggleEdit,
    getText,
    setText,
    getMode,
    isEditing,
    commit,
    cancelEdit,
    beginEdit,
    release
  }
}

const id = { id: "duct/editable-input" }

export default () => {
  return createBlueprint<InputProps, InputEvents, InputLogic>(
    id,
    render,
    {
      domEvents: ['click', 'dblclick'],
      bind
    },
  )
}