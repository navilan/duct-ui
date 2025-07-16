export interface DuctGlobal {
  runtime: {
    version: string
    config: {
      debug: boolean
    }
  }
  state: {
    unbound: WeakMap<Element, Record<string, any>>
    bound: WeakMap<Element, Record<string, any>>
  }
  register: (el: Element, logic: Record<string, any>) => void
  getLogic: (el: Element) => Record<string, any> | undefined
}

declare global {
  interface Window {
    Duct?: DuctGlobal
  }
}