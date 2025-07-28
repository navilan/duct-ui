import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import makeButton from "@duct-ui/components/button/button"
import makeDemoLayout from "../components/DemoLayout"
import makeEventLog, { EventLogLogic } from "../components/EventLog"

export interface ButtonDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface ButtonDemoLogic {
  // Component logic methods if needed
}

export interface ButtonDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}


const eventLogRef = createRef<EventLogLogic>()

function handleButtonClick(el: Element, _e: Event) {
  const button = el.closest('[data-button-id]')
  if (button) {
    const message = button.getAttribute('data-message')
    if (message && eventLogRef.current) {
      eventLogRef.current.addEvent(message)
    }
  }
}


function render(props: BaseProps<ButtonDemoProps>) {
  const DemoLayout = makeDemoLayout()
  const Button1 = makeButton()
  const Button2 = makeButton()
  const Button3 = makeButton()
  const EventLog = makeEventLog()



  return (
    <div {...props}>
      <DemoLayout
        title="Button Component"
        description="Basic button component with click event handling"
        sourcePath="/demos/ButtonDemo.tsx"
      >
        <div>
          <h2 class="text-2xl font-semibold mb-4">Three Buttons Example</h2>
          <div id="buttons" class="flex flex-row items-start gap-4">
            <Button1
              label="One"
              class="btn btn-primary"
              data-message="First button clicked!"
              data-button-id="button1"
              on:click={handleButtonClick}
            />
            <Button2
              label="Two"
              class="btn btn-secondary"
              data-message="Second button clicked!"
              data-button-id="button2"
              on:click={handleButtonClick}
            />
            <Button3
              label="Three"
              class="btn btn-outline"
              data-message="Third button clicked!"
              data-button-id="button3"
              on:click={handleButtonClick}
            />
          </div>

          <div class="mt-8 space-y-6">
            <EventLog
              ref={eventLogRef}
              title="Event Log"
              maxHeight="max-h-32"
              data-event-log-component
            />

            <div class="p-4 bg-base-200 rounded-lg">
              <h3 class="text-lg font-medium mb-2">Features Demonstrated:</h3>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>Basic button component with label</li>
                <li>Different DaisyUI styling classes</li>
                <li>Event handling via both <code>on:click</code> props and component refs</li>
                <li>Data attributes for context passing</li>
                <li>Reusable EventLog component with proper cleanup</li>
              </ul>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<ButtonDemoEvents>): BindReturn<ButtonDemoLogic> {
  return {
    release: () => {
      // Ref cleanup is handled automatically
    }
  }
}

const id = { id: "duct-demo/button-demo" }

export default () => {
  return createBlueprint<ButtonDemoProps, ButtonDemoEvents, ButtonDemoLogic>(
    id,
    render,
    {
      bind
    }
  )
}