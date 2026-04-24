import { BaseNode } from './BaseNode';
import type { NodeProps } from '@xyflow/react';
import type { TimerNodeData } from '../../types/workflow';

export function TimerNode({ data, selected }: NodeProps<import('@xyflow/react').Node<TimerNodeData>>) {
  return (
    <BaseNode
      nodeType="timer"
      title={data.title}
      subtitle={`Wait for ${data.duration} ${data.unit}`}
      selected={selected}
    />
  );
}
