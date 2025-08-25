import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import Toggle, { type ToggleState } from "@duct-ui/components/button/toggle"
import DemoLayout from "@components/DemoLayout"
import EventLog, { EventLogLogic } from "@components/EventLog"

export interface ToggleDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface ToggleDemoLogic {
  // Component logic methods if needed
}

export interface ToggleDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

const eventLogRef = createRef<EventLogLogic>()

function addToLog(message: string) {
  if (eventLogRef.current) {
    eventLogRef.current.addEvent(message)
  }
}

// Event handlers
function handleLightToggle(_el: HTMLElement, state: ToggleState) {
  addToLog(`Light is now ${state === 'on' ? 'ON' : 'OFF'}`)
}

function handleNotificationsToggle(_el: HTMLElement, state: ToggleState) {
  addToLog(`Notifications ${state === 'on' ? 'enabled' : 'disabled'}`)
}

function handleModeToggle(_el: HTMLElement, state: ToggleState) {
  addToLog(`Switched to ${state === 'on' ? 'Dark Mode' : 'Light Mode'}`)
}

function handlePremiumToggle(_el: HTMLElement, state: ToggleState) {
  addToLog(`Premium features ${state === 'on' ? 'activated' : 'deactivated'}`)
}

function render(props: BaseProps<ToggleDemoProps>) {
  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Toggle Component Demo"
        description="Interactive toggle buttons with different states and styling"
        sourcePath="/demos/ToggleDemo.tsx"
      >
        <div>
          <div class="space-y-6">

            {/* Basic Toggles */}
            <div>
              <h2 class="text-xl font-semibold mb-4">Basic Toggle Examples</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">Room Light</div>
                    <div class="text-sm text-base-content/60">Control room lighting</div>
                  </div>
                  <Toggle
                    onLabel="Turn Off"
                    offLabel="Turn On"
                    initialState="off"
                    onClass="btn-success"
                    offClass="btn-outline"
                    class="btn btn-sm"
                    on:change={handleLightToggle}
                  />
                </div>

                <div class="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">Notifications</div>
                    <div class="text-sm text-base-content/60">Enable push notifications</div>
                  </div>
                  <Toggle
                    onLabel="Disable"
                    offLabel="Enable"
                    initialState="on"
                    onClass="btn-error"
                    offClass="btn-primary"
                    class="btn btn-sm"
                    on:change={handleNotificationsToggle}
                  />
                </div>
              </div>
            </div>

            {/* Styled Toggles */}
            <div>
              <h2 class="text-xl font-semibold mb-4">Styled Toggle Examples</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">Theme Mode</div>
                    <div class="text-sm text-base-content/60">Switch between light and dark</div>
                  </div>
                  <Toggle
                    onLabel="🌙 Dark"
                    offLabel="☀️ Light"
                    initialState="off"
                    onClass="btn-neutral"
                    offClass="btn-warning"
                    class="btn btn-sm"
                    on:change={handleModeToggle}
                  />
                </div>

                <div class="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-medium">Premium Features</div>
                    <div class="text-sm text-base-content/60">Access premium functionality</div>
                  </div>
                  <Toggle
                    onLabel="⭐ Active"
                    offLabel="Upgrade"
                    initialState="off"
                    onClass="btn-warning"
                    offClass="btn-ghost"
                    class="btn btn-sm"
                    on:change={handlePremiumToggle}
                  />
                </div>
              </div>
            </div>

            {/* Event Log */}
            <div>
              <h2 class="text-xl font-semibold mb-4">Activity Log</h2>
              <EventLog
                ref={eventLogRef}
                title="Toggle Events"
                maxHeight="max-h-48"
                data-event-log-component
              />
            </div>

            {/* Documentation */}
            <div class="bg-base-200 p-6 rounded-lg">
              <h3 class="text-lg font-medium mb-3">Toggle Component Features:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Dual State</strong> - Toggle between 'on' and 'off' states</li>
                  <li><strong>Custom Labels</strong> - Different labels for each state</li>
                  <li><strong>State Events</strong> - Emits 'change' event with current state</li>
                  <li><strong>Initial State</strong> - Set starting state with 'initialState' prop</li>
                </ul>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Custom Styling</strong> - 'onClass' and 'offClass' for state-specific styles</li>
                  <li><strong>Additional Classes</strong> - 'class' prop for common styling</li>
                  <li><strong>TypeScript Support</strong> - Full type safety with ToggleState type</li>
                  <li><strong>Component Logic</strong> - Access toggle state and methods via refs</li>
                </ul>
              </div>

              <div class="mt-4 p-3 bg-info-content rounded border border-info/20">
                <p class="text-sm text-info/70">
                  <strong>Try it:</strong> Click any toggle to see how the state changes are tracked in the activity log.
                  Each toggle maintains its own independent state and can have different styling for on/off states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<ToggleDemoEvents>): BindReturn<ToggleDemoLogic> {
  return {
    release: () => {
      // Ref cleanup is handled automatically
    }
  }
}

const id = { id: "duct-demo/toggle-demo" }

const ToggleDemo = createBlueprint<ToggleDemoProps, ToggleDemoEvents, ToggleDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default ToggleDemo