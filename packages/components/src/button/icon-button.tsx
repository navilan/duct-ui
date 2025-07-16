import { type BProps, createBlueprint } from "@duct-ui/core/blueprint"
import { ButtonEvents, ButtonProps } from "./button"

export type IconPosition = "start" | "end"

export type IconButtonProps = Partial<ButtonProps> & {
  icon: string
  position?: IconPosition
}

function render(props: BProps<IconButtonProps>) {
  const {
    label,
    'data-duct-id': id,
    position,
    icon,
    ...moreProps
  } = props

  return <button
    data-duct-id={id}
    {...moreProps}
  >
    {(position === 'start' || !position) && <img src={icon} />}
    {label}
    {position === 'end' && <img src={icon} />}
  </button>
}


// Define a unique ID for this component
const id = { id: "duct/icon-button" }

// Create the final component
export default () => {
  return createBlueprint<IconButtonProps, ButtonEvents>(
    id,
    render,
    {
      domEvents: ['click', 'dblclick'], // Automatically bind these DOM events
      customEvents: ['bind', 'release'], // Custom lifecycle events
    })
}