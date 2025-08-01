export type LogicFactory<L extends Record<string, any>> = (el: HTMLElement) => L

export interface DuctComponentId {
  readonly id: string
}


export type Component<
  Props extends Record<string, any>,
  L extends Record<string, any>
> = ((props: Props) => JSX.Element) & L


// Event emitter interface provided to component logic
export interface EventEmitter<Events extends Record<string, (...args: any[]) => void>> {
  emit<K extends keyof Events>(event: K, ...args: any[]): void
  on<K extends keyof Events>(event: K, callback: Events[K]): void
  off<K extends keyof Events>(event: K, callback: Events[K]): void
}