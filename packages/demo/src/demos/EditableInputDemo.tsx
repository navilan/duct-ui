import makeEditableInput from "@duct-ui/components/input/editable"
import makeButton from "@duct-ui/components/button/button"
import makeDemoLayout from "../components/DemoLayout"

const EditableInput1 = makeEditableInput()
const EditableInput2 = makeEditableInput()
const EditableInput3 = makeEditableInput()
const EditableInput4 = makeEditableInput()
const DemoLayout = makeDemoLayout()

// Create button instances
const SetRandomTextBtn = makeButton()
const ToggleEditBtn = makeButton()
const BeginEditBtn = makeButton()
const CancelEditBtn = makeButton()
const GetStateBtn = makeButton()

// Event log state
let eventLog: string[] = []
let logContainer: HTMLElement | null = null

function addToLog(message: string) {
  eventLog.push(`${new Date().toLocaleTimeString()}: ${message}`)
  if (eventLog.length > 10) eventLog.shift() // Keep last 10 events
  updateLogDisplay()
}

function updateLogDisplay() {
  if (logContainer) {
    logContainer.innerHTML = eventLog.map(log => `<div class="text-sm text-base-content/70">${log}</div>`).join('')
  }
}

// Event handlers
const changeHandler = (el: HTMLElement, text: string) => {
  addToLog(`Text changed to: "${text}"`)
}

const bindHandler = (el: HTMLElement) => {
  addToLog(`Input component bound`)
}

// Programmatic control handlers
let input3Logic: any = null
let input4Logic: any = null

EditableInput3.getLogic().then(logic => {
  input3Logic = logic
})

EditableInput4.getLogic().then(logic => {
  input4Logic = logic
})

function setRandomText(el: HTMLElement, e: MouseEvent) {
  const randomTexts = ["Hello World", "Duct UI", "Click to Edit", "Random Text", "Test Input"]
  const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)]
  if (input3Logic) {
    input3Logic.setText(randomText)
    addToLog(`Set text programmatically to: "${randomText}"`)
  }
}

function toggleEditMode(el: HTMLElement, e: MouseEvent) {
  if (input3Logic) {
    const wasEditing = input3Logic.isEditing()
    input3Logic.toggleEdit()
    addToLog(`Toggled edit mode: ${wasEditing ? 'editing' : 'viewing'} → ${!wasEditing ? 'editing' : 'viewing'}`)
  } else {
    addToLog("⚠️ Input3 logic not ready yet - component may not be fully mounted")
  }
}

function beginEdit(el: HTMLElement, e: MouseEvent) {
  if (input4Logic) {
    input4Logic.beginEdit()
    addToLog("Started editing mode programmatically")
  }
}

function cancelEdit(el: HTMLElement, e: MouseEvent) {
  if (input4Logic) {
    input4Logic.cancelEdit()
    addToLog("Cancelled editing mode programmatically")
  }
}

function getCurrentText(el: HTMLElement, e: MouseEvent) {
  if (input4Logic) {
    const text = input4Logic.getText()
    const mode = input4Logic.getMode()
    const editing = input4Logic.isEditing()
    addToLog(`Current text: "${text}" | Mode: ${mode} | Editing: ${editing}`)
  }
}

export function EditableInputDemo() {
  // Set up log container reference
  setTimeout(() => {
    logContainer = document.getElementById('event-log')
    updateLogDisplay()
  }, 100)

  return (
    <DemoLayout
      title="Editable Input Component"
      description="Click-to-edit input with keyboard shortcuts and programmatic control"
      sourcePath="/demos/EditableInputDemo.tsx"
    >
      <div>
        <div class="space-y-8">

          {/* Basic Usage */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-medium mb-2">Simple Editable Text</h3>
                <EditableInput1
                  text="Click me to edit!"
                  labelClass="text-lg font-medium text-primary cursor-pointer hover:bg-base-200 p-2 rounded"
                  inputClass="input input-bordered text-lg"
                  on:change={changeHandler}
                  on:bind={bindHandler}
                />
                <p class="text-sm text-base-content/60 mt-1">Click the text above to start editing. Press Enter to save, Escape to cancel.</p>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-2">Styled Editable Input</h3>
                <EditableInput2
                  text="Fancy styled input"
                  labelClass="badge badge-secondary badge-lg cursor-pointer hover:badge-primary transition-colors"
                  inputClass="input input-secondary input-sm"
                  on:change={changeHandler}
                />
                <p class="text-sm text-base-content/60 mt-1">This one uses badge styling for the label and colored input.</p>
              </div>
            </div>
          </div>

          {/* Programmatic Control */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Programmatic Control</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div>
                <h3 class="text-lg font-medium mb-2">setText() & toggleEdit()</h3>
                <EditableInput3
                  text="Control me with buttons"
                  labelClass="text-base font-medium text-accent cursor-pointer hover:bg-accent/10 p-3 rounded border-2 border-accent/20"
                  inputClass="input input-accent"
                  on:change={changeHandler}
                />
                <div class="flex gap-2 mt-3">
                  <SetRandomTextBtn 
                    label="Set Random Text"
                    class="btn btn-sm btn-outline btn-accent"
                    data-editable-control="true"
                    on:click={setRandomText}
                  />
                  <ToggleEditBtn 
                    label="Toggle Edit Mode"
                    class="btn btn-sm btn-outline btn-accent"
                    data-editable-control="true"
                    on:click={toggleEditMode}
                  />
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-2">Direct Mode Control</h3>
                <EditableInput4
                  text="Direct control demo"
                  labelClass="text-base font-medium text-warning cursor-pointer hover:bg-warning/10 p-3 rounded border-2 border-warning/20"
                  inputClass="input input-warning"
                  on:change={changeHandler}
                />
                <div class="flex gap-2 mt-3">
                  <BeginEditBtn 
                    label="Begin Edit"
                    class="btn btn-sm btn-outline btn-warning"
                    data-editable-control="true"
                    on:click={beginEdit}
                  />
                  <CancelEditBtn 
                    label="Cancel Edit"
                    class="btn btn-sm btn-outline btn-warning"
                    data-editable-control="true"
                    on:click={cancelEdit}
                  />
                  <GetStateBtn 
                    label="Get State"
                    class="btn btn-sm btn-outline btn-warning"
                    data-editable-control="true"
                    on:click={getCurrentText}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div>
            <h2 class="text-2xl font-semibold mb-4">Event Log</h2>
            <div class="bg-base-200 p-4 rounded-lg">
              <div id="event-log" class="space-y-1 max-h-48 overflow-y-auto">
                <div class="text-sm text-base-content/70">Events will appear here...</div>
              </div>
            </div>
          </div>

          {/* Features Documentation */}
          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-lg font-medium mb-3">Features Demonstrated:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>Click to edit</strong> - Click any text to start editing</li>
                <li><strong>Keyboard shortcuts</strong> - Enter to save, Escape to cancel</li>
                <li><strong>Auto-cancel</strong> - Click outside or blur to cancel</li>
                <li><strong>Change events</strong> - <code>on:change</code> fired when text changes</li>
              </ul>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>setText()</strong> - Set text programmatically</li>
                <li><strong>toggleEdit()</strong> - Toggle between view/edit modes</li>
                <li><strong>beginEdit() / cancelEdit()</strong> - Direct mode control</li>
                <li><strong>getText() / isEditing()</strong> - State inspection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  )
}