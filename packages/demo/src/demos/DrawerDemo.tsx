import { createBlueprint, EventEmitter, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import makeDemoLayout from "../components/DemoLayout"

export interface DrawerDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface DrawerDemoLogic {
  // Component logic methods if needed
}

export interface DrawerDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

function render(props: BaseProps<DrawerDemoProps>) {
  const DemoLayout = makeDemoLayout()

  return (
    <div {...props}>
      <DemoLayout
        title="Drawer Component"
        description="Responsive drawer component for mobile and desktop layouts"
        sourcePath="/components/AppLayout.tsx"
      >
      <div>
        <div class="space-y-6">
          <div class="p-6 bg-base-200 rounded-lg">
            <h2 class="text-xl font-semibold mb-4 text-base-content">
              🎯 Live Demo in Action
            </h2>
            <p class="text-base-content/80 mb-4">
              You are currently viewing the <strong>Drawer component demo</strong>!
              The responsive layout of this entire application IS the drawer component in action.
            </p>
            <div class="space-y-3 text-sm">
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Responsive behavior: sidebar on desktop, drawer on mobile</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Click outside drawer area to close (mobile/tablet only)</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Hamburger menu toggle in header (visible on smaller screens)</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Overlay mode with backdrop on smaller screens</span>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary">✓</span>
                <span>Persistent mode on desktop (≥1024px width)</span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-warning/10 border border-warning/20 rounded-lg">
            <h3 class="text-lg font-medium mb-3 text-warning-content">
              📱 Mobile-Specific Features
            </h3>
            <div class="space-y-3 text-sm text-warning-content/80">
              <p class="font-medium">
                <strong>Note:</strong> The drawer overlay behavior is only visible when your screen width is smaller than 1024px.
              </p>
              <ul class="space-y-2 ml-4">
                <li>• <strong>Resize your browser window</strong> to be narrower to see the drawer in action</li>
                <li>• <strong>Use mobile dev tools</strong> in your browser to simulate mobile view</li>
                <li>• <strong>Hamburger menu (☰)</strong> appears in the header on small screens</li>
                <li>• <strong>Click the hamburger</strong> to toggle the drawer open/closed</li>
                <li>• <strong>Click outside</strong> the drawer content to close it</li>
                <li>• <strong>Press Escape</strong> to close the drawer</li>
              </ul>
            </div>
          </div>

          <div class="p-6 bg-info/10 border border-info/20 rounded-lg">
            <h3 class="text-lg font-medium mb-3 text-info-content">
              🖥️ Desktop vs Mobile Behavior
            </h3>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
              <div class="space-y-2">
                <h4 class="font-medium text-info-content">Desktop (≥1024px):</h4>
                <ul class="space-y-1 text-info-content/80">
                  <li>• Persistent sidebar always visible</li>
                  <li>• No overlay or backdrop</li>
                  <li>• No hamburger menu button</li>
                  <li>• Content adjusts to sidebar width</li>
                </ul>
              </div>
              <div class="space-y-2">
                <h4 class="font-medium text-info-content">Mobile/Tablet (&lt;1024px):</h4>
                <ul class="space-y-1 text-info-content/80">
                  <li>• Drawer overlay on top of content</li>
                  <li>• Backdrop/overlay behind drawer</li>
                  <li>• Hamburger menu in header</li>
                  <li>• Click outside or ESC to close</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="p-4 bg-base-200 rounded-lg">
            <h3 class="text-lg font-medium mb-2">Features Demonstrated:</h3>
            <ul class="list-disc list-inside space-y-1 text-sm">
              <li>Responsive drawer component with mobile/desktop modes</li>
              <li>Persistent sidebar mode for larger screens</li>
              <li>Overlay drawer mode for smaller screens</li>
              <li>Click outside to close functionality</li>
              <li>Keyboard navigation (Escape key support)</li>
              <li>Smooth transitions and animations</li>
              <li>Integration with header hamburger menu toggle</li>
              <li>Proper z-index layering and backdrop handling</li>
            </ul>
          </div>
        </div>
      </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<DrawerDemoEvents>): BindReturn<DrawerDemoLogic> {
  function release() {
    // No cleanup needed for this demo
  }
  return {
    release
  }
}

const id = { id: "duct-demo/drawer-demo" }

export default () => {
  return createBlueprint<DrawerDemoProps, DrawerDemoEvents, DrawerDemoLogic>(
    id,
    render,
    {
      bind
    }
  )
}