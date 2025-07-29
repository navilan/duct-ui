import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import Select from "@duct-ui/components/dropdown/select"
import DemoLayout from "../components/DemoLayout"
import EventLog, { EventLogLogic } from "../components/EventLog"
import iconOne from "../icons/one.svg"
import iconTwo from "../icons/two.svg"
import iconThree from "../icons/three.svg"
import type { SelectItem } from "@duct-ui/components/dropdown/select"

export interface SelectDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface SelectDemoLogic {
  // Component logic methods if needed
}

export interface SelectDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

const eventLogRef = createRef<EventLogLogic>()

function addToLog(message: string) {
  if (eventLogRef.current) {
    eventLogRef.current.addEvent(message)
  }
}

function selectionHandler(_el: HTMLElement, item: SelectItem, index: number) {
  addToLog(`Selected: "${item.label}" (index: ${index})`)
}

function openHandler(_el: HTMLElement) {
  addToLog(`Select opened`)
}

function closeHandler(_el: HTMLElement) {
  addToLog(`Select closed`)
}

function render(props: BaseProps<SelectDemoProps>) {
  const basicItems: SelectItem[] = [
    { label: "Option 1", isSelected: true },
    { label: "Option 2" },
    { label: "Option 3" },
    { label: "Disabled Option", isDisabled: true }
  ]

  const iconItems: SelectItem[] = [
    { label: "First", icon: { src: iconOne }, description: "First option with icon" },
    { label: "Second", icon: { src: iconTwo }, description: "Second option with icon", isSelected: true },
    { label: "Third", icon: { src: iconThree }, description: "Third option with icon" }
  ]

  const complexItems: SelectItem[] = [
    {
      label: "Priority High",
      icon: "🔴",
      description: "High priority items",
      attributes: { "data-priority": "high" }
    },
    {
      label: "Priority Medium",
      icon: "🟡",
      description: "Medium priority items",
      attributes: { "data-priority": "medium" }
    },
    {
      label: "Priority Low",
      icon: "🟢",
      description: "Low priority items",
      attributes: { "data-priority": "low" }
    },
    {
      label: "Disabled Priority",
      icon: "⚫",
      description: "This option is disabled",
      isDisabled: true,
      attributes: { "data-priority": "disabled" }
    }
  ]

  return (
    <div {...props}>
      <DemoLayout
        title="Select Component"
        description="Dropdown select component with selection markers and flexible item properties"
        sourcePath="/demos/SelectDemo.tsx"
      >
        <div>
          <h2 class="text-2xl font-semibold mb-4">Select Examples</h2>

          <div class="space-y-8">
            <div>
              <h3 class="text-lg font-medium mb-3">Basic Select</h3>
              <div class="max-w-sm">
                <Select
                  items={basicItems}
                  placeholder="Choose an option"
                  class="w-full dropdown relative"
                  buttonClass="btn btn-outline w-full justify-between"
                  menuClass="menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
                  itemClass=""
                  labelClass="font-medium"
                  descriptionClass="text-sm text-base-content/70"
                  selectedIconClass="w-4 h-4 mr-2"
                  iconClass="mr-2"
                  on:selectionChange={selectionHandler}
                  on:open={openHandler}
                  on:close={closeHandler}
                />
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-3">Select with Icons and Descriptions</h3>
              <div class="max-w-sm">
                <Select
                  items={iconItems}
                  selectedIcon="✅"
                  placeholder="Choose with icon"
                  class="w-full dropdown relative"
                  buttonClass="btn btn-primary w-full justify-between"
                  menuClass="menu bg-base-200 rounded-box z-[1] p-2 shadow"
                  itemClass=""
                  labelClass="font-medium"
                  descriptionClass="text-sm text-base-content/70"
                  selectedIconClass="w-4 h-4 mr-2"
                  iconClass="mr-2"
                  on:selectionChange={selectionHandler}
                  on:open={openHandler}
                  on:close={closeHandler}
                />
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium mb-3">Complex Select with Attributes</h3>
              <div class="max-w-sm">
                <Select
                  items={complexItems}
                  selectedIcon="👆"
                  placeholder="Choose priority"
                  class="w-full dropdown dropdown-top relative"
                  buttonClass="btn btn-secondary w-full justify-between"
                  menuClass="menu bg-base-200 rounded-box z-[1] p-2 shadow"
                  itemClass=""
                  labelClass="font-medium"
                  descriptionClass="text-sm text-base-content/70"
                  selectedIconClass="w-4 h-4 mr-2"
                  iconClass="mr-2 w-6 h-6"
                  iconSize='lg'
                  placement="top-start"
                  on:selectionChange={selectionHandler}
                  on:open={openHandler}
                  on:close={closeHandler}
                />
              </div>
            </div>
          </div>

          <div class="mt-8 space-y-6">
            <EventLog
              ref={eventLogRef}
              title="Event Log"
              maxHeight="max-h-32"
              data-event-log-component
            />

            <div class="p-4 bg-base-200 rounded-lg">
              <h3 class="text-lg font-medium mb-2">Features Demonstrated:</h3>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li>Select component with customizable selection markers</li>
                <li>Support for icons, descriptions, and custom attributes</li>
                <li>Disabled items with visual feedback</li>
                <li>Selection change events with item and index data</li>
                <li>Flexible placement options (top, bottom, start, end)</li>
                <li>Keyboard navigation and accessibility</li>
                <li>Custom styling through buttonClass and menuClass</li>
              </ul>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<SelectDemoEvents>): BindReturn<SelectDemoLogic> {
  return {
    release: () => {
      // Ref cleanup is handled automatically
    }
  }
}

const id = { id: "duct-demo/select-demo" }

const SelectDemo = createBlueprint<SelectDemoProps, SelectDemoEvents, SelectDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default SelectDemo