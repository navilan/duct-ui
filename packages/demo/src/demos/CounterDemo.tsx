import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import Dexie, { type Table } from 'dexie'
import DemoLayout from "@components/DemoLayout"

// Dexie database for persistent counter storage
interface CounterData {
  value: number
}

class CounterDatabase extends Dexie {
  counter!: Table<CounterData>

  constructor() {
    super('CounterDatabase')
    this.version(1).stores({
      counter: '++id, value'
    })
  }
}

const db = new CounterDatabase()

export interface CounterDemoEvents extends BaseComponentEvents {
  increment: (el: HTMLElement) => void
  decrement: (el: HTMLElement) => void
}

export interface CounterDemoLogic {
  increment: () => void
  decrement: () => void
  getValue: () => number
}

export interface CounterDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

interface LoadedCounterData {
  initialValue: number
}

function render(props: BaseProps<CounterDemoProps>) {
  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Counter with Async Loading"
        description="A simple counter that loads its initial value from IndexedDB using the new async load method"
        sourcePath="/demos/CounterDemo.tsx"
      >
        <div class="space-y-6">
          <div class="text-center">
            <div class="loading loading-spinner loading-lg" data-loading-indicator></div>
            <div class="hidden" data-counter-container>
              <h2 class="text-4xl font-bold mb-4">
                Count: <span data-counter-value>0</span>
              </h2>
              <div class="flex gap-4 justify-center">
                <button
                  class="btn btn-primary btn-lg"
                  data-increment-btn
                >
                  +
                </button>
                <button
                  class="btn btn-secondary btn-lg"
                  data-decrement-btn
                >
                  -
                </button>
              </div>
            </div>
          </div>

          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-lg font-medium mb-3">Async Load Demonstration:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li><strong>Render Phase</strong> - Component renders with loading state</li>
              <li><strong>Load Phase</strong> - Counter value loaded from IndexedDB asynchronously</li>
              <li><strong>Bind Phase</strong> - Event handlers bound with loaded data</li>
              <li><strong>Persistence</strong> - Counter changes are saved back to IndexedDB</li>
            </ul>
            <div class="mt-4 p-3 bg-info-content rounded border border-info/20">
              <p class="text-sm text-info/70">
                <strong>Try it:</strong> Increment/decrement the counter, then refresh the page.
                The counter will load its previous value from the database!
              </p>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

async function load(el: HTMLElement, _props: any): Promise<LoadedCounterData> {
  // Simulate some loading time to demonstrate async behavior
  await new Promise(resolve => setTimeout(resolve, 500))

  // Load counter value from database
  const existingCounter = await db.counter.orderBy('id').last()
  const initialValue = existingCounter?.value ?? 0

  return { initialValue }
}

function bind(
  el: HTMLElement,
  eventEmitter: EventEmitter<CounterDemoEvents>,
  _props: any,
  loadData?: LoadedCounterData
): BindReturn<CounterDemoLogic> {

  let currentValue = loadData?.initialValue ?? 0

  const loadingIndicator = el.querySelector('[data-loading-indicator]') as HTMLElement
  const counterContainer = el.querySelector('[data-counter-container]') as HTMLElement
  const counterValueEl = el.querySelector('[data-counter-value]') as HTMLElement
  const incrementBtn = el.querySelector('[data-increment-btn]') as HTMLButtonElement
  const decrementBtn = el.querySelector('[data-decrement-btn]') as HTMLButtonElement

  // Hide loading indicator and show counter
  loadingIndicator.classList.add('hidden')
  counterContainer.classList.remove('hidden')

  // Update display with loaded value
  counterValueEl.textContent = currentValue.toString()

  async function saveValue(value: number) {
    // Save to database
    await db.counter.clear() // Keep only one counter record
    await db.counter.add({ value })
  }

  function increment() {
    currentValue++
    counterValueEl.textContent = currentValue.toString()
    saveValue(currentValue)
  }

  function decrement() {
    currentValue--
    counterValueEl.textContent = currentValue.toString()
    saveValue(currentValue)
  }

  // Bind DOM events
  incrementBtn.addEventListener('click', increment)
  decrementBtn.addEventListener('click', decrement)

  // Bind component events
  eventEmitter.on('increment', increment)
  eventEmitter.on('decrement', decrement)

  function release() {
    incrementBtn.removeEventListener('click', increment)
    decrementBtn.removeEventListener('click', decrement)
  }

  return {
    increment,
    decrement,
    getValue: () => currentValue,
    release
  }
}

const id = { id: "duct-demo/counter-demo" }

const CounterDemo = createBlueprint<CounterDemoProps, CounterDemoEvents, CounterDemoLogic, LoadedCounterData>(
  id,
  render,
  {
    load,
    bind
  }
)

export default CounterDemo