import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { createRef } from "@duct-ui/core"
import TreeView from "@duct-ui/components/data-display/tree-view"
import Button from "@duct-ui/components/button/button"
import DemoLayout from "../components/DemoLayout"
import EventLog, { EventLogLogic } from "../components/EventLog"
import { TreeViewData, TreePath } from "@duct-ui/components/data-display/structure"
import "@duct-ui/components/data-display/tree-view.css"

export interface TreeViewDemoEvents extends BaseComponentEvents {
  // No custom events needed for this demo
}

export interface TreeViewDemoLogic {
  // Component logic methods if needed
}

export interface TreeViewDemoProps {
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
}

const eventLogRef = createRef<EventLogLogic>()
const treeView3Ref = createRef<any>()

function addToLog(message: string) {
  if (eventLogRef.current) {
    eventLogRef.current.addEvent(message)
  }
}

// Sample tree data
interface FileData {
  type: 'file' | 'folder'
  size?: number
  extension?: string
}

const project1FileSystem: TreeViewData<FileData> = {
  nodes: [
    {
      id: "src",
      label: "src/",
      icon: "📁",
      data: { type: "folder" },
      children: [
        {
          id: "components",
          label: "components/",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "button",
              label: "button/",
              icon: "📁",
              data: { type: "folder" },
              children: [
                {
                  id: "button-tsx",
                  label: "button.tsx",
                  icon: "⚛️",
                  data: { type: "file", size: 2048, extension: "tsx" }
                },
                {
                  id: "button-test",
                  label: "button.test.ts",
                  icon: "🧪",
                  data: { type: "file", size: 1024, extension: "ts" }
                }
              ]
            },
            {
              id: "menu",
              label: "menu/",
              icon: "📁",
              data: { type: "folder" },
              children: [
                {
                  id: "menu-tsx",
                  label: "menu.tsx",
                  icon: "⚛️",
                  data: { type: "file", size: 3072, extension: "tsx" }
                },
                {
                  id: "menu-item-tsx",
                  label: "menu-item.tsx",
                  icon: "⚛️",
                  data: { type: "file", size: 1536, extension: "tsx" }
                }
              ]
            }
          ]
        },
        {
          id: "utils",
          label: "utils/",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "helpers-ts",
              label: "helpers.ts",
              icon: "📜",
              data: { type: "file", size: 512, extension: "ts" }
            }
          ]
        },
        {
          id: "index-ts",
          label: "index.ts",
          icon: "📜",
          data: { type: "file", size: 256, extension: "ts" }
        }
      ]
    },
    {
      id: "docs",
      label: "docs/",
      icon: "📁",
      data: { type: "folder" },
      children: [
        {
          id: "readme-md",
          label: "README.md",
          icon: "📄",
          data: { type: "file", size: 1024, extension: "md" }
        },
        {
          id: "api-md",
          label: "API.md",
          icon: "📄",
          data: { type: "file", size: 2048, extension: "md" }
        }
      ]
    },
    {
      id: "package-json",
      label: "package.json",
      icon: "📦",
      data: { type: "file", size: 512, extension: "json" }
    },
    {
      id: "tsconfig-json",
      label: "tsconfig.json",
      icon: "⚙️",
      data: { type: "file", size: 256, extension: "json" }
    }
  ]
}

const project2FileSystem: TreeViewData<FileData> = {
  nodes: [
    {
      id: "app",
      label: "app/",
      icon: "📱",
      data: { type: "folder" },
      children: [
        {
          id: "models",
          label: "models/",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "user-model",
              label: "User.ts",
              icon: "👤",
              data: { type: "file", size: 1024, extension: "ts" }
            },
            {
              id: "product-model",
              label: "Product.ts",
              icon: "📦",
              data: { type: "file", size: 2048, extension: "ts" }
            }
          ]
        },
        {
          id: "controllers",
          label: "controllers/",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "auth-controller",
              label: "AuthController.ts",
              icon: "🔐",
              data: { type: "file", size: 3072, extension: "ts" }
            },
            {
              id: "api-controller",
              label: "ApiController.ts",
              icon: "🌐",
              data: { type: "file", size: 2560, extension: "ts" }
            }
          ]
        },
        {
          id: "views",
          label: "views/",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "home-view",
              label: "Home.tsx",
              icon: "🏠",
              data: { type: "file", size: 1536, extension: "tsx" }
            },
            {
              id: "login-view",
              label: "Login.tsx",
              icon: "🔑",
              data: { type: "file", size: 1280, extension: "tsx" }
            }
          ]
        }
      ]
    },
    {
      id: "public",
      label: "public/",
      icon: "📁",
      data: { type: "folder" },
      children: [
        {
          id: "images",
          label: "images/",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "logo-png",
              label: "logo.png",
              icon: "🖼️",
              data: { type: "file", size: 8192, extension: "png" }
            },
            {
              id: "banner-jpg",
              label: "banner.jpg",
              icon: "🖼️",
              data: { type: "file", size: 15360, extension: "jpg" }
            }
          ]
        },
        {
          id: "styles",
          label: "styles/",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "main-css",
              label: "main.css",
              icon: "🎨",
              data: { type: "file", size: 2048, extension: "css" }
            }
          ]
        }
      ]
    },
    {
      id: "config",
      label: "config/",
      icon: "📁",
      data: { type: "folder" },
      children: [
        {
          id: "database-config",
          label: "database.json",
          icon: "🗄️",
          data: { type: "file", size: 512, extension: "json" }
        },
        {
          id: "server-config",
          label: "server.json",
          icon: "⚙️",
          data: { type: "file", size: 256, extension: "json" }
        }
      ]
    },
    {
      id: "dockerfile",
      label: "Dockerfile",
      icon: "🐳",
      data: { type: "file", size: 1024, extension: "" }
    },
    {
      id: "env-file",
      label: ".env",
      icon: "🔧",
      data: { type: "file", size: 128, extension: "env" }
    }
  ]
}

