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
    props: Map<string, any>
  }
  register: (el: Element, logic: Record<string, any>) => void
  saveProps: (id: string, props: any) => void
  getLogic: (el: Element) => Record<string, any> | undefined
  getProps: (id: string) => any | undefined
  clearProps: (id: string) => void
}

declare global {
  interface Window {
    Duct?: DuctGlobal
  }
}