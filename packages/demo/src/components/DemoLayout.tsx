import { createBlueprint } from "@duct-ui/core/blueprint"

export interface DemoLayoutEvents extends Record<string, any> {
  bind: (el: HTMLElement) => void
  release: (el: HTMLElement) => void
}

export interface DemoLayoutProps {
  title: string
  description?: string
  children: JSX.Element
}

function render(props: DemoLayoutProps & { "data-duct-id": string }) {
  const {
    title,
    description,
    children,
    'data-duct-id': id,
    ...moreProps
  } = props

  return (
    <div
      data-duct-id={id}
      class="flex-1 overflow-y-auto bg-base-100"
      {...moreProps}
    >
      <div class="p-8">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-base-content mb-2">{title}</h1>
          {description && (
            <p class="text-lg text-base-content/70">{description}</p>
          )}
        </div>

        <div class="demo-content">
          {children}
        </div>
      </div>
    </div>
  )
}

const id = { id: "duct/demo-layout" }

export default () => {
  return createBlueprint<DemoLayoutProps, DemoLayoutEvents>(
    id,
    render,
    {
      customEvents: ['bind', 'release']
    }
  )
}