import makeIconButton from "@duct-ui/components/button/icon-button"
import makeDemoLayout from "../components/DemoLayout"
import iconOne from "../icons/one.svg"
import iconTwo from "../icons/two.svg"
import iconThree from "../icons/three.svg"

let eventLog: string[] = []

const updateEventLog = () => {
  const logElement = document.getElementById('event-log')
  if (logElement) {
    logElement.innerHTML = eventLog.length === 0 
      ? '<p class="text-sm text-base-content/50">No events yet...</p>'
      : eventLog.map(event => `<p class="text-sm font-mono">${event}</p>`).join('')
  }
}

const handler = (el: HTMLElement) => {
  const message = el.dataset['message']
  const timestamp = new Date().toLocaleTimeString()
  eventLog.push(`[${timestamp}] ${message}`)
  updateEventLog()
  console.log(message)
}

const bindHandler = (el: HTMLElement) => {
  const message = el.dataset['message']
  const timestamp = new Date().toLocaleTimeString()
  eventLog.push(`[${timestamp}] ${message} (bound to DOM)`)
  updateEventLog()
  console.log(message, "bound to DOM")
}

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

const DemoLayout = makeDemoLayout()

export function IconButtonDemo() {
  return (
    <DemoLayout
      title="Icon Button Component"
      description="Button component with icon support and flexible positioning"
    >
      <div>
        <h2 class="text-2xl font-semibold mb-4">Icon Button Examples</h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-3">Icon Positions</h3>
            <div id="buttons" class="flex flex-row items-start gap-4 tiny-button-image">
              <IconButton1
                icon={{src: iconOne}}
                position="start"
                label="Start Icon"
                class="btn btn-outline px-6"
                data-message="Start position icon clicked!"
                on:click={handler}
              />
              <IconButton2
                icon={{src: iconTwo}}
                position="end"
                label="End Icon"
                class="btn btn-outline px-6"
                data-message="End position icon clicked!"
                on:click={handler}
              />
              <IconButton3
                icon={{src: iconThree}}
                class="btn btn-outline px-3 rounded-full"
                data-message="Icon-only button bound!"
                on:bind={bindHandler}
              />
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium mb-3">Different Styles</h3>
            <div class="flex flex-row items-start gap-4 tiny-button-image">
              <IconButton4
                icon={{src: iconOne}}
                label="Primary"
                class="btn btn-primary"
                data-message="Primary icon button!"
                on:click={handler}
              />
              <IconButton5
                icon={{src: iconTwo}}
                label="Secondary"
                class="btn btn-secondary"
                data-message="Secondary icon button!"
                on:click={handler}
              />
              <IconButton6
                icon={{src: iconThree}}
                label="Accent"
                class="btn btn-accent"
                data-message="Accent icon button!"
                on:click={handler}
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
                    on:click={handler}
                  />
                  <EmojiButton2
                    icon="💾"
                    label="Save"
                    class="btn btn-outline"
                    data-message="Saved!"
                    on:click={handler}
                  />
                  <EmojiButton3
                    icon="🗑️"
                    class="btn btn-outline btn-error px-3"
                    data-message="Deleted!"
                    on:click={handler}
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
                    on:click={handler}
                  />
                  <EmojiButton5
                    icon="⚙️"
                    label="Settings"
                    class="btn btn-secondary"
                    data-message="Open settings!"
                    on:click={handler}
                  />
                  <EmojiButton6
                    icon="📊"
                    label="Analytics"
                    class="btn btn-accent"
                    data-message="View analytics!"
                    on:click={handler}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 space-y-6">
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-medium">Event Log</h3>
              <button 
                class="btn btn-sm btn-outline" 
                onclick="document.getElementById('event-log').parentElement.querySelector('button').previousElementSibling.innerHTML = '<p class=&quot;text-sm text-base-content/50&quot;>No events yet...</p>'; eventLog = []"
              >
                Clear
              </button>
            </div>
            <div id="event-log" class="max-h-32 overflow-y-auto space-y-1 text-sm">
              <p class="text-sm text-base-content/50">No events yet...</p>
            </div>
          </div>
          
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
  )
}