import { getDuct } from "./runtime"
import { observeLifecycle, cleanupLifecycleHandler } from "./lifecycle"
import { ObservableV2 as Observable } from 'lib0/observable'

export type BaseProps<Props> = Props & { "data-duct-id": string }

// Base events that all components have
export interface BaseComponentEvents extends Record<string, any> {
  bind: (el: HTMLElement) => void
  release: (el: HTMLElement) => void
}

interface ComponentEvents<Logic extends Record<string, any>> {
  bound: (logic: Logic) => void
}

let instanceCounter = 0

// Global event observable for all component instances
const globalEventObservable = new Observable<any>()

// Store bound handlers for cleanup
const instanceHandlers = new Map<string, Map<string, Function>>()

// Helper function to bind event handlers to specific instances
function bindEventToInstance<T extends (...args: any[]) => void>(
  instanceId: string,
  eventName: string,
  handler: T
) {
  const wrappedHandler = (el: HTMLElement, ...args: any[]) => {
    const dataId = el.dataset['ductId']
    if (dataId === instanceId) {
      handler(el, ...args)
    }
  }
  
  globalEventObservable.on(eventName, wrappedHandler)
  
  // Store for cleanup
  if (!instanceHandlers.has(instanceId)) {
    instanceHandlers.set(instanceId, new Map())
  }
  instanceHandlers.get(instanceId)!.set(eventName, wrappedHandler)
}

// Helper function to unbind all event handlers for an instance
function unbindInstanceHandlers(instanceId: string) {
  const handlers = instanceHandlers.get(instanceId)
  if (handlers) {
    handlers.forEach((handler, eventName) => {
      globalEventObservable.off(eventName, handler)
    })
    instanceHandlers.delete(instanceId)
  }
}

// Extract and process on:* props from component props
function extractEventProps<P extends Record<string, any>>(props: P) {
  const eventProps: Record<string, Function> = {}
  const regularProps: Record<string, any> = {}

  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on:')) {
      const eventName = key.slice(3) // Remove 'on:' prefix
      eventProps[eventName] = value
    } else {
      regularProps[key] = value
    }
  })

  return { eventProps, regularProps }
}

// Default logic interface with on/off methods
export interface DefaultLogic<Events extends Record<string, (...args: any[]) => void>> {
  on: <K extends keyof Events>(event: K, callback: Events[K]) => void
  off: <K extends keyof Events>(event: K, callback: Events[K]) => void
}

// Configuration for component blueprint
export interface BlueprintConfig<
  Events extends Record<string, (...args: any[]) => void>,
  Logic extends Record<string, any> = DefaultLogic<Events>
> {
  // Event names that should be automatically bound to DOM events
  domEvents?: (keyof HTMLElementEventMap)[]
  // Logic binding function - now optional
  bind?: (el: HTMLElement, eventEmitter: EventEmitter<Events>) => BindReturn<Logic>
}

// Event emitter interface provided to component logic
export interface EventEmitter<Events extends Record<string, (...args: any[]) => void>> {
  emit<K extends keyof Events>(event: K, ...args: any[]): void
  on<K extends keyof Events>(event: K, callback: Events[K]): void
  off<K extends keyof Events>(event: K, callback: Events[K]): void
}

// Create default logic with on/off methods
function createDefaultLogic<Events extends Record<string, (...args: any[]) => void>>(
  eventEmitter: EventEmitter<Events>
): DefaultLogic<Events> {
  return {
    on: eventEmitter.on.bind(eventEmitter),
    off: eventEmitter.off.bind(eventEmitter)
  }
}

export type BindReturn<Logic extends Record<string, any>> = Logic & {
  release: (el: HTMLElement) => void
}


// Create an event-aware component blueprint with automatic on:* prop parsing
export function createBlueprint<
  Props extends Record<string, any>,
  Events extends Record<string, (...args: any[]) => void>,
  Logic extends Record<string, any> = DefaultLogic<Events>
