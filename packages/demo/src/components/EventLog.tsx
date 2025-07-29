import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"

export interface EventLogEvents extends BaseComponentEvents {
  // No custom events needed for this component
}

export interface EventLogLogic {
  addEvent: (message: string) => void
  clearEvents: () => void
  getEvents: () => string[]
}

export interface EventLogProps {
  title?: string
  maxEvents?: number
  maxHeight?: string
  class?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<EventLogProps>) {
  const {
    title = "Event Log",
    maxHeight = "max-h-32",
    class: className = "",
    ...moreProps
  } = props

  return (
    <div class={`p-4 bg-base-200 rounded-lg ${className}`.trim()} {...moreProps}>
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-medium">{title}</h3>
        <button 
          class="btn btn-sm btn-outline" 
          data-clear-log
        >
          Clear
        </button>
      </div>
      <div 
        class={`${maxHeight} overflow-y-auto space-y-1 text-sm`}
        data-event-log
      >
        <p class="text-sm text-base-content/50">No events yet...</p>
      </div>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<EventLogEvents>): BindReturn<EventLogLogic> {
  const logElement = el.querySelector('[data-event-log]') as HTMLElement
  const clearButton = el.querySelector('[data-clear-log]') as HTMLElement
  
  let eventLog: string[] = []
  const maxEvents = 15 // Default maximum events to keep

  function updateEventLog() {
    if (logElement) {
      logElement.innerHTML = eventLog.length === 0 
        ? '<p class="text-sm text-base-content/50">No events yet...</p>'
        : eventLog.map(event => `<p class="text-sm font-mono">${event}</p>`).join('')
      
      // Scroll to the end to show the latest event
      logElement.scrollTop = logElement.scrollHeight
    }
  }

  function addEvent(message: string) {
    const timestamp = new Date().toLocaleTimeString()
    eventLog.push(`[${timestamp}] ${message}`)
    
    // Keep only the last maxEvents entries
    if (eventLog.length > maxEvents) {
      eventLog = eventLog.slice(-maxEvents)
    }
    
    updateEventLog()
  }

  function clearEvents() {
    eventLog = []
    updateEventLog()
  }

  function getEvents(): string[] {
    return [...eventLog]
  }

  function handleClearClick() {
    clearEvents()
  }

  // Set up event listeners
  if (clearButton) {
    clearButton.addEventListener('click', handleClearClick)
  }

  function release() {
    if (clearButton) {
      clearButton.removeEventListener('click', handleClearClick)
    }
    eventLog = []
  }

  return {
    addEvent,
    clearEvents,
    getEvents,
    release
  }
}

const id = { id: "duct-demo/event-log" }

const EventLog = createBlueprint<EventLogProps, EventLogEvents, EventLogLogic>(
  id,
  render,
  {
    bind
  }
)

export default EventLog