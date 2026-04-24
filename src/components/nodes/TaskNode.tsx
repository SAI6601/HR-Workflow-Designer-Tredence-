/**
 * TaskNode.tsx — React Flow custom node for human tasks.
 */

import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode, TaskNodeData, ValidationError } from '../../types/workflow';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export function TaskNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const nodeData = data as TaskNodeData;
  const errors: ValidationError[] = validationErrors.filter((e) => e.nodeId === id);

  return (
    <BaseNode
      nodeType="task"
      title={nodeData.title}
      subtitle={nodeData.description || undefined}
      selected={selected}
      validationErrors={errors}
    >
      <div className="workflow-node-meta">
        {nodeData.assignee && (
          <span className="workflow-node-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {nodeData.assignee}
          </span>
        )}
        {nodeData.dueDate && (
          <span className="workflow-node-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {nodeData.dueDate}
          </span>
        )}
      </div>
    </BaseNode>
  );
}
