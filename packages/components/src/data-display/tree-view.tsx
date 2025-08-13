import { createBlueprint, type BindReturn, type BaseComponentEvents, type BaseProps } from "@duct-ui/core/blueprint"
import { EventEmitter } from "@duct-ui/core/shared"
import { TreeViewData, TreeNode, TreePath, hasChildren } from "./structure.js"

export interface TreeViewEvents extends BaseComponentEvents {
  expanded: (el: HTMLElement, path: TreePath) => void
  collapsed: (el: HTMLElement, path: TreePath) => void
  clicked: (el: HTMLElement, path: TreePath) => void
}

export interface TreeViewLogic {
  expandNode: (path: TreePath) => void
  collapseNode: (path: TreePath) => void
  toggleNode: (path: TreePath) => void
  isExpanded: (path: TreePath) => boolean
  expandAll: () => void
  collapseAll: () => void
  setData: (newData: TreeViewData) => void
}

export type TreeViewProps<T = any> = {
  data: TreeViewData<T>
  initialExpanded?: TreePath[]
  expandOnLabelClick?: boolean
  class?: string
  nodeClass?: string
  labelClass?: string
  iconClass?: string
  indentSize?: string
  'on:bind'?: (el: HTMLElement) => void
  'on:release'?: (el: HTMLElement) => void
  'on:expanded'?: (el: HTMLElement, path: TreePath) => void
  'on:collapsed'?: (el: HTMLElement, path: TreePath) => void
  'on:clicked'?: (el: HTMLElement, path: TreePath) => void
} & Record<string, any>

