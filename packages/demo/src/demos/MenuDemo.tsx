import { createBlueprint, renderProps, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import Menu from "@duct-ui/components/dropdown/menu"
import MenuItem from "@duct-ui/components/dropdown/menu-item"
import MenuSeparator from "@duct-ui/components/dropdown/menu-separator"
import EditableInput from "@duct-ui/components/input/editable"
import DemoLayout from "@components/DemoLayout"
import EventLog, { EventLogLogic } from "@components/EventLog"

export interface MenuDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface MenuDemoLogic {
  // Component logic methods if needed
}

export interface MenuDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

const eventLogRef = createRef<EventLogLogic>()
const composedInputRef = createRef<any>()

function addToLog(message: string) {
  if (eventLogRef.current) {
    eventLogRef.current.addEvent(message)
  }
}

// Event handlers
function menuOpenHandler(el: HTMLElement) {
  const menuLabel = el.querySelector('[role="button"]')?.textContent || 'Unknown Menu'
  addToLog(`Menu "${menuLabel}" opened`)
}

function menuCloseHandler(el: HTMLElement) {
  const menuLabel = el.querySelector('[role="button"]')?.textContent || 'Unknown Menu'
  addToLog(`Menu "${menuLabel}" closed`)
}

function itemClickHandler(el: HTMLElement, e: MouseEvent) {
  const itemLabel = el.textContent?.trim() || 'Unknown Item'
  addToLog(`MenuItem "${itemLabel}" clicked`)
}

function changeHandler(el: HTMLElement, txt: string) {
  addToLog(`Text "${txt}" changed`)
}

function editMenuItemHandler(el: HTMLElement, e: MouseEvent) {
  if (composedInputRef.current) {
    composedInputRef.current.beginEdit()
    addToLog(`Menu triggered editable input to enter edit mode`)
  } else {
    addToLog(`⚠️ Editable input logic not ready yet`)
  }
}


function render(props: BaseProps<MenuDemoProps>) {
  return (
    <div {...renderProps(props)}>
      <DemoLayout
        title="Menu & MenuItem Components"
        description="Dropdown menus with customizable placement, icons, and action-oriented behavior"
        sourcePath="/demos/MenuDemo.tsx"
      >
      <div>
        <div class="space-y-8">

          {/* Basic Usage */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
            <div class="flex gap-4 flex-wrap">
              <Menu
                label="Simple Menu"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <MenuItem label="First Item" on:click={itemClickHandler} />
                <MenuItem label="Second Item" on:click={itemClickHandler} />
                <MenuItem label="Third Item" on:click={itemClickHandler} />
              </Menu>

              <Menu
                label="Styled Menu"
                buttonClass="btn btn-secondary"
                menuClass="menu bg-secondary/98 rounded-box z-[1] w-52 p-2 shadow border border-primary/20"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <MenuItem label="Profile" icon="👤" on:click={itemClickHandler} />
                <MenuItem label="Settings" icon="⚙️" on:click={itemClickHandler} />
                <MenuSeparator />
                <MenuItem label="Logout" icon="🚪" on:click={itemClickHandler} />
              </Menu>
            </div>
            <p class="text-sm text-base-content/60 mt-2">
              Click the buttons to see dropdown menus. Items automatically close the menu when clicked.
            </p>
          </div>

          {/* Placement Options */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Placement Options</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Menu
                label="Bottom Start"
                buttonClass="btn btn-outline btn-accent"
                placement="bottom-start"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <MenuItem label="Item 1" on:click={itemClickHandler} />
                <MenuItem label="Item 2" on:click={itemClickHandler} />
              </Menu>

              <Menu
                label="Top Start"
                buttonClass="btn btn-outline btn-secondary"
                placement="top-start"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <MenuItem label="Item 1" on:click={itemClickHandler} />
                <MenuItem label="Item 2" on:click={itemClickHandler} />
                <MenuItem label="Disabled Item" class="text-base-content/40" disabled={true} on:click={itemClickHandler} />
              </Menu>

              <Menu
                label="Disabled Menu"
                buttonClass="btn btn-outline"
                disabled={true}
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <MenuItem label="Won't show" on:click={itemClickHandler} />
              </Menu>
            </div>
            <p class="text-sm text-base-content/60 mt-2">
              Menus support different placement options and can be disabled.
            </p>
          </div>

          {/* Component Composition */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Component Composition</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-medium mb-2">Editable Input + Menu Integration</h3>
                <p class="text-sm text-base-content/60 mb-4">
                  This demonstrates how components can communicate with each other. The menu's "Edit" action triggers the editable input to enter edit mode.
                </p>

                <div class="flex items-center gap-2 p-4 bg-base-200 rounded-lg">
                  <EditableInput
                    ref={composedInputRef}
                    text="Click menu to edit me"
                    labelClass="text-lg font-medium text-primary cursor-pointer hover:bg-base-200 px-3 py-2 rounded border border-base-300"
                    inputClass="input input-bordered text-lg"
                    on:change={changeHandler}
                  />

                  <Menu
                    label="⋮"
                    buttonClass="btn btn-sm btn-ghost"
                    menuClass="menu bg-base-200 rounded-box z-[1] w-32 p-2 shadow border border-base-300"
                    placement="bottom-end"
                    on:open={menuOpenHandler}
                    on:close={menuCloseHandler}
                  >
                    <MenuItem
                      label="Edit"
                      icon="✏️"
                      on:click={editMenuItemHandler}
                    />
                  </Menu>
                </div>

                <p class="text-sm text-base-content/60 mt-2">
                  Try clicking the menu button (⋮) and selecting "Edit" - it will programmatically put the editable input into edit mode.
                </p>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Event Log</h2>
            <EventLog
              ref={eventLogRef}
              title="Menu Events"
              maxHeight="max-h-64"
              data-event-log-component
            />
          </div>

          {/* Features Documentation */}
          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-lg font-medium mb-3">Menu Features:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>Placement Options</strong> - 6 different dropdown positions</li>
                <li><strong>Icon Support</strong> - String (emoji) and imported SVG icons</li>
                <li><strong>Auto-close</strong> - Menus close when items are clicked or when clicking outside</li>
                <li><strong>Keyboard Support</strong> - Escape key closes menus</li>
              </ul>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>Action-oriented</strong> - Designed for commands, not selection</li>
                <li><strong>Event Handling</strong> - <code>on:open</code>, <code>on:close</code>, <code>on:click</code></li>
                <li><strong>Disabled State</strong> - Both menus and individual items can be disabled</li>
                <li><strong>Separators</strong> - Visual grouping with MenuSeparator component</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<MenuDemoEvents>): BindReturn<MenuDemoLogic> {
  return {
    release: () => {
      // Ref cleanup is handled automatically
    }
  }
}

const id = { id: "duct-demo/menu-demo" }

const MenuDemo = createBlueprint<MenuDemoProps, MenuDemoEvents, MenuDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default MenuDemo