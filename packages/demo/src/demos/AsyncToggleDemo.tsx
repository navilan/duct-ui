import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeAsyncToggle, { type AsyncToggleState } from "@duct-ui/components/button/async-toggle"
import makeButton from "@duct-ui/components/button/button"
import makeToggle, { type ToggleState } from "@duct-ui/components/button/toggle"
import makeDemoLayout from "../components/DemoLayout"
import makeEventLog, { EventLogLogic } from "../components/EventLog"

export interface AsyncToggleDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface AsyncToggleDemoLogic {
  release: () => void
}

export type AsyncToggleDemoProps = {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
} & Record<string, any>

// Simulate async API calls with different behaviors
class MockApiService {
  private state: boolean = false
  private failureMode: 'none' | 'load' | 'switch' = 'none'
  private delay: number = 1000

  setFailureMode(mode: 'none' | 'load' | 'switch') {
    this.failureMode = mode
  }

  setDelay(delay: number) {
    this.delay = delay
  }

  async isOn(): Promise<boolean> {
    await this.simulateDelay()
    if (this.failureMode === 'load') {
      throw new Error('Failed to load state from server')
    }
    return this.state
  }

  async switchOn(): Promise<void> {
    await this.simulateDelay()
    if (this.failureMode === 'switch') {
      throw new Error('Failed to switch on')
    }
    this.state = true
  }

  async switchOff(): Promise<void> {
    await this.simulateDelay()
    if (this.failureMode === 'switch') {
      throw new Error('Failed to switch off')
    }
    this.state = false
  }

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.delay))
  }
}

let eventLogComponent: EventLogLogic | undefined