const simpleTree: TreeViewData = {
  nodes: [
    {
      id: "animals",
      label: "Animals",
      icon: "🐾",
      children: [
        { id: "dog", label: "Dog", icon: "🐕" },
        { id: "cat", label: "Cat", icon: "🐱" },
        { id: "bird", label: "Bird", icon: "🐦" }
      ]
    },
    {
      id: "fruits",
      label: "Fruits",
      icon: "🍎",
      children: [
        { id: "apple", label: "Apple", icon: "🍎" },
        { id: "banana", label: "Banana", icon: "🍌" },
        { id: "orange", label: "Orange", icon: "🍊" }
      ]
    },
    {
      id: "colors",
      label: "Colors",
      icon: "🎨"
      // No children - leaf node
    }
  ]
}

// Event handlers
function expandedHandler(el: HTMLElement, path: TreePath) {
  addToLog(`Expanded: ${path.join(' → ')}`)
}

function collapsedHandler(el: HTMLElement, path: TreePath) {
  addToLog(`Collapsed: ${path.join(' → ')}`)
}

function clickedHandler(el: HTMLElement, path: TreePath) {
  addToLog(`Clicked: ${path.join(' → ')}`)
}

function expandAll(el: HTMLElement, e: MouseEvent) {
  if (treeView3Ref.current) {
    treeView3Ref.current.expandAll()
    addToLog(`Expanded all nodes`)
  }
}

function collapseAll(el: HTMLElement, e: MouseEvent) {
  if (treeView3Ref.current) {
    treeView3Ref.current.collapseAll()
    addToLog(`Collapsed all nodes`)
  }
}

function expandSrc(el: HTMLElement, e: MouseEvent) {
  if (treeView3Ref.current) {
    treeView3Ref.current.expandNode(["src"])
    addToLog(`Expanded src/ folder`)
  }
}

function collapseSrc(el: HTMLElement, e: MouseEvent) {
  if (treeView3Ref.current) {
    treeView3Ref.current.collapseNode(["src"])
    addToLog(`Collapsed src/ folder`)
  }
}

function loadProject1(el: HTMLElement, e: MouseEvent) {
  if (treeView3Ref.current) {
    treeView3Ref.current.setData(project1FileSystem)
    addToLog(`Loaded React/TypeScript project structure`)
  }
}

function loadProject2(el: HTMLElement, e: MouseEvent) {
  if (treeView3Ref.current) {
    treeView3Ref.current.setData(project2FileSystem)
    addToLog(`Loaded Web App project structure`)
  }
}

