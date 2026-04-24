/**
 * ApprovalNode.tsx — React Flow custom node for approval steps.
 */

import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode, ApprovalNodeData, ValidationError } from '../../types/workflow';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export function ApprovalNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const nodeData = data as ApprovalNodeData;
  const errors: ValidationError[] = validationErrors.filter((e) => e.nodeId === id);

  return (
    <BaseNode
      nodeType="approval"
      title={nodeData.title}
      selected={selected}
      validationErrors={errors}
    >
      <div className="workflow-node-meta">
        <span className="workflow-node-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
          {nodeData.approverRole || 'Manager'}
        </span>
        {nodeData.autoApproveThreshold > 0 && (
          <span className="workflow-node-tag workflow-node-tag--success">
            Auto ≤{nodeData.autoApproveThreshold}
          </span>
        )}
      </div>
    </BaseNode>
  );
}
