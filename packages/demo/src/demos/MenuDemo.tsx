import makeMenu from "@duct-ui/components/menu/menu"
import makeMenuItem from "@duct-ui/components/menu/menu-item"
import makeMenuSeparator from "@duct-ui/components/menu/menu-separator"
import makeEditableInput from "@duct-ui/components/input/editable"
import makeDemoLayout from "../components/DemoLayout"

const Menu1 = makeMenu()
const Menu2 = makeMenu()
const Menu3 = makeMenu()
const Menu4 = makeMenu()
const Menu5 = makeMenu()
const Menu6 = makeMenu()

const DemoLayout = makeDemoLayout()

// Menu items for different demos
const BasicItem1 = makeMenuItem()
const BasicItem2 = makeMenuItem()
const BasicItem3 = makeMenuItem()

const IconItem1 = makeMenuItem()
const IconItem2 = makeMenuItem()
const IconItem3 = makeMenuItem()
const IconSeparator1 = makeMenuSeparator()

const PlacementItem1 = makeMenuItem()
const PlacementItem2 = makeMenuItem()

const StateItem1 = makeMenuItem()
const StateItem2 = makeMenuItem()
const StateItem3 = makeMenuItem()

// Component composition demo
const ComposedEditableInput = makeEditableInput()
const ComposedMenu = makeMenu()
const ComposedEditMenuItem = makeMenuItem()

// Event log state
let eventLog: string[] = []
let logContainer: HTMLElement | null = null

function addToLog(message: string) {
  eventLog.push(`${new Date().toLocaleTimeString()}: ${message}`)
  if (eventLog.length > 15) eventLog.shift() // Keep last 15 events
  updateLogDisplay()
}

function updateLogDisplay() {
  if (logContainer) {
    logContainer.innerHTML = eventLog.map(log => `<div class="text-sm text-base-content/70">${log}</div>`).join('')
  }
}

// Event handlers
const menuOpenHandler = (el: HTMLElement) => {
  const menuLabel = el.querySelector('[role="button"]')?.textContent || 'Unknown Menu'
  addToLog(`Menu "${menuLabel}" opened`)
}

const menuCloseHandler = (el: HTMLElement) => {
  const menuLabel = el.querySelector('[role="button"]')?.textContent || 'Unknown Menu'
  addToLog(`Menu "${menuLabel}" closed`)
}

const itemClickHandler = (el: HTMLElement, e: MouseEvent) => {
  const itemLabel = el.textContent?.trim() || 'Unknown Item'
  addToLog(`MenuItem "${itemLabel}" clicked`)
}

const changeHandler = (el: HTMLElement, txt: string) => {
  addToLog(`Text "${txt}" changed`)
}

// Component composition handlers
let composedInputLogic: any = null

ComposedEditableInput.getLogic().then(logic => {
  composedInputLogic = logic
})

const editMenuItemHandler = (el: HTMLElement, e: MouseEvent) => {
  if (composedInputLogic) {
    composedInputLogic.beginEdit()
    addToLog(`Menu triggered editable input to enter edit mode`)
  } else {
    addToLog(`⚠️ Editable input logic not ready yet`)
  }
}


export function MenuDemo() {
  // Set up log container reference
  setTimeout(() => {
    logContainer = document.getElementById('menu-event-log')
    updateLogDisplay()
  }, 100)

  return (
    <DemoLayout
      title="Menu & MenuItem Components"
      description="Dropdown menus with customizable placement, icons, and action-oriented behavior"
    >
      <div>
        <div class="space-y-8">

          {/* Basic Usage */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
            <div class="flex gap-4 flex-wrap">
              <Menu1
                label="Simple Menu"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <BasicItem1 label="First Item" on:click={itemClickHandler} />
                <BasicItem2 label="Second Item" on:click={itemClickHandler} />
                <BasicItem3 label="Third Item" on:click={itemClickHandler} />
              </Menu1>

              <Menu2
                label="Styled Menu"
                buttonClass="btn btn-secondary"
                menuClass="menu bg-secondary/98 rounded-box z-[1] w-52 p-2 shadow border border-primary/20"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <IconItem1 label="Profile" icon="👤" on:click={itemClickHandler} />
                <IconItem2 label="Settings" icon="⚙️" on:click={itemClickHandler} />
                <IconSeparator1 />
                <IconItem3 label="Logout" icon="🚪" on:click={itemClickHandler} />
              </Menu2>
            </div>
            <p class="text-sm text-base-content/60 mt-2">
              Click the buttons to see dropdown menus. Items automatically close the menu when clicked.
            </p>
          </div>

          {/* Placement Options */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Placement Options</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Menu3
                label="Bottom Start"
                buttonClass="btn btn-outline btn-accent"
                placement="bottom-start"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <PlacementItem1 label="Item 1" on:click={itemClickHandler} />
                <PlacementItem2 label="Item 2" on:click={itemClickHandler} />
              </Menu3>

              <Menu4
                label="Top End"
                buttonClass="btn btn-outline btn-secondary"
                placement="top-end"
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <StateItem1 label="Item 1" on:click={itemClickHandler} />
                <StateItem2 label="Item 2" on:click={itemClickHandler} />
                <StateItem3 label="Disabled Item" class="text-gray-400" disabled={true} on:click={itemClickHandler} />
              </Menu4>

              <Menu5
                label="Disabled Menu"
                buttonClass="btn btn-outline"
                disabled={true}
                on:open={menuOpenHandler}
                on:close={menuCloseHandler}
              >
                <StateItem1 label="Won't show" on:click={itemClickHandler} />
              </Menu5>
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
                  <ComposedEditableInput
                    text="Click menu to edit me"
                    labelClass="text-lg font-medium text-primary cursor-pointer hover:bg-base-200 px-3 py-2 rounded border border-base-300"
                    inputClass="input input-bordered text-lg"
                    on:change={changeHandler}
                  />

                  <ComposedMenu
                    label="⋮"
                    buttonClass="btn btn-sm btn-ghost"
                    menuClass="menu bg-base-200 rounded-box z-[1] w-32 p-2 shadow border border-base-300"
                    placement="bottom-end"
                    on:open={menuOpenHandler}
                    on:close={menuCloseHandler}
                  >
                    <ComposedEditMenuItem
                      label="Edit"
                      icon="✏️"
                      on:click={editMenuItemHandler}
                    />
                  </ComposedMenu>
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
            <div class="bg-base-200 p-4 rounded-lg">
              <div id="menu-event-log" class="space-y-1 max-h-64 overflow-y-auto">
                <div class="text-sm text-base-content/70">Menu events will appear here...</div>
              </div>
            </div>
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
  )
}