function render(props: BaseProps<TreeViewDemoProps>) {
  return (
    <div {...props}>
      <DemoLayout
        title="TreeView Component"
        description="Collapsible tree view for hierarchical data with expand/collapse functionality"
        sourcePath="/demos/TreeViewDemo.tsx"
      >
        <div>
          <div class="space-y-8">

            {/* Basic Usage */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Basic Usage</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div>
                  <h3 class="text-lg font-medium mb-2">Simple Tree</h3>
                  <div class="bg-base-200 p-4 rounded-lg">
                    <TreeView
                      data={simpleTree}
                      initialExpanded={[["animals"]]}
                      labelClass="cursor-pointer hover:bg-base-300 px-2 py-1 rounded transition-colors"
                      iconClass="mr-2"
                      on:expanded={expandedHandler}
                      on:collapsed={collapsedHandler}
                      on:clicked={clickedHandler}
                    />
                  </div>
                  <p class="text-sm text-base-content/60 mt-2">
                    Click the arrows to expand/collapse nodes. Click labels to select items.
                  </p>
                </div>

                <div>
                  <h3 class="text-lg font-medium mb-2">Icon-Only Expand</h3>
                  <div class="bg-base-200 p-4 rounded-lg">
                    <TreeView
                      data={simpleTree}
                      expandOnLabelClick={false}
                      class="text-lg"
                      labelClass="cursor-pointer hover:bg-primary/20 px-3 py-2 rounded-lg transition-colors"
                      iconClass="mr-3"
                      on:expanded={expandedHandler}
                      on:collapsed={collapsedHandler}
                      on:clicked={clickedHandler}
                    />
                  </div>
                  <p class="text-sm text-base-content/60 mt-2">
                    Only arrow icons expand/collapse nodes. Clicking labels fires the clicked event.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Example */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">File System Example</h2>
              <div>
                <h3 class="text-lg font-medium mb-2">Interactive File Tree with Programmatic Control</h3>

                <div class="flex gap-2 mb-4 flex-wrap">
                  <div class="flex gap-2">
                    <Button
                      label="Load Project 1"
                      class="btn btn-sm btn-success"
                      on:click={loadProject1}
                    />
                    <Button
                      label="Load Project 2"
                      class="btn btn-sm btn-info"
                      on:click={loadProject2}
                    />
                  </div>

                  <div class="flex gap-2">
                    <Button
                      label="Expand All"
                      class="btn btn-sm btn-primary"
                      on:click={expandAll}
                    />
                    <Button
                      label="Collapse All"
                      class="btn btn-sm btn-secondary"
                      on:click={collapseAll}
                    />
                    <Button
                      label="Expand src/"
                      class="btn btn-sm btn-accent"
                      on:click={expandSrc}
                    />
                    <Button
                      label="Collapse src/"
                      class="btn btn-sm btn-warning"
                      on:click={collapseSrc}
                    />
                  </div>
                </div>

                <div class="bg-base-200 p-4 rounded-lg">
                  <TreeView
                    ref={treeView3Ref}
                    data={project1FileSystem}
                    initialExpanded={[["src"], ["docs"]]}
                    labelClass="cursor-pointer hover:bg-base-300 px-2 py-1 rounded text-sm font-mono"
                    on:expanded={expandedHandler}
                    on:collapsed={collapsedHandler}
                    on:clicked={clickedHandler}
                  />
                </div>

                <p class="text-sm text-base-content/60 mt-2">
                  A realistic file system tree with programmatic controls.
                  Try the "Load Project" buttons to switch between different project structures,
                  or use the other buttons to control expand/collapse behavior.
                </p>
              </div>
            </div>

            {/* Event Log */}
            <div>
              <h2 class="text-2xl font-semibold mb-4">Event Log</h2>
              <EventLog
                ref={eventLogRef}
                title="Tree Events"
                maxHeight="max-h-64"
                data-event-log-component
              />
            </div>

            {/* Features Documentation */}
            <div class="bg-base-200 p-6 rounded-lg">
              <h3 class="text-lg font-medium mb-3">TreeView Features:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Collapsible Nodes</strong> - Click arrows to expand/collapse</li>
                  <li><strong>Label Click Expand</strong> - Optional expand on label click (default: true)</li>
                  <li><strong>Path-based Events</strong> - Events include full path to clicked node</li>
                  <li><strong>Initial State</strong> - Set initially expanded nodes</li>
                  <li><strong>Custom Styling</strong> - Customize labels, icons, and indentation</li>
                </ul>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li><strong>Programmatic Control</strong> - expandNode(), collapseNode(), toggleNode()</li>
                  <li><strong>Bulk Operations</strong> - expandAll(), collapseAll()</li>
                  <li><strong>Data Refresh</strong> - setData() to load new tree structures</li>
                  <li><strong>Rich Data Support</strong> - Generic data type for custom metadata</li>
                  <li><strong>Event Handling</strong> - <code>on:expanded</code>, <code>on:collapsed</code>, <code>on:clicked</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DemoLayout>
    </div>
  )
}

function bind(el: HTMLElement, _eventEmitter: EventEmitter<TreeViewDemoEvents>): BindReturn<TreeViewDemoLogic> {
  return {
    release: () => {
      // Ref cleanup is handled automatically
    }
  }
}

const id = { id: "duct-demo/tree-view-demo" }

const TreeViewDemo = createBlueprint<TreeViewDemoProps, TreeViewDemoEvents, TreeViewDemoLogic>(
  id,
  render,
  {
    bind
  }
)

export default TreeViewDemo