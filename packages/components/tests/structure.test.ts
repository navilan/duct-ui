import { describe, test, expect } from 'vitest'

import {
  TreeNode,
  TreeViewData,
  TreePath,
  getNodeAtPath,
  getPathToNode,
  getParentNode,
  getChildPaths,
  hasChildren,
  traverseTree,
  getNodesAtDepth,
  findNodes,
  getMaxDepth
} from '../src/data-display/structure'

// Test data setup
interface TestData {
  type: string
  size?: number
}

const mockTreeData: TreeViewData<TestData> = {
  nodes: [
    {
      id: "root1",
      label: "Root 1",
      icon: "📁",
      data: { type: "folder" },
      children: [
        {
          id: "child1-1",
          label: "Child 1-1",
          icon: "📄",
          data: { type: "file", size: 100 }
        },
        {
          id: "child1-2",
          label: "Child 1-2",
          icon: "📁",
          data: { type: "folder" },
          children: [
            {
              id: "grandchild1-2-1",
              label: "Grandchild 1-2-1",
              icon: "📄",
              data: { type: "file", size: 200 }
            }
          ]
        }
      ]
    },
    {
      id: "root2",
      label: "Root 2",
      icon: "📄",
      data: { type: "file", size: 500 }
    },
    {
      id: "root3",
      label: "Root 3",
      icon: "📁",
      data: { type: "folder" }
      // No children
    }
  ]
}

