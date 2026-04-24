/**
 * EndNode.tsx — React Flow custom node for workflow completion.
 */

import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode, EndNodeData, ValidationError } from '../../types/workflow';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export function EndNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const nodeData = data as EndNodeData;
  const errors: ValidationError[] = validationErrors.filter((e) => e.nodeId === id);

  return (
    <BaseNode
      nodeType="end"
      title={nodeData.endMessage || 'End'}
      selected={selected}
      validationErrors={errors}
      showSourceHandle={false}
      showTargetHandle={true}
    >
      {nodeData.showSummary && (
        <div className="workflow-node-meta">
          <span className="workflow-node-tag workflow-node-tag--success">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            Summary enabled
          </span>
        </div>
      )}
    </BaseNode>
  );
}
