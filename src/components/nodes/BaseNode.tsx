/**
 * BaseNode.tsx — Shared wrapper for all custom workflow nodes.
 * 
 * Provides consistent styling, validation error display,
 * selection highlight, and handle placement.
 */

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeType, ValidationError } from '../../types/workflow';
import { NODE_TYPE_COLORS, NODE_TYPE_LABELS, NODE_TYPE_ICONS } from '../../types/workflow';

interface BaseNodeProps {
  nodeType: NodeType;
  title: string;
  subtitle?: string;
  selected?: boolean;
  validationErrors?: ValidationError[];
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  children?: React.ReactNode;
}

export function BaseNode({
  nodeType,
  title,
  subtitle,
  selected,
  validationErrors = [],
  showSourceHandle = true,
  showTargetHandle = true,
  children,
}: BaseNodeProps) {
  const colors = NODE_TYPE_COLORS[nodeType];
  const iconPath = NODE_TYPE_ICONS[nodeType];
  const label = NODE_TYPE_LABELS[nodeType];
  const hasErrors = validationErrors.some((e) => e.severity === 'error');
  const hasWarnings = validationErrors.some((e) => e.severity === 'warning');

  return (
    <div
      className="workflow-node"
      style={{
        borderColor: hasErrors ? '#ef4444' : hasWarnings ? '#f59e0b' : selected ? colors.border : 'var(--color-border)',
        background: 'var(--color-surface)',
        boxShadow: selected
          ? `0 0 0 2px ${colors.border}40, 0 8px 30px ${colors.border}30`
          : hasErrors
          ? '0 0 0 2px #ef444440, 0 8px 30px rgba(239,68,68,0.2)'
          : 'var(--shadow-md)',
        backgroundImage: `linear-gradient(to bottom right, var(--color-surface), rgba(255,255,255,0))`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Target Handle */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="workflow-handle"
          style={{ background: colors.border }}
        />
      )}

      {/* Header */}
      <div className="workflow-node-header" style={{ background: colors.bg }}>
        <div className="workflow-node-icon" style={{ color: colors.icon }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={iconPath} />
          </svg>
        </div>
        <div className="workflow-node-header-text">
          <span className="workflow-node-type" style={{ color: colors.text }}>{label}</span>
          <span className="workflow-node-title">{title || 'Untitled'}</span>
        </div>

        {/* Validation badge */}
        {(hasErrors || hasWarnings) && (
          <div
            className="workflow-node-badge"
            style={{ background: hasErrors ? '#ef4444' : '#f59e0b' }}
            title={validationErrors.map((e) => e.message).join('\n')}
          >
            {validationErrors.length}
          </div>
        )}
      </div>

      {/* Body */}
      {(subtitle || children) && (
        <div className="workflow-node-body">
          {subtitle && <p className="workflow-node-subtitle">{subtitle}</p>}
          {children}
        </div>
      )}

      {/* Source Handle */}
      {showSourceHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="workflow-handle"
          style={{ background: colors.border }}
        />
      )}
    </div>
  );
}
