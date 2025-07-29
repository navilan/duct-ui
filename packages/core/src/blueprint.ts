import { getDuct } from "./runtime"
import { observeLifecycle, cleanupLifecycleHandler } from "./lifecycle"
import { ObservableV2 as Observable } from 'lib0/observable'
import { MutableRef } from "./ref"
import { EventEmitter } from "./shared"

export type BaseProps<Props> = Props & { "data-duct-id": string }

// Base events that all components have
export interface BaseComponentEvents extends Record<string, any> {
  bind: (el: HTMLElement) => void
  release: (el: HTMLElement) => void
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
  Logic extends Record<string, any> = DefaultLogic<Events>,
  LoadData = any
> {
  // Event names that should be automatically bound to DOM events
  domEvents?: (keyof HTMLElementEventMap)[]
  // Async load function - called after render but before bind
  load?: (el: HTMLElement, props: any) => Promise<LoadData>
  // Logic binding function - now optional, receives load data as fourth parameter
  bind?: (el: HTMLElement, eventEmitter: EventEmitter<Events>, props: any, loadData?: LoadData) => BindReturn<Logic>
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

export type ComponentProps<Props extends Record<string, any>> = Props & {
  ref?: MutableRef<any>
}

// Create an event-aware component blueprint with automatic on:* prop parsing
export function createBlueprint<
  Props extends Record<string, any>,
  Events extends Record<string, (...args: any[]) => void>,
  Logic extends Record<string, any> = DefaultLogic<Events>,
  LoadData = any
>(
  id: { id: string },
  render: (props: BaseProps<Props>) => JSX.Element,
  config: BlueprintConfig<Events, Logic, LoadData>
): (props: ComponentProps<Props>) => JSX.Element {

  // Store instance data for each rendered component
  const instances = new Map<string, {
    logic?: Logic
    eventEmitter: EventEmitter<Events>
    domEventHandlers: Map<string, EventListener>
  }>()

  // Helper to create event emitter for a specific instance
  function createInstanceEventEmitter(instanceId: string): EventEmitter<Events> {
    return {
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
  }


  const component = function (props: Props): JSX.Element {
    // Generate unique instance ID during render
    const instanceId = `${id.id}--${instanceCounter++}`

    // Extract and bind event props
    const { eventProps, regularProps } = extractEventProps(props)

    // Create instance data if not exists
    if (!instances.has(instanceId)) {
      const eventEmitter = createInstanceEventEmitter(instanceId)

      instances.set(instanceId, {
        eventEmitter,
        domEventHandlers: new Map()
      })

      // Register lifecycle callbacks for this specific instance
      observeLifecycle(instanceId, {
        async onInsert(el) {
          const htmlEl = el as HTMLElement
          const instance = instances.get(instanceId)!
          const { eventEmitter, domEventHandlers } = instance

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

          // Call async load if provided
          let loadData: LoadData | undefined
          if (config.load) {
            loadData = await config.load(htmlEl, getDuct()?.getProps(instanceId))
          }

          // Emit lifecycle events
          eventEmitter.emit('bind' as keyof Events, htmlEl)

          // Create component logic
          let logic: Logic
          if (config.bind) {
            const customLogic = config.bind(htmlEl, eventEmitter, getDuct()?.getProps(instanceId), loadData)
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
          instance.logic = logic
          getDuct().register(htmlEl, logic)

          // Check if props contain a ref and set it
          const props = getDuct()?.getProps(instanceId)
          if (props?.ref && props.ref instanceof MutableRef) {
            props.ref.current = logic
          }

          // No longer emit 'bound' event - refs handle logic access now
        },
        onRemove(el) {
          const htmlEl = el as HTMLElement
          const instance = instances.get(instanceId)
          if (!instance) return

          const { eventEmitter, domEventHandlers, logic } = instance

          // Clean up DOM event listeners
          domEventHandlers.forEach((handler, eventName) => {
            htmlEl.removeEventListener(eventName, handler)
          })
          domEventHandlers.clear()

          // Clean up all instance event handlers from global observable
          unbindInstanceHandlers(instanceId)

          // Clean up ref if it exists
          const props = getDuct()?.getProps(instanceId)
          if (props?.ref && props.ref instanceof MutableRef) {
            props.ref.current = null
            props.ref.destroy()
          }

          // Emit release event and cleanup
          if (logic) {
            eventEmitter.emit('release' as keyof Events, htmlEl)
            if (logic.release) {
              logic.release(htmlEl)
            }
          }

          // Clean up instance data
          instances.delete(instanceId)
          getDuct()?.clearProps(instanceId)
          // Clean up lifecycle handler to prevent memory leaks
          cleanupLifecycleHandler(instanceId)
        }
      })
    }

    // Bind all on:* props to the instance
    Object.entries(eventProps).forEach(([eventName, handler]) => {
      // @ts-ignore
      bindEventToInstance(instanceId, eventName, handler)
    })

    const fullProps = {
      ...regularProps,
      "data-duct-id": instanceId
    } as BaseProps<Props>

    getDuct()?.saveProps(instanceId, fullProps)

    // Render with processed props
    return render(fullProps)
  }

  return component
}
