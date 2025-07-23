import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeTabs, { type TabItem } from "@duct-ui/components/navigation/tabs"
import makeButton from "@duct-ui/components/button/button"
import makeToggle from "@duct-ui/components/button/toggle"
import makeEditable from "@duct-ui/components/input/editable"
import makeDemoLayout from "../components/DemoLayout"
import makeEventLog, { EventLogLogic } from "../components/EventLog"

export interface TabsDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface TabsDemoLogic {
  // Component logic methods if needed
}

export interface TabsDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

let eventLogComponent: EventLogLogic | undefined

function addToLog(message: string) {
  if (eventLogComponent) {
    eventLogComponent.addEvent(message)
  }
}

// Event handlers
function handleTabChange(_el: HTMLElement, activeTabId: string) {
  addToLog(`Switched to tab: ${activeTabId}`)
}

function handleProfileTabChange(_el: HTMLElement, activeTabId: string) {
  addToLog(`Profile tab changed to: ${activeTabId}`)
}

// Sample tab content components
function createOverviewContent() {
  const Button1 = makeButton()
  return (
    <div class="p-4 space-y-4">
      <h3 class="text-lg font-semibold">Welcome to the Dashboard</h3>
      <p class="text-base-content/70">
        This is the overview tab content. It contains general information about your account and recent activity.
      </p>
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Total Users</div>
          <div class="stat-value">31K</div>
          <div class="stat-desc">21% more than last month</div>
        </div>
        <div class="stat">
          <div class="stat-title">Active Sessions</div>
          <div class="stat-value">4,200</div>
          <div class="stat-desc">↗︎ 400 (22%)</div>
        </div>
      </div>
      <Button1
        label="View Details"
        class="btn btn-primary"
        on:click={() => addToLog('Overview details button clicked')}
      />
    </div>
  )
}

function createAnalyticsContent() {
  const RefreshBtn = makeButton()
  return (
    <div class="p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Analytics Dashboard</h3>
        <RefreshBtn
          label="Refresh Data"
          class="btn btn-sm btn-outline"
          on:click={() => addToLog('Analytics data refreshed')}
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="card bg-base-200">
          <div class="card-body">
            <h4 class="card-title">Page Views</h4>
            <div class="text-3xl font-bold text-primary">125,432</div>
            <p class="text-sm text-base-content/60">+12% from last week</p>
          </div>
        </div>
        <div class="card bg-base-200">
          <div class="card-body">
            <h4 class="card-title">Conversion Rate</h4>
            <div class="text-3xl font-bold text-success">3.24%</div>
            <p class="text-sm text-base-content/60">+0.5% improvement</p>
          </div>
        </div>
      </div>
      <div class="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Data is updated in real-time. Last updated: 2 minutes ago</span>
      </div>
    </div>
  )
}

function createSettingsContent() {
  const SaveBtn = makeButton()
  const NotificationsToggle = makeToggle()
  const UsernameInput = makeEditable()

  return (
    <div class="p-4 space-y-6">
      <h3 class="text-lg font-semibold">Account Settings</h3>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Username</span>
        </label>
        <UsernameInput
          text="john_doe"
          labelClass="user-name-label"
          inputClass="user-name-input"
          placeholder="Enter username"
          class="input input-bordered"
          on:change={(el, value) => addToLog(`Username changed to: ${value}`)}
        />
      </div>

      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Email Notifications</span>
          <NotificationsToggle
            onLabel="Enabled"
            offLabel="Disabled"
            initialState="on"
            onClass="btn-success"
            offClass="btn-outline"
            class="btn btn-sm"
            on:change={(el, state) => addToLog(`Notifications ${state === 'on' ? 'enabled' : 'disabled'}`)}
          />
        </label>
      </div>

      <div class="divider"></div>

      <div class="flex gap-2">
        <SaveBtn
          label="Save Changes"
          class="btn btn-primary"
          on:click={() => addToLog('Settings saved successfully')}
        />
        <SaveBtn
          label="Reset"
          class="btn btn-outline"
          on:click={() => addToLog('Settings reset to defaults')}
        />
      </div>
    </div>
  )
}

function createPersonalInfoContent() {
  return (
    <div class="p-4 space-y-4">
      <h4 class="text-lg font-medium">Personal Information</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label">
            <span class="label-text">First Name</span>
          </label>
          <input type="text" value="John" class="input input-bordered w-full" />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Last Name</span>
          </label>
          <input type="text" value="Doe" class="input input-bordered w-full" />
        </div>
      </div>
    </div>
  )
}

