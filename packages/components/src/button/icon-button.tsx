import { type BaseProps, createBlueprint, renderProps } from "@duct-ui/core/blueprint"
import { ButtonEvents, ButtonProps } from "./button.js"
import Icon, { type IconSource, type IconSize } from "../images/icon.js"

export type IconPosition = "start" | "end"

export type IconButtonProps = Partial<ButtonProps> & {
  icon: IconSource
  position?: IconPosition
  iconSize?: IconSize
  iconClass?: string
}

function renderIcon(icon: IconSource, size?: IconSize, iconClass?: string): JSX.Element {
  return <Icon icon={icon} size={size || "sm"} class={iconClass} />
}

function render(props: BaseProps<IconButtonProps>) {
  const {
    label,
    position,
    icon,
    iconSize,
    iconClass,
    ...moreProps
  } = props

  const iconElement = renderIcon(icon, iconSize, iconClass)

  return (
    <button {...renderProps(moreProps)}>
      {(position === 'start' || !position) && iconElement}
      {label}
      {position === 'end' && iconElement}
    </button>
  )
}


// Define a unique ID for this component
const id = { id: "duct/icon-button" }

// Create the final component
const IconButton = createBlueprint<IconButtonProps, ButtonEvents>(
  id,
  render,
  {
    domEvents: ['click', 'dblclick'], // Automatically bind these DOM events
  }
)

export default IconButton