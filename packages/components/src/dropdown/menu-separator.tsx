import { createBlueprint, type BindReturn, type BaseComponentEvents, BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

export interface MenuSeparatorEvents extends BaseComponentEvents { }

export interface MenuSeparatorLogic { }

export type MenuSeparatorProps = {
  class?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<MenuSeparatorProps>) {
  const {
    class: className = "",
    ...moreProps
  } = props

  return (
    <li class={`menu-title ${className}`.trim()} {...moreProps}>
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

const MenuSeparator = createBlueprint<MenuSeparatorProps, MenuSeparatorEvents, MenuSeparatorLogic>(
  id,
  render,
  {
    domEvents: [],
    bind
  },
)

export default MenuSeparator