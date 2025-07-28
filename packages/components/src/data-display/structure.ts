export interface TreeNode<T = any> {
  id: string
  label: string
  icon?: string
  data?: T
  children?: TreeNode<T>[]
}

export interface TreeViewData<T = any> {
  nodes: TreeNode<T>[]
}

export type TreePath = string[] // Array of node IDs

/**
 * Get node at a specific path
 */
export function getNodeAtPath<T>(data: TreeViewData<T>, path: TreePath): TreeNode<T> | null {
  if (path.length === 0) return null
  
  let currentNodes = data.nodes
  let currentNode: TreeNode<T> | null = null
  
  for (const id of path) {
    currentNode = currentNodes.find(node => node.id === id) || null
    if (!currentNode) return null
    currentNodes = currentNode.children || []
  }
  
  return currentNode
}

/**
 * Get path to a specific node by ID (finds first occurrence)
 */
export function getPathToNode<T>(data: TreeViewData<T>, nodeId: string): TreePath | null {
  function searchNode(nodes: TreeNode<T>[], currentPath: TreePath): TreePath | null {
    for (const node of nodes) {
      const newPath = [...currentPath, node.id]
      
      if (node.id === nodeId) {
        return newPath
      }
      
      if (node.children) {
        const found = searchNode(node.children, newPath)
        if (found) return found
      }
    }
    return null
  }
  
  return searchNode(data.nodes, [])
}

/**
 * Get parent node of a given path
 */
export function getParentNode<T>(data: TreeViewData<T>, path: TreePath): TreeNode<T> | null {
  if (path.length <= 1) return null
  
  const parentPath = path.slice(0, -1)
  return getNodeAtPath(data, parentPath)
}

/**
 * Get all child paths of a node
 */
export function getChildPaths<T>(data: TreeViewData<T>, path: TreePath): TreePath[] {
  const node = getNodeAtPath(data, path)
  if (!node || !node.children) return []
  
  return node.children.map(child => [...path, child.id])
}

/**
 * Check if a node has children
 */
export function hasChildren<T>(node: TreeNode<T>): boolean {
  return !!(node.children && node.children.length > 0)
}

/**
 * Traverse tree and execute callback on each node
 */
export function traverseTree<T>(
  data: TreeViewData<T>, 
  callback: (node: TreeNode<T>, path: TreePath) => void
): void {
  function traverse(nodes: TreeNode<T>[], currentPath: TreePath): void {
    for (const node of nodes) {
      const nodePath = [...currentPath, node.id]
      callback(node, nodePath)
      
      if (node.children) {
        traverse(node.children, nodePath)
      }
    }
  }
  
  traverse(data.nodes, [])
}

/**
 * Get all nodes at a specific depth level
 */
export function getNodesAtDepth<T>(data: TreeViewData<T>, depth: number): Array<{ node: TreeNode<T>, path: TreePath }> {
  const result: Array<{ node: TreeNode<T>, path: TreePath }> = []
  
  traverseTree(data, (node, path) => {
    if (path.length === depth + 1) { // depth is 0-indexed
      result.push({ node, path })
    }
  })
  
  return result
}

/**
 * Find all nodes matching a predicate
 */
export function findNodes<T>(
  data: TreeViewData<T>, 
  predicate: (node: TreeNode<T>, path: TreePath) => boolean
): Array<{ node: TreeNode<T>, path: TreePath }> {
  const result: Array<{ node: TreeNode<T>, path: TreePath }> = []
  
  traverseTree(data, (node, path) => {
    if (predicate(node, path)) {
      result.push({ node, path })
    }
  })
  
  return result
}

/**
 * Get the depth of the deepest node in the tree
 */
export function getMaxDepth<T>(data: TreeViewData<T>): number {
  let maxDepth = 0
  
  traverseTree(data, (node, path) => {
    maxDepth = Math.max(maxDepth, path.length)
  })
  
  return maxDepth
}