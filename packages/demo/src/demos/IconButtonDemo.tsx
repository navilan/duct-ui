import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeIconButton from "@duct-ui/components/button/icon-button"
import makeDemoLayout from "../components/DemoLayout"
import makeEventLog, { EventLogLogic } from "../components/EventLog"
import iconOne from "../icons/one.svg"
import iconTwo from "../icons/two.svg"
import iconThree from "../icons/three.svg"

export interface IconButtonDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface IconButtonDemoLogic {
  // Component logic methods if needed
}

export interface IconButtonDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

let eventLogComponent: EventLogLogic | undefined

function handleButtonClick(el: Element, _e: Event) {
  const button = el.closest('[data-button-id]')
  if (button) {
    const message = button.getAttribute('data-message')
    if (message && eventLogComponent) {
      eventLogComponent.addEvent(message)
    }
  }
}

function handleButtonBind(el: HTMLElement) {
  const message = el.dataset['message']
  if (message && eventLogComponent) {
    eventLogComponent.addEvent(`${message} (bound to DOM)`)
  }
}

function render(props: BaseProps<IconButtonDemoProps>) {
  const DemoLayout = makeDemoLayout()
  const IconButton1 = makeIconButton()
  const IconButton2 = makeIconButton()
  const IconButton3 = makeIconButton()
  const IconButton4 = makeIconButton()
  const IconButton5 = makeIconButton()
  const IconButton6 = makeIconButton()
  const EmojiButton1 = makeIconButton()
  const EmojiButton2 = makeIconButton()
  const EmojiButton3 = makeIconButton()
  const EmojiButton4 = makeIconButton()
  const EmojiButton5 = makeIconButton()
  const EmojiButton6 = makeIconButton()
  const EventLog = makeEventLog()

  EventLog.getLogic().then(l => {
    eventLogComponent = l
  })

  return (
    <div {...props}>
      <DemoLayout
        title="Icon Button Component"
        description="Button component with icon support and flexible positioning"
        sourcePath="/demos/IconButtonDemo.tsx"
      >
        <div>
          <h2 class="text-2xl font-semibold mb-4">Icon Button Examples</h2>

          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-medium mb-3">Icon Positions</h3>
              <div id="buttons" class="flex flex-row items-start gap-4 tiny-button-image">
                <IconButton1
                  icon={{ src: iconOne }}
                  position="start"
                  label="Start Icon"
                  class="btn btn-outline px-6"
                  data-message="Start position icon clicked!"
                  data-button-id="icon-button1"
                  on:click={handleButtonClick}
                />
                <IconButton2
                  icon={{ src: iconTwo }}
                  position="end"
                  label="End Icon"
                  class="btn btn-outline px-6"
                  data-message="End position icon clicked!"
                  data-button-id="icon-button2"
                  on:click={handleButtonClick}
                />
                <IconButton3
                  icon={{ src: iconThree }}
                  class="btn btn-outline px-3 rounded-full"
                  data-message="Icon-only button bound!"
                  data-button-id="icon-button3"
                  on:bind={handleButtonBind}
                />
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-3">Different Styles</h3>
              <div class="flex flex-row items-start gap-4 tiny-button-image">
                <IconButton4
                  icon={{ src: iconOne }}
                  label="Primary"
                  class="btn btn-primary"
                  data-message="Primary icon button!"
                  data-button-id="icon-button4"
                  on:click={handleButtonClick}
                />
                <IconButton5
                  icon={{ src: iconTwo }}
                  label="Secondary"
                  class="btn btn-secondary"
                  data-message="Secondary icon button!"
                  data-button-id="icon-button5"
                  on:click={handleButtonClick}
                />
                <IconButton6
                  icon={{ src: iconThree }}
                  label="Accent"
                  class="btn btn-accent"
                  data-message="Accent icon button!"
                  data-button-id="icon-button6"
                  on:click={handleButtonClick}
                />
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-3">Emoji Icons</h3>
              <div class="space-y-4">
                <div>
                  <h4 class="text-md font-medium mb-2 text-base-content/80">Actions</h4>
                  <div class="flex flex-row items-start gap-4">
                    <EmojiButton1
                      icon="❤️"
                      label="Like"
                      class="btn btn-outline"
                      data-message="Liked!"
                      data-button-id="emoji-button1"
                      on:click={handleButtonClick}
                    />
                    <EmojiButton2
                      icon="💾"
                      label="Save"
                      class="btn btn-outline"
                      data-message="Saved!"
                      data-button-id="emoji-button2"
                      on:click={handleButtonClick}
                    />
                    <EmojiButton3
                      icon="🗑️"
                      class="btn btn-outline btn-error px-3"
                      data-message="Deleted!"
                      data-button-id="emoji-button3"
                      on:click={handleButtonClick}
                    />
                  </div>
                </div>

                <div>
                  <h4 class="text-md font-medium mb-2 text-base-content/80">Navigation</h4>
                  <div class="flex flex-row items-start gap-4">
                    <EmojiButton4
                      icon="🏠"
                      label="Home"
                      class="btn btn-primary"
                      data-message="Navigate to home!"
                      data-button-id="emoji-button4"
                      on:click={handleButtonClick}
                    />
                    <EmojiButton5
                      icon="⚙️"
                      label="Settings"
                      class="btn btn-secondary"
                      data-message="Open settings!"
                      data-button-id="emoji-button5"
                      on:click={handleButtonClick}
                    />
                    <EmojiButton6
                      icon="📊"
                      label="Analytics"
                      class="btn btn-accent"
                      data-message="View analytics!"
                      data-button-id="emoji-button6"
                      on:click={handleButtonClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 space-y-6">
            <EventLog
              title="Event Log"
              maxHeight="max-h-32"
              data-event-log-component
            />

            <div class="p-4 bg-base-200 rounded-lg">
              <h3 class="text-lg font-medium mb-2">Features Demonstrated:</h3>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>Icon button component extending base button</li>
                <li>Flexible icon positioning (start, end, icon-only)</li>
                <li>SVG icon support with proper sizing</li>
                <li>Emoji icon support for quick visual communication</li>
                <li>Lifecycle event binding (<code>on:bind</code>)</li>
                <li>Component inheritance and reusability</li>
                <li>Multiple styling options (primary, secondary, accent, error)</li>
              </ul>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<IconButtonDemoEvents>): BindReturn<IconButtonDemoLogic> {
  function release() {
    eventLogComponent = undefined
  }
  return {
    release
  }
}

const id = { id: "duct-demo/icon-button-demo" }

export default () => {
  return createBlueprint<IconButtonDemoProps, IconButtonDemoEvents, IconButtonDemoLogic>(
    id,
    render,
    {
      bind
    }
  )
}