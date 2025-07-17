import makeSelect from "@duct-ui/components/select/select"
import makeDemoLayout from "../components/DemoLayout"
import iconOne from "../icons/one.svg"
import iconTwo from "../icons/two.svg"
import iconThree from "../icons/three.svg"
import type { SelectItem } from "@duct-ui/components/select/select"

let eventLog: string[] = []

const updateEventLog = () => {
  const logElement = document.getElementById('event-log')
  if (logElement) {
    logElement.innerHTML = eventLog.length === 0
      ? '<p class="text-sm text-base-content/50">No events yet...</p>'
      : eventLog.map(event => `<p class="text-sm font-mono">${event}</p>`).join('')
  }
}

const selectionHandler = (_el: HTMLElement, item: SelectItem, index: number) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.push(`[${timestamp}] Selected: "${item.label}" (index: ${index})`)
  updateEventLog()
  console.log('Selection changed:', item, index)
}

const openHandler = (_el: HTMLElement) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.push(`[${timestamp}] Select opened`)
  updateEventLog()
}

const closeHandler = (_el: HTMLElement) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.push(`[${timestamp}] Select closed`)
  updateEventLog()
}

const Select1 = makeSelect()
const Select2 = makeSelect()
const Select3 = makeSelect()
const DemoLayout = makeDemoLayout()

export function SelectDemo() {
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
    <DemoLayout
      title="Select Component"
      description="Dropdown select component with selection markers and flexible item properties"
    >
      <div>
        <h2 class="text-2xl font-semibold mb-4">Select Examples</h2>

        <div class="space-y-8">
          <div>
            <h3 class="text-lg font-medium mb-3">Basic Select</h3>
            <div class="max-w-sm">
              <Select1
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
              <Select2
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
              <Select3
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
          <div class="p-4 bg-base-200 rounded-lg">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-medium">Event Log</h3>
              <button
                class="btn btn-sm btn-outline"
                onclick="document.getElementById('event-log').parentElement.querySelector('button').previousElementSibling.innerHTML = '<p class=&quot;text-sm text-base-content/50&quot;>No events yet...</p>'; eventLog = []"
              >
                Clear
              </button>
            </div>
            <div id="event-log" class="max-h-32 overflow-y-auto space-y-1 text-sm">
              <p class="text-sm text-base-content/50">No events yet...</p>
            </div>
          </div>

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
  )
}