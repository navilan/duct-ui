import { BaseProps, createBlueprint, type BaseComponentEvents, renderProps } from "@duct-ui/core/blueprint"

export interface ButtonEvents extends BaseComponentEvents {
  click: (el: HTMLElement, e: MouseEvent) => void
  dblclick: (el: HTMLElement, e: MouseEvent) => void
}

export type ButtonProps = {
  label: string
  'on:click'?: (el: HTMLElement, e: MouseEvent) => void
  'on:dblclick'?: (el: HTMLElement, e: MouseEvent) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: BaseProps<ButtonProps>) {
  const { label, ...moreProps } = props
  return <button {...renderProps(moreProps)}> {label} </button>
}

const id = { id: "duct/button" }

const Button = createBlueprint<ButtonProps, ButtonEvents>(
  id,
  render,
  {
    domEvents: ['click', 'dblclick']
  }
)

export default Button