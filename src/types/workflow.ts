/**
 * workflow.ts — Core TypeScript type definitions for the HR Workflow Designer.
 * 
 * Strict discriminated unions for node data ensure type safety throughout the app.
 * Every node carries a `type` discriminant that determines which form fields
 * are rendered and how the node is validated / simulated.
 */

import type { Node, Edge } from '@xyflow/react';

// ─── Node Data Types ───────────────────────────────────────────────────────────

/** Start Node: workflow entry point */
export interface StartNodeData extends Record<string, unknown> {
  type: 'start';
  title: string;
  metadata: Record<string, string>;
}

/** Task Node: human task (e.g., collect documents) */
export interface TaskNodeData extends Record<string, unknown> {
  type: 'task';
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: Record<string, string>;
}

/** Approval Node: manager / HR approval step */
export interface ApprovalNodeData extends Record<string, unknown> {
  type: 'approval';
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
}

/** Automated Step Node: system-triggered action */
export interface AutomatedStepNodeData extends Record<string, unknown> {
  type: 'automated';
  title: string;
  actionId: string;
  actionParams: Record<string, string>;
}

/** End Node: workflow completion */
export interface EndNodeData extends Record<string, unknown> {
  type: 'end';
  endMessage: string;
  showSummary: boolean;
}

/** Condition Node: decision logic */
export interface ConditionNodeData extends Record<string, unknown> {
  type: 'condition';
  title: string;
  conditionField: string;
  conditionOperator: string;
  conditionValue: string;
}

/** Email Node: automated email notification */
export interface EmailNodeData extends Record<string, unknown> {
  type: 'email';
  title: string;
  recipient: string;
  subject: string;
  body: string;
}

/** Timer Node: pause workflow */
export interface TimerNodeData extends Record<string, unknown> {
  type: 'timer';
  title: string;
  duration: number;
  unit: 'minutes' | 'hours' | 'days';
}

/** Discriminated union of all node data shapes */
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData
  | ConditionNodeData
  | EmailNodeData
  | TimerNodeData;

/** The concrete Node type used throughout the app */
export type WorkflowNode = Node<WorkflowNodeData>;

/** Re-export Edge for convenience */
export type WorkflowEdge = Edge;

// ─── Node Type Constants ───────────────────────────────────────────────────────

export const NODE_TYPES = ['start', 'task', 'approval', 'condition', 'timer', 'email', 'automated', 'end'] as const;
export type NodeType = (typeof NODE_TYPES)[number];

/** Human-readable labels for each node type */
export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  condition: 'Condition',
  timer: 'Timer',
  email: 'Email',
  automated: 'Automated Step',
  end: 'End',
};

/** Color scheme per node type (Tailwind-compatible) */
export const NODE_TYPE_COLORS: Record<NodeType, { bg: string; border: string; text: string; icon: string }> = {
  start:     { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '#10b981' },
  task:      { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: '#3b82f6' },
  approval:  { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '#f59e0b' },
  condition: { bg: '#fdf4ff', border: '#d946ef', text: '#86198f', icon: '#d946ef' },
  timer:     { bg: '#fff7ed', border: '#f97316', text: '#9a3412', icon: '#f97316' },
  email:     { bg: '#f0fdfa', border: '#14b8a6', text: '#0f766e', icon: '#14b8a6' },
  automated: { bg: '#f5f3ff', border: '#8b5cf6', text: '#5b21b6', icon: '#8b5cf6' },
  end:       { bg: '#fff1f2', border: '#f43f5e', text: '#9f1239', icon: '#f43f5e' },
};

/** SVG icon paths for each node type */
export const NODE_TYPE_ICONS: Record<NodeType, string> = {
  start:     'M8 5v14l11-7z',                                           // Play
  task:      'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', // Clipboard
  approval:  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', // Shield check
  condition: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', // Switch arrows
  timer:     'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', // Clock
  email:     'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', // Mail
  automated: 'M13 10V3L4 14h7v7l9-11h-7z',                             // Lightning bolt
  end:       'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM10 10h4v4h-4z',       // Stop
};

// ─── Mock API Types ────────────────────────────────────────────────────────────

/** An automated action returned by the mock API */
export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

// ─── Simulation Types ──────────────────────────────────────────────────────────

export type StepStatus = 'pending' | 'running' | 'success' | 'warning' | 'error' | 'skipped';

export interface SimulationStep {
  nodeId: string;
  nodeTitle: string;
  nodeType: NodeType;
  status: StepStatus;
  message: string;
  timestamp: string;
  durationMs: number;
}

export interface SimulationResult {
  success: boolean;
  totalDurationMs: number;
  steps: SimulationStep[];
  errors: string[];
}

// ─── Validation Types ──────────────────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationError {
  nodeId: string;
  message: string;
  severity: ValidationSeverity;
}

// ─── Workflow Snapshot (for undo / redo / export) ──────────────────────────────

export interface WorkflowSnapshot {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

// ─── Default Data Factories ────────────────────────────────────────────────────

export function createDefaultNodeData(type: NodeType): WorkflowNodeData {
  switch (type) {
    case 'start':
      return { type: 'start', title: 'Start', metadata: {} };
    case 'task':
      return { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: {} };
    case 'approval':
      return { type: 'approval', title: 'Pending Approval', approverRole: 'Manager', autoApproveThreshold: 0 };
    case 'condition':
      return { type: 'condition', title: 'Decision', conditionField: '', conditionOperator: 'equals', conditionValue: '' };
    case 'timer':
      return { type: 'timer', title: 'Wait Period', duration: 1, unit: 'days' };
    case 'email':
      return { type: 'email', title: 'Send Notification', recipient: '', subject: '', body: '' };
    case 'automated':
      return { type: 'automated', title: 'System Action', actionId: '', actionParams: {} };
    case 'end':
      return { type: 'end', endMessage: 'Workflow completed.', showSummary: true };
  }
}