function createSecurityContent() {
  const ChangePasswordBtn = makeButton()
  return (
    <div class="p-4 space-y-4">
      <h4 class="text-lg font-medium">Security Settings</h4>
      <div class="space-y-4">
        <div class="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.726-.833-2.496 0L3.318 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Your password was last changed 3 months ago.</span>
        </div>
        <ChangePasswordBtn
          label="Change Password"
          class="btn btn-warning"
          on:click={() => addToLog('Password change initiated')}
        />
      </div>
    </div>
  )
}

function render(props: BaseProps<TabsDemoProps>) {
  const DemoLayout = makeDemoLayout()
  const MainTabs = makeTabs()
  const ProfileTabs = makeTabs()
  const EventLog = makeEventLog()

  EventLog.getLogic().then(l => {
    eventLogComponent = l
  })

  // Main dashboard tabs
  const mainTabItems: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      content: createOverviewContent
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: createAnalyticsContent
    },
    {
      id: 'settings',
      label: 'Settings',
      content: createSettingsContent
    },
    {
      id: 'disabled',
      label: 'Disabled Tab',
      content: () => <div>This content should not be visible</div>,
      disabled: true
    }
  ]

  // Nested profile tabs
  const profileTabItems: TabItem[] = [
    {
      id: 'personal',
      label: 'Personal Info',
      content: createPersonalInfoContent
    },
    {
      id: 'security',
      label: 'Security',
      content: createSecurityContent
    }
  ]

  return (
    <div {...props}>
      <DemoLayout
        title="Tabs Component Demo"
        description="Tabbed interface with dynamic content and nested tabs"
        sourcePath="/demos/TabsDemo.tsx"
      >
        <div class="space-y-8">

          {/* Main Tabs Example */}
          <div>
            <h2 class="text-xl font-semibold mb-4">Main Dashboard Tabs</h2>
            <MainTabs
              items={mainTabItems}
              activeTabId="overview"
              tabClass="tab"
              activeTabClass="tab-active"
              contentClass="tab-content p-0"
              on:change={handleTabChange}
            />
          </div>

          {/* Nested Tabs Example */}
          <div>
            <h2 class="text-xl font-semibold mb-4">Profile Settings (Nested Tabs)</h2>
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <ProfileTabs
                  items={profileTabItems}
                  activeTabId="personal"
                  tabClass="tab tab-bordered"
                  activeTabClass="tab-active"
                  contentClass="tab-content"
                  on:change={handleProfileTabChange}
                />
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div>
            <h2 class="text-xl font-semibold mb-4">Tab Activity Log</h2>
            <EventLog
              title="Tab Events"
              maxHeight="max-h-48"
              data-event-log-component
            />
          </div>

          {/* Documentation */}
          <div class="bg-base-200 p-6 rounded-lg">
            <h3 class="text-lg font-medium mb-3">Tabs Component Features:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>Dynamic Content</strong> - Tab content uses Duct components</li>
                <li><strong>Tab States</strong> - Active, disabled, and normal states</li>
                <li><strong>Change Events</strong> - Emits 'change' event on tab switch</li>
                <li><strong>Custom Styling</strong> - Configurable tab and content classes</li>
              </ul>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li><strong>Active Tab Control</strong> - Set initial active tab</li>
                <li><strong>Disabled Tabs</strong> - Mark tabs as disabled to prevent access</li>
                <li><strong>Nested Tabs</strong> - Support for tabs within tabs</li>
                <li><strong>Component Logic</strong> - Access tab state via getLogic()</li>
              </ul>
            </div>

            <div class="mt-4 p-3 bg-info/10 rounded border border-info/20">
              <p class="text-sm text-info-content">
                <strong>Try it:</strong> Click different tabs to see content changes. Notice how the disabled tab cannot be selected,
                and how each tab change is logged in the activity log below.
              </p>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<TabsDemoEvents>): BindReturn<TabsDemoLogic> {
  function release() {
    eventLogComponent = undefined
  }

  return {
    release
  }
}

const id = { id: "duct-demo/tabs-demo" }

export default () => {
  return createBlueprint<TabsDemoProps, TabsDemoEvents, TabsDemoLogic>(
    id,
    render,
    {
      bind
    }
  )
}