>(
  id: { id: string },
  render: (props: BaseProps<Props>) => JSX.Element,
  config: BlueprintConfig<Events, Logic>
): ((props: Props) => JSX.Element) & { getLogic: () => Promise<Logic> } {

  let componentObservable = new Observable<ComponentEvents<Logic>>()

  let onBound = new Promise<Logic>(resolve => {
    const emitter = (logic: Logic) => {
      resolve(logic)
      componentObservable.destroy()
    }
    componentObservable.on('bound', emitter)
  })

  const instanceId = `${id.id}--${instanceCounter++}`
  let logic: Logic | undefined
  let eventEmitter: EventEmitter<Events>
  let domEventHandlers: Map<string, EventListener> = new Map()

  // Create event emitter for this component instance
  eventEmitter = {
    emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>) {
      globalEventObservable.emit(event as string, [document.querySelector(`[data-duct-id="${instanceId}"]`), ...args])
    },
    on<K extends keyof Events>(event: K, callback: Events[K]) {
      bindEventToInstance(instanceId, event as string, callback)
    },
    off<K extends keyof Events>(event: K, callback: Events[K]) {
      // Find and remove the wrapped handler for this instance
      const handlers = instanceHandlers.get(instanceId)
      if (handlers) {
        const wrappedHandler = handlers.get(event as string)
        if (wrappedHandler) {
          globalEventObservable.off(event as string, wrappedHandler)
          handlers.delete(event as string)
        }
      }
    }
  }

  observeLifecycle(instanceId, {
    onInsert(el) {
      const htmlEl = el as HTMLElement

      // Bind DOM event listeners if specified
      if (config.domEvents) {
        config.domEvents.forEach(eventName => {
          const handler = (e: Event) => {
            eventEmitter.emit(eventName as keyof Events, htmlEl, e)
          }
          htmlEl.addEventListener(eventName, handler)
          domEventHandlers.set(eventName, handler)
        })
      }

      // Emit lifecycle events
      eventEmitter.emit('bind' as keyof Events, htmlEl)

      // Create component logic
      if (config.bind) {
        const customLogic = config.bind(htmlEl, eventEmitter)
        // Merge default on/off with custom logic
        logic = {
          ...createDefaultLogic(eventEmitter),
          ...customLogic
        } as Logic
      } else {
        // Use default logic with on/off methods
        // @ts-expect-error
        logic = createDefaultLogic(eventEmitter) as Logic
      }
      getDuct().register(htmlEl, logic)
      componentObservable.emit('bound', [logic])
    },
    onRemove(el) {
      const htmlEl = el as HTMLElement

      // Clean up DOM event listeners
      domEventHandlers.forEach((handler, eventName) => {
        htmlEl.removeEventListener(eventName, handler)
      })
      domEventHandlers.clear()

      // Clean up all instance event handlers from global observable
      unbindInstanceHandlers(instanceId)

      // Emit release event and cleanup
      if (logic) {
        eventEmitter.emit('release' as keyof Events, htmlEl)
        if (logic.release) {
          logic.release(htmlEl)
        }
        logic = undefined
      }

      // Clean up lifecycle handler to prevent memory leaks
      cleanupLifecycleHandler(instanceId)
    }
  })


  const component = function (props: Props): JSX.Element {
    // Extract and bind event props
    const { eventProps, regularProps } = extractEventProps(props)

    // Bind all on:* props to the instance
    Object.entries(eventProps).forEach(([eventName, handler]) => {
      // @ts-ignore
      bindEventToInstance(instanceId, eventName, handler)
    })

    // Render with processed props
    return render({
      ...regularProps,
      "data-duct-id": instanceId
    } as Props & { "data-duct-id": string })
  }

  return Object.assign(component, {
    getLogic: () => onBound
  }) as ((props: Props) => JSX.Element) & { getLogic: () => Promise<Logic> }
}
