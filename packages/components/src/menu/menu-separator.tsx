import { createBlueprint, EventEmitter, type BindReturn } from "@duct-ui/core/blueprint"

export interface MenuSeparatorEvents extends Record<string, any> {
  bind: (el: HTMLElement) => void
  release: (el: HTMLElement) => void
}

export interface MenuSeparatorLogic {}

export type MenuSeparatorProps = {
  class?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: MenuSeparatorProps & { "data-duct-id": string }) {
  const {
    class: className = "",
    'data-duct-id': id,
    ...moreProps
  } = props

  return (
    <li data-duct-id={id} class={`menu-title ${className}`.trim()} {...moreProps}>
      <hr class="my-1" />
    </li>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<MenuSeparatorEvents>): BindReturn<MenuSeparatorLogic> {
  function release() {
    // No event listeners to clean up for separator
  }

  return {
    release
  }
}

const id = { id: "duct/menu-separator" }

export default () => {
  return createBlueprint<MenuSeparatorProps, MenuSeparatorEvents, MenuSeparatorLogic>(
    id,
    render,
    {
      domEvents: [],
      customEvents: ['bind', 'release'],
      bind
    },
  )
}