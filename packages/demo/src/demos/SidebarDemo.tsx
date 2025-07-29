import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import DemoLayout from "../components/DemoLayout"

export interface SidebarDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface SidebarDemoLogic {
  // Component logic methods if needed
}

export interface SidebarDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<SidebarDemoProps>) {
  return (
    <div {...props}>
      <DemoLayout
        title="Sidebar Navigation Component"
        description="Navigation sidebar with sections and hierarchical items"
        sourcePath="/components/Sidebar.tsx"
      >
      <div>
        <div class="space-y-6">
          <div class="p-6 bg-base-200 rounded-lg">
            <h2 class="text-xl font-semibold mb-4 text-base-content">
              🎯 Live Demo in Action
            </h2>
            <p class="text-base-content/80 mb-4">
              You are currently viewing the <strong>Sidebar Navigation component demo</strong>!
              The navigation sidebar you see on the left side of this application IS the sidebar component in action.
            </p>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Organized sections with hierarchical navigation items</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Active state highlighting for current page</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Click any item to navigate and see the active state update</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Responsive design with mobile drawer integration</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Customizable header content with branding and links</span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-info/10 border border-info/20 rounded-lg">
            <h3 class="text-lg font-medium mb-3 text-info-content">
              📱 Try the Interactive Features
            </h3>
            <ul class="space-y-2 text-sm text-info-content/80">
              <li>• Navigate between different demos using the sidebar</li>
              <li>• Notice how the active item highlighting updates automatically</li>
              <li>• On mobile devices, the sidebar becomes a responsive drawer</li>
              <li>• Try resizing your browser window to see the responsive behavior</li>
            </ul>
          </div>

          <div class="p-4 bg-base-200 rounded-lg">
            <h3 class="text-lg font-medium mb-2">Features Demonstrated:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li>Sidebar navigation component with section organization</li>
              <li>Active state management and visual highlighting</li>
              <li>Event handling for navigation interactions</li>
              <li>Integration with responsive drawer for mobile layouts</li>
              <li>Customizable header content and styling</li>
              <li>Proper accessibility attributes and keyboard navigation</li>
            </ul>
          </div>
        </div>
      </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<SidebarDemoEvents>): BindReturn<SidebarDemoLogic> {
  function release() {
    // No cleanup needed for this demo
  }
  return {
    release
  }
}

const id = { id: "duct-demo/sidebar-demo" }

const SidebarDemo = createBlueprint<SidebarDemoProps, SidebarDemoEvents, SidebarDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default SidebarDemo