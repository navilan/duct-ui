import { createComponent } from "@duct-ui/core/component"
import  { ObservableV2 as Observable } from "lib0/observable"


export type MouseConsumer = (el: HTMLElement, e: MouseEvent) => void
export type LifeCycleConsumer = (el: HTMLElement) => void

export interface ButtonEvents {
  bind: LifeCycleConsumer
  click: MouseConsumer
  dblclick: MouseConsumer
  release: LifeCycleConsumer
}

export type ButtonEventType = keyof ButtonEvents

export type ButtonProps = {
  label: string
  'on:click'?: MouseConsumer
  'on:dblclick'?: MouseConsumer
  'on:bind'?: LifeCycleConsumer
  'on:release'?: LifeCycleConsumer
} & Record<string, any>

export type ButtonLogic = {
  on: <K extends ButtonEventType>(event: K, callback: ButtonEvents[K]) => void
  off: <K extends ButtonEventType>(event: K, callback: ButtonEvents[K]) => void
}


const observable = new Observable<ButtonEvents>()

function idCheckWrapper(id: string, event: ButtonEventType, consumer: (el: HTMLElement, ...args: any[]) => void) {
  observable.on(event, (el: HTMLElement, ...args: any[]) => {
    const dataId = el.dataset['ductId']
    if (dataId === id) {
      consumer(el, ...args)
    }
  })
}

function render(props: ButtonProps & { "data-duct-id": string }) {
  const {
    label,
    'data-duct-id': id,
    'on:click': _clickConsumer,
    'on:dblclick': _dblclickConsumer,
    'on:bind': _bindConsumer,
    'on:release': _releaseConsumer,
    ...args
  } = props
  let moreProps: Record<string, string> = args

  if (_clickConsumer) {
    idCheckWrapper(id, 'click', _clickConsumer)
  }

  if (_dblclickConsumer) {
    idCheckWrapper(id, 'dblclick', _dblclickConsumer)
  }

  if (_bindConsumer) {
    idCheckWrapper(id, 'bind', _bindConsumer)
  }

  if (_releaseConsumer) {
    idCheckWrapper(id, 'release', _releaseConsumer)
  }

  return <button
      data-duct-id={id}
      {...moreProps}
    >
      {label}
    </button>
}

type ClickHandler = (e: MouseEvent) => void

let clickHandler: ClickHandler | undefined
let dblClickHandler: ClickHandler | undefined

function bind(el: HTMLElement): ButtonLogic {
  clickHandler = (e: MouseEvent) => {
    observable.emit('click', [el, e])
  }

  dblClickHandler = (e: MouseEvent) => {
    observable.emit('dblclick', [el, e])
  }

  el.addEventListener("click", clickHandler)
  el.addEventListener("dblclick", dblClickHandler)

  observable.emit('bind', [el])

  return {
    on<K extends ButtonEventType>(event: K, callback: ButtonEvents[K]) {
      observable.on(event, callback)
    },
    off<K extends ButtonEventType>(event: K, callback: ButtonEvents[K]) {
      observable.off(event, callback)
    },
  }
}

function release(el: HTMLElement) {
  if (clickHandler) {
    el.removeEventListener("click", clickHandler)
  }
  if (dblClickHandler) {
    el.removeEventListener("dblclick", dblClickHandler)
  }
  observable.emit('release', [el])
  observable.destroy()
}
// Define a unique ID for this component
const id = { id: "duct/button" }

// Create the final component
export const makeButton = () => {
  return createComponent(id, (props: ButtonProps & { 'data-duct-id': string }) => {
    const html = render(props)
    return html
  }, bind, release)
}