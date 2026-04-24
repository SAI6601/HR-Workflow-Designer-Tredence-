import { BaseNode } from './BaseNode';
import type { NodeProps } from '@xyflow/react';
import type { ConditionNodeData } from '../../types/workflow';

export function ConditionNode({ data, selected }: NodeProps<import('@xyflow/react').Node<ConditionNodeData>>) {
  return (
    <BaseNode
      nodeType="condition"
      title={data.title}
      subtitle={`If ${data.conditionField || '?'} ${data.conditionOperator} ${data.conditionValue || '?'}`}
      selected={selected}
    />
  );
}
