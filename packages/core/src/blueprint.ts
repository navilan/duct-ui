import { getDuct } from "./runtime"
import { observeLifecycle } from "./lifecycle"
import { ObservableV2 as Observable } from 'lib0/observable'

export type BProps<Props> = Props & { "data-duct-id": string }

interface ComponentEvents<Logic extends Record<string, any>> {
  bound: (logic: Logic) => void
}

let instanceCounter = 0

// Global event observable for all component instances
const globalEventObservable = new Observable<any>()

// Helper function to bind event handlers to specific instances
function bindEventToInstance<T extends (...args: any[]) => void>(
  instanceId: string,
  eventName: string,
  handler: T
) {
  globalEventObservable.on(eventName, (el: HTMLElement, ...args: any[]) => {
    const dataId = el.dataset['ductId']
    if (dataId === instanceId) {
      handler(el, ...args)
    }
  })
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

// Configuration for component blueprint
export interface BlueprintConfig<
  Events extends Record<string, (...args: any[]) => void>,
  Logic extends Record<string, any>
> {
  // Event names that should be automatically bound to DOM events
  domEvents?: (keyof HTMLElementEventMap)[]
  // Custom event names that components can emit
  customEvents?: (keyof Events)[]
  // Logic binding function
  bind: (el: HTMLElement, eventEmitter: EventEmitter<Events>) => Logic
  // Cleanup function
  release: (el: HTMLElement, logic: Logic) => void
}

// Event emitter interface provided to component logic
export interface EventEmitter<Events extends Record<string, (...args: any[]) => void>> {
  emit<K extends keyof Events>(event: K, ...args: any[]): void
  on<K extends keyof Events>(event: K, callback: Events[K]): void
  off<K extends keyof Events>(event: K, callback: Events[K]): void
}

// Create an evented component with automatic on:* prop parsing
export function createBlueprint<
  Props extends Record<string, any>,
  Events extends Record<string, (...args: any[]) => void>,
  Logic extends Record<string, any>
>(
  id: { id: string },
  render: (props: Props & { "data-duct-id": string }) => JSX.Element,
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
      globalEventObservable.off(event as string, callback)
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
      logic = config.bind(htmlEl, eventEmitter)
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

      // Emit release event and cleanup
      if (logic) {
        eventEmitter.emit('release' as keyof Events, htmlEl)
        config.release(htmlEl, logic)
        logic = undefined
      }
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

// Legacy component API for backward compatibility
export function createComponent<
  Props extends Record<string, any>,
  L extends Record<string, any>
>(
  id: { id: string },
  render: (props: Props & { "data-duct-id": string }) => JSX.Element,
  bind: (el: HTMLElement) => L,
  release: (el: HTMLElement) => void
): ((props: Props) => JSX.Element) & { getLogic: () => Promise<L> } {

  return createBlueprint(id, render, {
    bind: (el, eventEmitter) => bind(el),
    release: (el, logic) => release(el)
  })
}