function TreeNodeComponent<T>(props: {
  node: TreeNode<T>
  path: TreePath
  depth: number
  isExpanded: boolean
  nodeClass: string
  labelClass: string
  iconClass: string
  indentSize: string
  children?: any
}) {
  const {
    node,
    path,
    depth,
    isExpanded,
    nodeClass,
    labelClass,
    iconClass,
    indentSize,
    children
  } = props

  const pathKey = path.join('.')
  const nodeHasChildren = hasChildren(node)

  // Indent styling based on depth
  const indentStyle = depth > 0 ? indentSize : ""

  // Expand/collapse icon
  const expandIcon = nodeHasChildren
    ? (isExpanded ? "▼" : "▶")
    : "•"

  return (
    <div
      class={`tree-node ${nodeClass}`}
      data-node-path={pathKey}
      data-depth={depth}
      {...(nodeHasChildren ? { 'data-expandable': '' } : {})}
    >
      <div class={`tree-node-content ${indentStyle} ${labelClass}`} data-node-clickable="true">
        <span
          class={`tree-expand-icon ${iconClass}`}
        >
          {expandIcon}
        </span>
        {node.icon && (
          <span class={`tree-node-icon ${iconClass}`}>{node.icon}</span>
        )}
        <span class="tree-node-label">{node.label}</span>
      </div>

      {nodeHasChildren && (
        <div
          class="tree-children"
          data-parent-path={pathKey}
          style={`display: ${isExpanded ? 'block' : 'none'}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function render<T>(props: BaseProps<TreeViewProps<T>>) {
  const {
    data,
    initialExpanded = [],
    expandOnLabelClick = true,
    class: className = "",
    nodeClass = "",
    labelClass = "",
    iconClass = "",
    indentSize = "",
    ...moreProps
  } = props

  // Create set of initially expanded paths for quick lookup
  const expandedPaths = new Set(initialExpanded.map(path => path.join('.')))

  const containerClasses = `tree-view ${className}`.trim()

  function renderNodeRecursive(node: TreeNode<T>, path: TreePath, depth: number): any {
    const pathKey = path.join('.')
    const isExpanded = expandedPaths.has(pathKey)

    // Always render children, but they'll be hidden/shown via CSS
    const children = hasChildren(node)
      ? node.children!.map(child => {
        const childPath = [...path, child.id]
        return renderNodeRecursive(child, childPath, depth + 1)
      })
      : null

    return (
      <TreeNodeComponent
        data-key={pathKey}
        node={node}
        path={path}
        depth={depth}
        isExpanded={isExpanded}
        nodeClass={nodeClass}
        labelClass={labelClass}
        iconClass={iconClass}
        indentSize={indentSize}
      >
        {children}
      </TreeNodeComponent>
    )
  }

  return (
    <div
      class={containerClasses}
      data-expanded-paths={JSON.stringify(Array.from(expandedPaths))}
      data-expand-on-label-click={expandOnLabelClick}
      {...moreProps}
    >
      {data.nodes.map(node => {
        const path = [node.id]
        return renderNodeRecursive(node, path, 0)
      })}
    </div>
  )
}

function bind<T>(el: HTMLElement, eventEmitter: EventEmitter<TreeViewEvents>): BindReturn<TreeViewLogic> {
  // Parse initial expanded paths from data attribute
  const expandedPathsData = el.getAttribute('data-expanded-paths')
  const expandedPaths = new Set<string>(expandedPathsData ? JSON.parse(expandedPathsData) : [])

  // Parse expand on label click setting
  const expandOnLabelClick = el.hasAttribute('data-expand-on-label-click')

  function getPathFromElement(element: HTMLElement): TreePath {
    const pathAttr = element.getAttribute('data-node-path') ||
      element.closest('[data-node-path]')?.getAttribute('data-node-path')
    return pathAttr ? pathAttr.split('.') : []
  }

  function updateNodeDisplay(path: TreePath, expanded: boolean) {
    const pathKey = path.join('.')
    const nodeEl = el.querySelector(`[data-node-path="${pathKey}"]`)
    if (!nodeEl) return

    const expandIcon = nodeEl.querySelector('.tree-expand-icon')
    const childrenEl = nodeEl.querySelector('.tree-children') as HTMLElement

    // Update expand icon
    if (expandIcon) {
      const hasChildNodes = nodeEl.hasAttribute('data-expandable')
      if (hasChildNodes) {
        expandIcon.textContent = expanded ? "▼" : "▶"
      }
    }

    // Show/hide children
    if (childrenEl) {
      childrenEl.style.display = expanded ? 'block' : 'none'
    }
  }

  function setData(newData: TreeViewData) {
    // Store the current expanded state
    const currentExpandedPaths = Array.from(expandedPaths)

    // Clear and re-render the entire tree
    el.innerHTML = ''

    // Re-render with new data but preserve expanded state
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = render({
      data: newData,
      initialExpanded: currentExpandedPaths.map(path => path.split('.')),
      class: el.className.replace('tree-view', '').trim(),
      'data-duct-id': el.getAttribute('data-duct-id') || ''
    } as any).toString()

    // Replace content
    while (tempDiv.firstChild) {
      el.appendChild(tempDiv.firstChild)
    }
  }

  function expandNode(path: TreePath) {
    const pathKey = path.join('.')
    if (!expandedPaths.has(pathKey)) {
      expandedPaths.add(pathKey)
      updateNodeDisplay(path, true)
      eventEmitter.emit('expanded', path)
    }
  }

  function collapseNode(path: TreePath) {
    const pathKey = path.join('.')
    if (expandedPaths.has(pathKey)) {
      expandedPaths.delete(pathKey)
      updateNodeDisplay(path, false)
      eventEmitter.emit('collapsed', path)
    }
  }

  function toggleNode(path: TreePath) {
    const pathKey = path.join('.')
    if (expandedPaths.has(pathKey)) {
      collapseNode(path)
    } else {
      expandNode(path)
    }
  }

  function isExpanded(path: TreePath): boolean {
    return expandedPaths.has(path.join('.'))
  }

  function expandNodeElement(node: HTMLElement) {
    const path = getPathFromElement(node)
    if (path.length > 0) {
      expandNode(path)
    }
  }

  function collapseNodeElement(node: HTMLElement) {
    const path = getPathFromElement(node)
    if (path.length > 0) {
      collapseNode(path)
    }
  }

  function expandAll() {
    const allNodes = el.querySelectorAll('[data-expandable]')
    allNodes.forEach(node => expandNodeElement(node as HTMLElement))
  }

  function collapseAll() {
    const allNodes = el.querySelectorAll('[data-expandable]')
    allNodes.forEach(node => collapseNodeElement(node as HTMLElement))
  }

  function handleClick(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const target = e.target as HTMLElement
    const clickableElement = target.closest('[data-node-clickable="true"]')

    if (!clickableElement) return

    const path = getPathFromElement(clickableElement as HTMLElement)
    if (path.length === 0) return

    // Check if click was on expand icon
    const expandIcon = target.closest('.tree-expand-icon')
    const nodeEl = clickableElement.closest('[data-node-path]') as HTMLElement
    const isExpandable = nodeEl?.hasAttribute('data-expandable')

    if (expandIcon && isExpandable) {
      // Always toggle expand/collapse when clicking the icon
      toggleNode(path)
    } else if (isExpandable && expandOnLabelClick) {
      // Toggle expand/collapse when clicking on expandable node label (if enabled)
      toggleNode(path)
    } else {
      // Regular node click for non-expandable nodes or when label click is disabled
      eventEmitter.emit('clicked', path)
    }
  }

  // Event listeners
  el.addEventListener('click', handleClick)

  // Initialize display state for initially collapsed children
  expandedPaths.forEach(pathKey => {
    const path = pathKey.split('.')
    updateNodeDisplay(path, true)
  })

  function release() {
    el.removeEventListener('click', handleClick)
  }

  return {
    expandNode,
    collapseNode,
    toggleNode,
    isExpanded,
    expandAll,
    collapseAll,
    setData,
    release
  }
}

const id = { id: "duct/tree-view" }

const TreeView = createBlueprint<TreeViewProps, TreeViewEvents, TreeViewLogic>(
  id,
  render,
  {
    domEvents: ['click'],
    bind
  }
)

export default TreeView