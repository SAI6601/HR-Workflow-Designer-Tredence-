/**
 * StartNode.tsx — React Flow custom node for workflow entry point.
 */

import type { NodeProps } from '@xyflow/react';
import type { WorkflowNode, StartNodeData, ValidationError } from '../../types/workflow';
import { BaseNode } from './BaseNode';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';

export function StartNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { validationErrors } = useWorkflowStore();
  const nodeData = data as StartNodeData;
  const errors: ValidationError[] = validationErrors.filter((e) => e.nodeId === id);

  const metaCount = Object.keys(nodeData.metadata || {}).length;

  return (
    <BaseNode
      nodeType="start"
      title={nodeData.title}
      subtitle={metaCount > 0 ? `${metaCount} metadata field${metaCount > 1 ? 's' : ''}` : undefined}
      selected={selected}
      validationErrors={errors}
      showTargetHandle={false}
      showSourceHandle={true}
    />
  );
}
