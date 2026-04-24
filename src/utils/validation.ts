/**
 * validation.ts — Graph validation utilities for the HR Workflow Designer.
 * 
 * Performs structural and content validation on the workflow graph,
 * returning an array of ValidationError objects that are displayed
 * directly on nodes as visual indicators.
 */

import type { WorkflowNode, WorkflowEdge, ValidationError, WorkflowNodeData } from '../types/workflow';

/**
 * Detect cycles in the workflow graph using DFS.
 * Returns true if a cycle is found.
 */
function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) || [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  nodes.forEach((n) => color.set(n.id, WHITE));

  function dfs(nodeId: string): boolean {
    color.set(nodeId, GRAY);
    const neighbors = adjacency.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (color.get(neighbor) === GRAY) return true;
      if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
    }
    color.set(nodeId, BLACK);
    return false;
  }

  for (const node of nodes) {
    if (color.get(node.id) === WHITE && dfs(node.id)) return true;
  }
  return false;
}

/**
 * Find all nodes reachable from a given start node using BFS.
 */
function getReachableNodes(startId: string, edges: WorkflowEdge[]): Set<string> {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) || [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const visited = new Set<string>();
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    const neighbors = adjacency.get(current) || [];
    for (const n of neighbors) {
      if (!visited.has(n)) queue.push(n);
    }
  }
  return visited;
}

/**
 * Validate the entire workflow graph.
 * Returns an array of validation errors (empty = valid).
 */
export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // ─── Structural Checks ────────────────────────────────────────────────────

  // Must have exactly one Start node
  const startNodes = nodes.filter((n) => (n.data as WorkflowNodeData).type === 'start');
  if (startNodes.length === 0) {
    errors.push({ nodeId: '__global__', message: 'Workflow must have a Start node.', severity: 'error' });
  } else if (startNodes.length > 1) {
    startNodes.forEach((n) =>
      errors.push({ nodeId: n.id, message: 'Only one Start node is allowed.', severity: 'error' })
    );
  }

  // Must have exactly one End node
  const endNodes = nodes.filter((n) => (n.data as WorkflowNodeData).type === 'end');
  if (endNodes.length === 0) {
    errors.push({ nodeId: '__global__', message: 'Workflow must have an End node.', severity: 'error' });
  } else if (endNodes.length > 1) {
    endNodes.forEach((n) =>
      errors.push({ nodeId: n.id, message: 'Only one End node is allowed.', severity: 'error' })
    );
  }

  // Start node must have no incoming edges
  for (const start of startNodes) {
    const hasIncoming = edges.some((e) => e.target === start.id);
    if (hasIncoming) {
      errors.push({ nodeId: start.id, message: 'Start node must not have incoming connections.', severity: 'error' });
    }
  }

  // End node must have no outgoing edges
  for (const end of endNodes) {
    const hasOutgoing = edges.some((e) => e.source === end.id);
    if (hasOutgoing) {
      errors.push({ nodeId: end.id, message: 'End node must not have outgoing connections.', severity: 'error' });
    }
  }

  // Check for cycles
  if (hasCycle(nodes, edges)) {
    errors.push({ nodeId: '__global__', message: 'Workflow contains a cycle.', severity: 'error' });
  }

  // Check reachability from Start
  if (startNodes.length === 1) {
    const reachable = getReachableNodes(startNodes[0].id, edges);
    for (const node of nodes) {
      if (!reachable.has(node.id)) {
        errors.push({
          nodeId: node.id,
          message: 'Node is not reachable from the Start node.',
          severity: 'warning',
        });
      }
    }
  }

  // Check orphan nodes (no connections at all)
  for (const node of nodes) {
    const data = node.data as WorkflowNodeData;
    const hasAnyEdge = edges.some((e) => e.source === node.id || e.target === node.id);
    if (!hasAnyEdge && nodes.length > 1) {
      errors.push({
        nodeId: node.id,
        message: `"${data.type}" node has no connections.`,
        severity: 'warning',
      });
    }
  }

  // ─── Content Checks ──────────────────────────────────────────────────────

  for (const node of nodes) {
    const data = node.data as WorkflowNodeData;

    switch (data.type) {
      case 'task':
        if (!data.title.trim()) {
          errors.push({ nodeId: node.id, message: 'Task node requires a title.', severity: 'error' });
        }
        break;
      case 'approval':
        if (!data.title.trim()) {
          errors.push({ nodeId: node.id, message: 'Approval node requires a title.', severity: 'error' });
        }
        break;
      case 'automated':
        if (!data.actionId) {
          errors.push({ nodeId: node.id, message: 'Automated step requires an action.', severity: 'warning' });
        }
        break;
    }
  }

  return errors;
}
