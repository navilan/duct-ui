import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import EditableInput from "@duct-ui/components/input/editable"
import Button from "@duct-ui/components/button/button"
import Toggle from "@duct-ui/components/button/toggle"
import DemoLayout from "../components/DemoLayout"
import EventLog, { EventLogLogic } from "../components/EventLog"

export interface EditableInputDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface EditableInputDemoLogic {
  // Component logic methods if needed
}

export interface EditableInputDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

const eventLogRef = createRef<EventLogLogic>()

function addToLog(message: string) {
  if (eventLogRef.current) {
    eventLogRef.current.addEvent(message)
  }
}

// Event handlers
function changeHandler(el: HTMLElement, text: string) {
  addToLog(`Text changed to: "${text}"`)
}

function bindHandler(el: HTMLElement) {
  addToLog(`Input component bound`)
}

// Programmatic control handlers
const input3Ref = createRef<any>()
const input4Ref = createRef<any>()

function setRandomText(el: HTMLElement, e: MouseEvent) {
  const randomTexts = ["Hello World", "Duct UI", "Click to Edit", "Random Text", "Test Input"]
  const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)]
  if (input3Ref.current) {
    input3Ref.current.setText(randomText)
    addToLog(`Set text programmatically to: "${randomText}"`)
  }
}

function toggleEditMode(el: HTMLElement, state: 'on' | 'off') {
  if (input3Ref.current) {
    const wasEditing = input3Ref.current.isEditing()
    
    // Force the input to match the toggle state
    if (state === 'on' && !wasEditing) {
      input3Ref.current.beginEdit()
    } else if (state === 'off' && wasEditing) {
      input3Ref.current.cancelEdit()
    }
    
    addToLog(`Toggle set to ${state}: ${wasEditing ? 'editing' : 'viewing'} → ${state === 'on' ? 'editing' : 'viewing'}`)
  } else {
    addToLog("⚠️ Input3 logic not ready yet - component may not be fully mounted")
  }
}

function beginEdit(el: HTMLElement, e: MouseEvent) {
  if (input4Ref.current) {
    input4Ref.current.beginEdit()
    addToLog("Started editing mode programmatically")
  }
}

function cancelEdit(el: HTMLElement, e: MouseEvent) {
  if (input4Ref.current) {
    input4Ref.current.cancelEdit()
    addToLog("Cancelled editing mode programmatically")
  }
}

function getCurrentText(el: HTMLElement, e: MouseEvent) {
  if (input4Ref.current) {
    const text = input4Ref.current.getText()
    const mode = input4Ref.current.getMode()
    const editing = input4Ref.current.isEditing()
    addToLog(`Current text: "${text}" | Mode: ${mode} | Editing: ${editing}`)
  }
}

function render(props: BaseProps<EditableInputDemoProps>) {
  return (
    <div {...props}>
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
                <EditableInput
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
                <EditableInput
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
                <EditableInput
                  ref={input3Ref}
                  text="Control me with buttons"
                  labelClass="text-base font-medium text-accent cursor-pointer hover:bg-accent/10 p-3 rounded border-2 border-accent/20"
                  inputClass="input input-accent"
                  on:change={changeHandler}
                />
                <div class="flex gap-2 mt-3">
                  <Button 
                    label="Set Random Text"
                    class="btn btn-sm btn-outline btn-accent"
                    data-editable-control="true"
                    on:click={setRandomText}
                  />
                  <Toggle
                    onLabel="Editing"
                    offLabel="Viewing"
                    initialState="off"
                    onClass="btn-accent"
                    offClass="btn-outline btn-accent"
                    class="btn btn-sm"
                    on:change={toggleEditMode}
                  />
                </div>
              </div>

              <div>
                <h3 class="text-lg font-medium mb-2">Direct Mode Control</h3>
                <EditableInput
                  ref={input4Ref}
                  text="Direct control demo"
                  labelClass="text-base font-medium text-warning cursor-pointer hover:bg-warning/10 p-3 rounded border-2 border-warning/20"
                  inputClass="input input-warning"
                  on:change={changeHandler}
                />
                <div class="flex gap-2 mt-3">
                  <Button 
                    label="Begin Edit"
                    class="btn btn-sm btn-outline btn-warning"
                    data-editable-control="true"
                    on:click={beginEdit}
                  />
                  <Button 
                    label="Cancel Edit"
                    class="btn btn-sm btn-outline btn-warning"
                    data-editable-control="true"
                    on:click={cancelEdit}
                  />
                  <Button 
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
            <EventLog
              ref={eventLogRef}
              title="Event Log"
              maxHeight="max-h-48"
              data-event-log-component
            />
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
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<EditableInputDemoEvents>): BindReturn<EditableInputDemoLogic> {
  return {
    release: () => {
      // Ref cleanup is handled automatically
    }
  }
}

const id = { id: "duct-demo/editable-input-demo" }

const EditableInputDemo = createBlueprint<EditableInputDemoProps, EditableInputDemoEvents, EditableInputDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default EditableInputDemo