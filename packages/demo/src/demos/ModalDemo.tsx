import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeModal, { ModalLogic, type ModalContentPosition } from "@duct-ui/components/layout/modal"
import makeButton from "@duct-ui/components/button/button"
import makeToggle from "@duct-ui/components/button/toggle"
import makeEditable from "@duct-ui/components/input/editable"
import makeDemoLayout from "../components/DemoLayout"
import makeEventLog, { EventLogLogic } from "../components/EventLog"

export interface ModalDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface ModalDemoLogic {
  // Component logic methods if needed
}

export interface ModalDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

let eventLogComponent: EventLogLogic | undefined

function addToLog(message: string) {
  if (eventLogComponent) {
    eventLogComponent.addEvent(message)
  }
}

// Modal event handlers
function handleSimpleModalOpen(_el: HTMLElement) {
  addToLog('Simple modal opened')
}

function handleSimpleModalClose(_el: HTMLElement) {
  addToLog('Simple modal closed')
}

function handleFormModalOpen(_el: HTMLElement) {
  addToLog('Form modal opened')
}

function handleFormModalClose(_el: HTMLElement) {
  addToLog('Form modal closed')
}

function handleConfirmModalOpen(_el: HTMLElement) {
  addToLog('Confirmation modal opened')
}

function handleConfirmModalClose(_el: HTMLElement) {
  addToLog('Confirmation modal closed')
}

function handleLargeModalOpen(_el: HTMLElement) {
  addToLog('Large modal opened')
}

function handleLargeModalClose(_el: HTMLElement) {
  addToLog('Large modal closed')
}

function handleTopLeftModalOpen(_el: HTMLElement) {
  addToLog('Top left modal opened')
}

function handleTopLeftModalClose(_el: HTMLElement) {
  addToLog('Top left modal closed')
}

function handleMidCenterModalOpen(_el: HTMLElement) {
  addToLog('Mid center modal opened')
}

function handleMidCenterModalClose(_el: HTMLElement) {
  addToLog('Mid center modal closed')
}

function handleBottomRightModalOpen(_el: HTMLElement) {
  addToLog('Bottom right modal opened')
}

function handleBottomRightModalClose(_el: HTMLElement) {
  addToLog('Bottom right modal closed')
}

function handleOverlayClick(_el: HTMLElement) {
  addToLog('Modal overlay clicked')
}

// Modal content components
function createSimpleModalContent() {
  const CloseBtn = makeButton()

  return (
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Simple Modal</h3>
        <button
          class="btn btn-sm btn-circle btn-ghost"
          data-modal-close
        >
          ✕
        </button>
      </div>

      <div class="mb-6">
        <p class="text-base-content/70">
          This is a simple modal window with basic content. It demonstrates the default styling and behavior.
        </p>
      </div>

      <div class="flex justify-end gap-2">
        <CloseBtn
          label="Close"
          class="btn btn-primary"
          data-modal-close
        />
      </div>
    </div>
  )
}

function createFormModalContent() {
  const SaveBtn = makeButton()
  const CancelBtn = makeButton()
  const NameInput = makeEditable()
  const EmailInput = makeEditable()
  const NotifyToggle = makeToggle()

  return (
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">User Settings</h3>
        <button
          class="btn btn-sm btn-circle btn-ghost"
          data-modal-close
        >
          ✕
        </button>
      </div>

      <form class="space-y-4 mb-6">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Full Name</span>
          </label>
          <NameInput
            text="John Doe"
            placeholder="Enter your name"
            labelClass="name-label"
            inputClass="name-input"
            class="input input-bordered w-full"
            on:change={(el, value) => addToLog(`Name changed to: ${value}`)}
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Email Address</span>
          </label>
          <EmailInput
            text="john@example.com"
            placeholder="Enter your email"
            class="input input-bordered w-full"
            labelClass="email-label"
            inputClass="email-input"
            on:change={(el, value) => addToLog(`Email changed to: ${value}`)}
          />
        </div>

        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Email Notifications</span>
            <NotifyToggle
              onLabel="On"
              offLabel="Off"
              initialState="on"
              onClass="btn-success"
              offClass="btn-outline"
              class="btn btn-sm"
              on:change={(el, state) => addToLog(`Notifications ${state}`)}
            />
          </label>
        </div>
      </form>

      <div class="flex justify-end gap-2">
        <CancelBtn
          label="Cancel"
          class="btn btn-outline"
          data-modal-close
        />
        <SaveBtn
          label="Save Changes"
          class="btn btn-primary"
          on:click={() => addToLog('Form saved successfully')}
        />
      </div>
    </div>
  )
}

