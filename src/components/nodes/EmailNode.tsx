import { BaseNode } from './BaseNode';
import type { NodeProps } from '@xyflow/react';
import type { EmailNodeData } from '../../types/workflow';

export function EmailNode({ data, selected }: NodeProps<import('@xyflow/react').Node<EmailNodeData>>) {
  return (
    <BaseNode
      nodeType="email"
      title={data.title}
      subtitle={`To: ${data.recipient || 'Unspecified'}`}
      selected={selected}
    />
  );
}
