import { createBlueprint } from "@duct-ui/core/blueprint"

// Define the events this component can handle
export interface ButtonEvents extends Record<string, any> {
  bind: (el: HTMLElement) => void
  click: (el: HTMLElement, e: MouseEvent) => void
  dblclick: (el: HTMLElement, e: MouseEvent) => void
  release: (el: HTMLElement) => void
}

export type ButtonProps = {
  label: string
  'on:click'?: (el: HTMLElement, e: MouseEvent) => void
  'on:dblclick'?: (el: HTMLElement, e: MouseEvent) => void
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

function render(props: ButtonProps & { "data-duct-id": string }) {
  const {
    label,
    'data-duct-id': id,
    ...moreProps
  } = props

  return <button
    data-duct-id={id}
    {...moreProps}
  >
    {label}
  </button>
}

const id = { id: "duct/button" }

export default () => {
  return createBlueprint<ButtonProps, ButtonEvents>(
    id,
    render,
    {
      domEvents: ['click', 'dblclick'],
      customEvents: ['bind', 'release'],
    }
  )
}