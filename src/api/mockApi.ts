/**
 * mockApi.ts — Lightweight mock API layer for the HR Workflow Designer.
 * 
 * Simulates network latency with setTimeout. No external server required.
 * Provides two endpoints:
 *   - getAutomations() → list of available automated actions
 *   - simulateWorkflow() → step-by-step execution simulation
 */

import type {
  AutomationAction,
  SimulationResult,
  SimulationStep,
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeData,
  NodeType,
} from '../types/workflow';

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email',          label: 'Send Email',              params: ['to', 'subject', 'body'] },
  { id: 'generate_doc',        label: 'Generate Document',       params: ['template', 'recipient', 'format'] },
  { id: 'update_record',       label: 'Update HR Record',        params: ['employeeId', 'field', 'value'] },
  { id: 'notify_slack',        label: 'Send Slack Notification', params: ['channel', 'message'] },
  { id: 'trigger_onboarding',  label: 'Trigger Onboarding Flow', params: ['employeeId', 'department'] },
  { id: 'schedule_meeting',    label: 'Schedule Meeting',        params: ['attendees', 'date', 'duration'] },
  { id: 'run_background_check',label: 'Run Background Check',    params: ['candidateId', 'checkType'] },
];

// ─── Helper ────────────────────────────────────────────────────────────────────

/** Simulate network latency */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Generate a realistic-looking ISO timestamp offset from a base */
function offsetTimestamp(base: Date, offsetMs: number): string {
  return new Date(base.getTime() + offsetMs).toISOString();
}

/** Get the title from any node data shape */
function getNodeTitle(data: WorkflowNodeData): string {
  if (data.type === 'end') return data.endMessage || 'End';
  return data.title || data.type.charAt(0).toUpperCase() + data.type.slice(1);
}

// ─── API Endpoints ─────────────────────────────────────────────────────────────

/**
 * GET /automations
 * Returns all available automated actions.
 */
export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300 + Math.random() * 200);
  return [...MOCK_AUTOMATIONS];
}

/**
 * POST /simulate
 * Accepts a serialized workflow (nodes + edges) and returns a mock
 * step-by-step execution result.
 * 
 * The simulation performs a topological traversal from the Start node,
 * generating realistic execution steps.
 */
export async function simulateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): Promise<SimulationResult> {
  await delay(800 + Math.random() * 400);

  const errors: string[] = [];
  const steps: SimulationStep[] = [];
  const baseTime = new Date();
  let elapsed = 0;

  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) || [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  // Find start node
  const startNode = nodes.find((n) => (n.data as WorkflowNodeData).type === 'start');
  if (!startNode) {
    return { success: false, totalDurationMs: 0, steps: [], errors: ['No Start node found in workflow.'] };
  }

  // BFS traversal
  const visited = new Set<string>();
  const queue: string[] = [startNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const node = nodes.find((n) => n.id === currentId);
    if (!node) continue;

    const data = node.data as WorkflowNodeData;
    const stepDuration = 200 + Math.floor(Math.random() * 800);

    // Simulate random outcomes
    let status: SimulationStep['status'] = 'success';
    let message = '';

    switch (data.type) {
      case 'start':
        message = 'Workflow execution started.';
        break;
      case 'task':
        message = `Task "${data.title || 'Untitled'}" assigned to ${data.assignee || 'unassigned'}.`;
        if (!data.title) { status = 'warning'; message += ' Warning: Task has no title.'; }
        break;
      case 'approval':
        message = `Approval requested from ${data.approverRole || 'Manager'}.`;
        if (data.autoApproveThreshold > 0) {
          message += ` Auto-approved (threshold: ${data.autoApproveThreshold}).`;
        }
        break;
      case 'automated':
        if (!data.actionId) {
          status = 'error';
          message = 'Automated step has no action configured.';
          errors.push(`Node "${currentId}": No action configured.`);
        } else {
          const action = MOCK_AUTOMATIONS.find((a) => a.id === data.actionId);
          message = `Executed "${action?.label || data.actionId}" successfully.`;
        }
        break;
      case 'end':
        message = data.endMessage || 'Workflow completed.';
        break;
    }

    steps.push({
      nodeId: currentId,
      nodeTitle: getNodeTitle(data),
      nodeType: data.type as NodeType,
      status,
      message,
      timestamp: offsetTimestamp(baseTime, elapsed),
      durationMs: stepDuration,
    });

    elapsed += stepDuration;

    // Enqueue children
    const children = adjacency.get(currentId) || [];
    for (const childId of children) {
      if (!visited.has(childId)) queue.push(childId);
    }
  }

  // Check for unreachable nodes
  const unreachable = nodes.filter((n) => !visited.has(n.id));
  for (const n of unreachable) {
    const data = n.data as WorkflowNodeData;
    errors.push(`Node "${getNodeTitle(data)}" (${n.id}) is not reachable from Start.`);
    steps.push({
      nodeId: n.id,
      nodeTitle: getNodeTitle(data),
      nodeType: data.type as NodeType,
      status: 'skipped',
      message: 'Node is unreachable — skipped.',
      timestamp: offsetTimestamp(baseTime, elapsed),
      durationMs: 0,
    });
  }

  return {
    success: errors.length === 0,
    totalDurationMs: elapsed,
    steps,
    errors,
  };
}