describe('Tree Structure', () => {
  describe('getNodeAtPath', () => {
    test('should return root node for single-level path', () => {
      const node = getNodeAtPath(mockTreeData, ["root1"])
      expect(node).toBeTruthy()
      expect(node?.id).toBe("root1")
      expect(node?.label).toBe("Root 1")
    })

    test('should return nested node for multi-level path', () => {
      const node = getNodeAtPath(mockTreeData, ["root1", "child1-2", "grandchild1-2-1"])
      expect(node).toBeTruthy()
      expect(node?.id).toBe("grandchild1-2-1")
      expect(node?.data?.size).toBe(200)
    })

    test('should return null for invalid path', () => {
      const node = getNodeAtPath(mockTreeData, ["invalid", "path"])
      expect(node).toBeNull()
    })

    test('should return null for empty path', () => {
      const node = getNodeAtPath(mockTreeData, [])
      expect(node).toBeNull()
    })

    test('should return null for partially valid path', () => {
      const node = getNodeAtPath(mockTreeData, ["root1", "invalid"])
      expect(node).toBeNull()
    })
  })

  describe('getPathToNode', () => {
    test('should return correct path for root node', () => {
      const path = getPathToNode(mockTreeData, "root2")
      expect(path).toEqual(["root2"])
    })

    test('should return correct path for nested node', () => {
      const path = getPathToNode(mockTreeData, "grandchild1-2-1")
      expect(path).toEqual(["root1", "child1-2", "grandchild1-2-1"])
    })

    test('should return null for non-existent node', () => {
      const path = getPathToNode(mockTreeData, "nonexistent")
      expect(path).toBeNull()
    })

    test('should find first occurrence for duplicate IDs', () => {
      const dataWithDuplicates: TreeViewData = {
        nodes: [
          { id: "dup", label: "First" },
          { id: "parent", label: "Parent", children: [{ id: "dup", label: "Second" }] }
        ]
      }
      const path = getPathToNode(dataWithDuplicates, "dup")
      expect(path).toEqual(["dup"]) // Should find the first one
    })
  })

  describe('getParentNode', () => {
    test('should return parent for nested node', () => {
      const parent = getParentNode(mockTreeData, ["root1", "child1-2", "grandchild1-2-1"])
      expect(parent).toBeTruthy()
      expect(parent?.id).toBe("child1-2")
    })

    test('should return null for root node', () => {
      const parent = getParentNode(mockTreeData, ["root1"])
      expect(parent).toBeNull()
    })

    test('should return null for empty path', () => {
      const parent = getParentNode(mockTreeData, [])
      expect(parent).toBeNull()
    })

    test('should return root for first-level child', () => {
      const parent = getParentNode(mockTreeData, ["root1", "child1-1"])
      expect(parent).toBeTruthy()
      expect(parent?.id).toBe("root1")
    })
  })

  describe('getChildPaths', () => {
    test('should return child paths for node with children', () => {
      const childPaths = getChildPaths(mockTreeData, ["root1"])
      expect(childPaths).toHaveLength(2)
      expect(childPaths).toContainEqual(["root1", "child1-1"])
      expect(childPaths).toContainEqual(["root1", "child1-2"])
    })

    test('should return empty array for node without children', () => {
      const childPaths = getChildPaths(mockTreeData, ["root2"])
      expect(childPaths).toEqual([])
    })

    test('should return empty array for non-existent node', () => {
      const childPaths = getChildPaths(mockTreeData, ["invalid"])
      expect(childPaths).toEqual([])
    })

    test('should return nested child paths', () => {
      const childPaths = getChildPaths(mockTreeData, ["root1", "child1-2"])
      expect(childPaths).toHaveLength(1)
      expect(childPaths[0]).toEqual(["root1", "child1-2", "grandchild1-2-1"])
    })
  })

  describe('hasChildren', () => {
    test('should return true for node with children', () => {
      const node = getNodeAtPath(mockTreeData, ["root1"])!
      expect(hasChildren(node)).toBe(true)
    })

    test('should return false for node without children', () => {
      const node = getNodeAtPath(mockTreeData, ["root2"])!
      expect(hasChildren(node)).toBe(false)
    })

    test('should return false for node with empty children array', () => {
      const nodeWithEmptyChildren: TreeNode = {
        id: "test",
        label: "Test",
        children: []
      }
      expect(hasChildren(nodeWithEmptyChildren)).toBe(false)
    })

    test('should return false for node with undefined children', () => {
      const node = getNodeAtPath(mockTreeData, ["root3"])!
      expect(hasChildren(node)).toBe(false)
    })
  })

  describe('traverseTree', () => {
    test('should visit all nodes in correct order', () => {
      const visitedNodes: Array<{ id: string, path: TreePath }> = []

      traverseTree(mockTreeData, (node, path) => {
        visitedNodes.push({ id: node.id, path: [...path] })
      })

      expect(visitedNodes).toHaveLength(6)
      expect(visitedNodes[0]).toEqual({ id: "root1", path: ["root1"] })
      expect(visitedNodes[1]).toEqual({ id: "child1-1", path: ["root1", "child1-1"] })
      expect(visitedNodes[2]).toEqual({ id: "child1-2", path: ["root1", "child1-2"] })
      expect(visitedNodes[3]).toEqual({ id: "grandchild1-2-1", path: ["root1", "child1-2", "grandchild1-2-1"] })
      expect(visitedNodes[4]).toEqual({ id: "root2", path: ["root2"] })
      expect(visitedNodes[5]).toEqual({ id: "root3", path: ["root3"] })
    })

    test('should handle empty tree', () => {
      const emptyTree: TreeViewData = { nodes: [] }
      const visitedNodes: string[] = []

      traverseTree(emptyTree, (node) => {
        visitedNodes.push(node.id)
      })

      expect(visitedNodes).toHaveLength(0)
    })
  })

  describe('getNodesAtDepth', () => {
    test('should return root nodes at depth 0', () => {
      const nodesAtDepth0 = getNodesAtDepth(mockTreeData, 0)
      expect(nodesAtDepth0).toHaveLength(3)
      expect(nodesAtDepth0.map(n => n.node.id)).toEqual(["root1", "root2", "root3"])
    })

    test('should return first-level children at depth 1', () => {
      const nodesAtDepth1 = getNodesAtDepth(mockTreeData, 1)
      expect(nodesAtDepth1).toHaveLength(2)
      expect(nodesAtDepth1.map(n => n.node.id)).toEqual(["child1-1", "child1-2"])
    })

    test('should return grandchildren at depth 2', () => {
      const nodesAtDepth2 = getNodesAtDepth(mockTreeData, 2)
      expect(nodesAtDepth2).toHaveLength(1)
      expect(nodesAtDepth2[0].node.id).toBe("grandchild1-2-1")
    })

    test('should return empty array for non-existent depth', () => {
      const nodesAtDepth10 = getNodesAtDepth(mockTreeData, 10)
      expect(nodesAtDepth10).toHaveLength(0)
    })
  })

  describe('findNodes', () => {
    test('should find nodes by type', () => {
      const fileNodes = findNodes(mockTreeData, (node) => node.data?.type === "file")
      expect(fileNodes).toHaveLength(3)
      expect(fileNodes.map(n => n.node.id)).toEqual(["child1-1", "grandchild1-2-1", 'root2'])
    })

    test('should find nodes by size', () => {
      const smallFiles = findNodes(mockTreeData, (node) => node.data?.type === "file" && (node.data?.size || 0) < 300)
      expect(smallFiles).toHaveLength(2)
      expect(smallFiles.map(n => n.node.id)).toEqual(["child1-1", "grandchild1-2-1"])
    })

    test('should find nodes by path depth', () => {
      const deepNodes = findNodes(mockTreeData, (node, path) => path.length >= 3)
      expect(deepNodes).toHaveLength(1)
      expect(deepNodes[0].node.id).toBe("grandchild1-2-1")
    })

    test('should return empty array when no matches', () => {
      const noMatches = findNodes(mockTreeData, (node) => node.data?.type === "nonexistent")
      expect(noMatches).toHaveLength(0)
    })
  })

  describe('getMaxDepth', () => {
    test('should return correct max depth for nested tree', () => {
      const maxDepth = getMaxDepth(mockTreeData)
      expect(maxDepth).toBe(3) // root1 -> child1-2 -> grandchild1-2-1
    })

    test('should return 1 for tree with only root nodes', () => {
      const flatTree: TreeViewData = {
        nodes: [
          { id: "a", label: "A" },
          { id: "b", label: "B" }
        ]
      }
      const maxDepth = getMaxDepth(flatTree)
      expect(maxDepth).toBe(1)
    })

    test('should return 0 for empty tree', () => {
      const emptyTree: TreeViewData = { nodes: [] }
      const maxDepth = getMaxDepth(emptyTree)
      expect(maxDepth).toBe(0)
    })
  })
})