function render(props: BaseProps<AsyncToggleDemoProps>) {
  const DemoLayout = makeDemoLayout()
  const AsyncToggle1 = makeAsyncToggle()
  const AsyncToggle2 = makeAsyncToggle()
  const AsyncToggle3 = makeAsyncToggle()
  const AsyncToggle4 = makeAsyncToggle()
  const RefreshBtn = makeButton()
  const FailureModeBtn = makeButton()
  const DelayToggle = makeToggle()
  const EventLog = makeEventLog()

  // Get the event log component logic
  EventLog.getLogic().then(l => {
    eventLogComponent = l
  })

  // Create separate API services for different examples
  const basicApi = new MockApiService()
  const styledApi = new MockApiService()
  const errorApi = new MockApiService()
  const fastApi = new MockApiService()
  fastApi.setDelay(200)

  function logEvent(message: string) {
    if (eventLogComponent) {
      eventLogComponent.addEvent(`${new Date().toLocaleTimeString()}: ${message}`)
    }
  }

  function handleSwitchedOn(el: HTMLElement) {
    const toggleId = el.dataset.toggleId || 'unknown'
    logEvent(`Toggle ${toggleId} switched ON`)
  }

  function handleSwitchedOff(el: HTMLElement) {
    const toggleId = el.dataset.toggleId || 'unknown'
    logEvent(`Toggle ${toggleId} switched OFF`)
  }

  function handleError(el: HTMLElement, error: Error) {
    const toggleId = el.dataset.toggleId || 'unknown'
    logEvent(`Toggle ${toggleId} ERROR: ${error.message}`)
  }

  function handleRefresh() {
    logEvent('Manually refreshing all toggle states...')
  }

  function toggleFailureMode() {
    const currentMode = errorApi['failureMode']
    const nextMode = currentMode === 'none' ? 'switch' : currentMode === 'switch' ? 'load' : 'none'
    errorApi.setFailureMode(nextMode)
    logEvent(`Error simulation set to: ${nextMode}`)
  }

  function handleDelayToggle(_el: HTMLElement, state: ToggleState) {
    const newDelay = state === 'on' ? 3000 : 1000
    basicApi.setDelay(newDelay)
    styledApi.setDelay(newDelay)
    errorApi.setDelay(newDelay)
    logEvent(`Delay set to: ${newDelay}ms`)
  }

  return (
    <div {...props}>
      <DemoLayout
        title="Async Toggle Component"
        description="Toggle button with asynchronous state management and custom async operations"
        sourcePath="/demos/AsyncToggleDemo.tsx"
      >
        <div>
          <div class="space-y-8">

            {/* Basic Usage */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <h3 class="text-lg font-medium mb-2">Standard Async Toggle</h3>
                  <div class="bg-base-200 p-4 rounded-lg">
                    <AsyncToggle1
                      data-toggle-id="basic"
                      isOn={basicApi.isOn.bind(basicApi)}
                      switchOn={basicApi.switchOn.bind(basicApi)}
                      switchOff={basicApi.switchOff.bind(basicApi)}
                      on:switched-on={handleSwitchedOn}
                      on:switched-off={handleSwitchedOff}
                      on:error={handleError}
                    />
                  </div>
                  <p class="text-sm text-base-content/60 mt-2">
                    Basic async toggle with 1 second simulated API delay.
                  </p>
                </div>

                <div>
                  <h3 class="text-lg font-medium mb-2">Custom Styling</h3>
                  <div class="bg-base-200 p-4 rounded-lg">
                    <AsyncToggle2
                      data-toggle-id="styled"
                      onLabel="🟢 Enabled"
                      offLabel="🔴 Disabled"
                      loadingLabel="⏳ Working..."
                      onClass="btn-success"
                      offClass="btn-error"
                      loadingClass="btn-warning loading"
                      isOn={styledApi.isOn.bind(styledApi)}
                      switchOn={styledApi.switchOn.bind(styledApi)}
                      switchOff={styledApi.switchOff.bind(styledApi)}
                      on:switched-on={handleSwitchedOn}
                      on:switched-off={handleSwitchedOff}
                      on:error={handleError}
                    />
                  </div>
                  <p class="text-sm text-base-content/60 mt-2">
                    Custom labels, emojis, and styling classes.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Examples */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Advanced Examples</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <h3 class="text-lg font-medium mb-2">Error Handling</h3>
                  <div class="bg-base-200 p-4 rounded-lg space-y-2">
                    <AsyncToggle3
                      data-toggle-id="error"
                      onLabel="Success Mode"
                      offLabel="Error Mode"
                      loadingLabel="Processing..."
                      isOn={errorApi.isOn.bind(errorApi)}
                      switchOn={errorApi.switchOn.bind(errorApi)}
                      switchOff={errorApi.switchOff.bind(errorApi)}
                      on:switched-on={handleSwitchedOn}
                      on:switched-off={handleSwitchedOff}
                      on:error={handleError}
                    />
                    <div class="flex gap-2">
                      <FailureModeBtn
                        label="Toggle Error Mode"
                        class="btn btn-xs btn-warning"
                        on:click={toggleFailureMode}
                      />
                    </div>
                  </div>
                  <p class="text-sm text-base-content/60 mt-2">
                    Toggle with simulated API failures. Use the button to toggle error simulation.
                  </p>
                </div>

                <div>
                  <h3 class="text-lg font-medium mb-2">Fast Response</h3>
                  <div class="bg-base-200 p-4 rounded-lg">
                    <AsyncToggle4
                      data-toggle-id="fast"
                      onLabel="⚡ Fast ON"
                      offLabel="⚡ Fast OFF"
                      loadingLabel="⚡ Quick..."
                      onClass="btn-accent"
                      offClass="btn-ghost"
                      isOn={fastApi.isOn.bind(fastApi)}
                      switchOn={fastApi.switchOn.bind(fastApi)}
                      switchOff={fastApi.switchOff.bind(fastApi)}
                      on:switched-on={handleSwitchedOn}
                      on:switched-off={handleSwitchedOff}
                      on:error={handleError}
                    />
                  </div>
                  <p class="text-sm text-base-content/60 mt-2">
                    Fast toggle with 200ms response time.
                  </p>
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Control Panel</h2>
              <div class="bg-base-200 p-4 rounded-lg">
                <div class="flex gap-2 flex-wrap">
                  <RefreshBtn
                    label="Refresh All States"
                    class="btn btn-primary btn-sm"
                    on:click={handleRefresh}
                  />
                  <DelayToggle
                    onLabel="3s Delay"
                    offLabel="1s Delay"
                    onClass="btn btn-warning btn-sm"
                    offClass="btn btn-secondary btn-sm"
                    on:change={handleDelayToggle}
                  />
                </div>
                <p class="text-sm text-base-content/60 mt-2">
                  Control the behavior of the async toggles above.
                </p>
              </div>
            </div>

            {/* Event Log */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Event Log</h2>
              <EventLog
                title="Async Toggle Events"
                maxHeight="max-h-64"
                data-event-log-component
              />
            </div>

            {/* Features Documentation */}
            <div class="bg-base-200 p-6 rounded-lg">
              <h3 class="text-lg font-medium mb-3">Async Toggle Features:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Async State Loading</strong> - Uses load lifecycle to get initial state</li>
                  <li><strong>Custom Async Functions</strong> - isOn(), switchOn(), switchOff() props</li>
                  <li><strong>Loading States</strong> - Visual feedback during async operations</li>
                  <li><strong>Error Handling</strong> - Graceful error handling with error events</li>
                  <li><strong>State Verification</strong> - Confirms state after operations</li>
                </ul>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Custom Labels</strong> - onLabel, offLabel, loadingLabel props</li>
                  <li><strong>Custom Styling</strong> - onClass, offClass, loadingClass props</li>
                  <li><strong>Events</strong> - switched-on, switched-off, error events</li>
                  <li><strong>Logic Methods</strong> - refreshState(), getCurrentState()</li>
                  <li><strong>State Management</strong> - Prevents concurrent operations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<AsyncToggleDemoEvents>): BindReturn<AsyncToggleDemoLogic> {
  function release() {
    eventLogComponent = undefined
  }

  return {
    release
  }
}

const id = { id: "duct-demo/async-toggle" }

export default () => {
  return createBlueprint<AsyncToggleDemoProps, AsyncToggleDemoEvents, AsyncToggleDemoLogic>(
    id,
    render,
    { bind }
  )
}