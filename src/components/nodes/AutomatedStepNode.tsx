/**
 * AutomatedStepNode.tsx — React Flow custom node for system-triggered actions.
 */

import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode, AutomatedStepNodeData, ValidationError } from '../../types/workflow';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export function AutomatedStepNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const nodeData = data as AutomatedStepNodeData;
  const errors: ValidationError[] = validationErrors.filter((e) => e.nodeId === id);

  const paramCount = Object.keys(nodeData.actionParams || {}).length;

  return (
    <BaseNode
      nodeType="automated"
      title={nodeData.title}
      subtitle={nodeData.actionId ? `Action: ${nodeData.actionId}` : 'No action configured'}
      selected={selected}
      validationErrors={errors}
    >
      {paramCount > 0 && (
        <div className="workflow-node-meta">
          <span className="workflow-node-tag workflow-node-tag--purple">
            {paramCount} param{paramCount > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </BaseNode>
  );
}