function createConfirmModalContent() {
  const ConfirmBtn = makeButton()
  const CancelBtn = makeButton()

  return (
    <div class="p-6">
      <div class="flex items-center mb-4">
        <div class="text-warning text-2xl mr-3">⚠️</div>
        <h3 class="text-lg font-semibold">Confirm Action</h3>
      </div>

      <div class="mb-6">
        <p class="text-base-content/70">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
      </div>

      <div class="flex justify-end gap-2">
        <CancelBtn
          label="Cancel"
          class="btn btn-outline"
          data-modal-close
        />
        <ConfirmBtn
          label="Delete"
          class="btn btn-error"
          on:click={() => {
            addToLog('Item deleted')
            // Modal will be closed by the demo logic
          }}
          data-modal-close
        />
      </div>
    </div>
  )
}

function createLargeModalContent() {
  const CloseBtn = makeButton()

  return (
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Large Modal with Scrollable Content</h3>
        <button
          class="btn btn-sm btn-circle btn-ghost"
          data-modal-close
        >
          ✕
        </button>
      </div>

      <div class="mb-6 space-y-4">
        <p class="text-base-content/70">
          This is a large modal that demonstrates scrollable content when the content exceeds the modal height.
        </p>

        {Array.from({ length: 20 }, (_, i) => (
          <div data-key={i} class="card bg-base-200">
            <div class="card-body p-4">
              <h4 class="card-title text-sm">Content Block {i + 1}</h4>
              <p class="text-sm text-base-content/60">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div class="flex justify-end gap-2 sticky bottom-0 bg-white pt-4 border-t">
        <CloseBtn
          label="Close"
          class="btn btn-primary"
          data-modal-close
        />
      </div>
    </div>
  )
}

function createTopLeftContent() {
  return (
    <div class="p-4">
      <h4 class="font-semibold mb-2">Top Left Position</h4>
      <p class="text-sm text-base-content/60 mb-4">
        This modal is positioned at the top-left corner of the screen.
      </p>
      <button class="btn btn-sm btn-primary" data-modal-close>
        Close
      </button>
    </div>
  )
}

function createMidCenterContent() {
  return (
    <div class="p-4">
      <h4 class="font-semibold mb-2">Mid Center Position</h4>
      <p class="text-sm text-base-content/60 mb-4">
        This modal is positioned at the center of the screen (default).
      </p>
      <button class="btn btn-sm btn-primary" data-modal-close>
        Close
      </button>
    </div>
  )
}

function createBottomRightContent() {
  return (
    <div class="p-4">
      <h4 class="font-semibold mb-2">Bottom Right Position</h4>
      <p class="text-sm text-base-content/60 mb-4">
        This modal is positioned at the bottom-right corner of the screen.
      </p>
      <button class="btn btn-sm btn-primary" data-modal-close>
        Close
      </button>
    </div>
  )
}

let simpleModalLogic: ModalLogic | undefined
let formModalLogic: ModalLogic | undefined
let confirmModalLogic: ModalLogic | undefined
let largeModalLogic: ModalLogic | undefined
let topLeftModalLogic: ModalLogic | undefined
let midCenterModalLogic: ModalLogic | undefined
let bottomRightModalLogic: ModalLogic | undefined

function render(props: BaseProps<ModalDemoProps>) {
  const DemoLayout = makeDemoLayout()
  const SimpleModal = makeModal()
  const FormModal = makeModal()
  const ConfirmModal = makeModal()
  const LargeModal = makeModal()
  const TopLeftModal = makeModal()
  const MidCenterModal = makeModal()
  const BottomRightModal = makeModal()
  const EventLog = makeEventLog()

  SimpleModal.getLogic().then(l => simpleModalLogic = l);
  FormModal.getLogic().then(l => formModalLogic = l);
  ConfirmModal.getLogic().then(l => confirmModalLogic = l);
  LargeModal.getLogic().then(l => largeModalLogic = l);
  TopLeftModal.getLogic().then(l => topLeftModalLogic = l);
  MidCenterModal.getLogic().then(l => midCenterModalLogic = l);
  BottomRightModal.getLogic().then(l => bottomRightModalLogic = l);

  // Trigger buttons
  const SimpleBtn = makeButton()
  const FormBtn = makeButton()
  const ConfirmBtn = makeButton()
  const LargeBtn = makeButton()
  const TopLeftBtn = makeButton()
  const MidCenterBtn = makeButton()
  const BottomRightBtn = makeButton()

  EventLog.getLogic().then(l => {
    eventLogComponent = l
  })

  return (
    <div {...props}>
      <DemoLayout
        title="Modal Window Demo"
        description="Modal dialogs with customizable overlays and content"
        sourcePath="/demos/ModalDemo.tsx"
      >
        <div class="space-y-8">

          {/* Modal Trigger Buttons */}
          <div>
            <h2 class="text-xl font-semibold mb-4">Modal Examples</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <SimpleBtn
                label="Simple Modal"
                class="btn btn-primary"
                on:click={() => simpleModalLogic?.show()}
              />
              <FormBtn
                label="Form Modal"
                class="btn btn-secondary"
                on:click={() => formModalLogic?.show()}
              />
              <ConfirmBtn
                label="Confirmation"
                class="btn btn-warning"
                on:click={() => confirmModalLogic?.show()}
              />
              <LargeBtn
                label="Large Modal"
                class="btn btn-accent"
                on:click={() => largeModalLogic?.show()}
              />
            </div>
          </div>

          {/* Modal Position Examples */}
          <div>
            <h2 class="text-xl font-semibold mb-4">Modal Positioning</h2>
            <p class="text-base-content/70 mb-4">
              Demonstration of different modal positions using the contentPosition prop.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TopLeftBtn
                label="Top Left"
                class="btn btn-outline"
                on:click={() => topLeftModalLogic?.show()}
              />
              <MidCenterBtn
                label="Mid Center"
                class="btn btn-outline"
                on:click={() => midCenterModalLogic?.show()}
              />
              <BottomRightBtn
                label="Bottom Right"
                class="btn btn-outline"
                on:click={() => bottomRightModalLogic?.show()}
              />
            </div>
          </div>

          {/* Event Log */}
          <div>
            <h2 class="text-xl font-semibold mb-4">Modal Activity Log</h2>
            <EventLog
              title="Modal Events"
              maxHeight="max-h-48"
              data-event-log-component
            />
          </div>

          {/* Documentation */}
          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-lg font-medium mb-3">Modal Component Features:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>Flexible Positioning</strong> - 9 position options (top/mid/bottom + left/center/right)</li>
                <li><strong>Custom Styling</strong> - Configurable overlay and content classes</li>
                <li><strong>Component Content</strong> - Accepts Duct components as content</li>
                <li><strong>Overlay Click</strong> - Optional close on overlay click</li>
              </ul>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>Keyboard Support</strong> - Escape key closes modal</li>
                <li><strong>Body Scroll Lock</strong> - Prevents background scrolling</li>
                <li><strong>Event System</strong> - Open, close, and overlay click events</li>
                <li><strong>Programmatic Control</strong> - Show, hide, toggle, and state methods</li>
              </ul>
            </div>

            <div class="mt-4 p-3 bg-info/10 rounded border border-info/20">
              <p class="text-sm text-info-content">
                <strong>Try it:</strong> Click any button to open different modal types. Try the "Position Demo" to see
                all 9 positioning options. Notice how each modal maintains its own state and can contain interactive components.
                Use Escape key or click overlay to close.
              </p>
            </div>
          </div>

          {/* Modal Components */}
          <SimpleModal
            content={createSimpleModalContent}
            data-simple-modal
            on:open={handleSimpleModalOpen}
            on:close={handleSimpleModalClose}
            on:overlayClick={handleOverlayClick}
          />

          <FormModal
            content={createFormModalContent}
            contentClass="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto"
            data-form-modal
            on:open={handleFormModalOpen}
            on:close={handleFormModalClose}
            on:overlayClick={handleOverlayClick}
          />

          <ConfirmModal
            content={createConfirmModalContent}
            contentClass="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4"
            data-confirm-modal
            on:open={handleConfirmModalOpen}
            on:close={handleConfirmModalClose}
            on:overlayClick={handleOverlayClick}
          />

          <LargeModal
            content={createLargeModalContent}
            contentClass="max-w-4xl"
            data-large-modal
            on:open={handleLargeModalOpen}
            on:close={handleLargeModalClose}
            on:overlayClick={handleOverlayClick}
          />

          <TopLeftModal
            content={createTopLeftContent}
            contentPosition="top-left"
            contentClass="max-w-sm"
            on:open={handleTopLeftModalOpen}
            on:close={handleTopLeftModalClose}
            on:overlayClick={handleOverlayClick}
          />

          <MidCenterModal
            content={createMidCenterContent}
            contentPosition="mid-center"
            contentClass="max-w-sm"
            on:open={handleMidCenterModalOpen}
            on:close={handleMidCenterModalClose}
            on:overlayClick={handleOverlayClick}
          />

          <BottomRightModal
            content={createBottomRightContent}
            contentPosition="bottom-right"
            contentClass="max-w-sm"
            on:open={handleBottomRightModalOpen}
            on:close={handleBottomRightModalClose}
            on:overlayClick={handleOverlayClick}
          />

        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<ModalDemoEvents>): BindReturn<ModalDemoLogic> {
  function release() {
    eventLogComponent = undefined
  }
  return {
    release
  }
}

const id = { id: "duct-demo/modal-demo" }

export default () => {
  return createBlueprint<ModalDemoProps, ModalDemoEvents, ModalDemoLogic>(
    id,
    render,
    {
      bind
    }
  )
}