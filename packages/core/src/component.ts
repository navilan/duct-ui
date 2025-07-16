import { getDuct } from "./runtime"
import { observeLifecycle } from "./lifecycle"
import { ObservableV2 as Observable } from 'lib0/observable'

interface ComponentEvents {
  bound: (logic: Record<string, any>) => void
}
let instanceCounter = 0


export function createComponent<
  Props extends Record<string, any>,
  L extends Record<string, any>,
>(
  id: { id: string },
  render: (props: Props & { "data-duct-id": string }) => JSX.Element,
  bind: (el: HTMLElement) => L,
  release: (el: HTMLElement) => void
): ((props: Props) => JSX.Element) & { getLogic: () => Promise<L> } {

  let observable = new Observable<ComponentEvents>()

  let onBound = new Promise(resolve => {
    const emitter = (logic: Record<string, any>) => {
      resolve(logic)
      observable.destroy()
    }
    observable.on('bound', emitter)
  })


  const instanceId = `${id.id}--${instanceCounter++}`

  let logic: L | undefined

  observeLifecycle(instanceId, {
    onInsert(el) {
      logic = bind(el as HTMLElement)
      getDuct().register(el, logic)
      observable.emit('bound', [logic])
    },
    onRemove(el) {
      console.debug("Releasing component")
      release(el as HTMLElement)
      logic = undefined
    }
  })

  const component = function (props: Props): JSX.Element {
    return render({
      ...props,
      "data-duct-id": instanceId
    })
  }

  const result = Object.assign(component, {
    getLogic: () => (onBound as Promise<L>)
  }) as ((props: Props) => JSX.Element) & { getLogic: () => Promise<L> }

  return result
}