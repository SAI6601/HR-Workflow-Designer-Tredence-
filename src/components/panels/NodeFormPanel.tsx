/**
 * NodeFormPanel.tsx — Right-side panel that dynamically renders
 * configuration forms based on the selected node type.
 */

import { useCallback, useMemo } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { WorkflowNodeData, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedStepNodeData, EndNodeData, ConditionNodeData, EmailNodeData, TimerNodeData } from '../../types/workflow';
import { NODE_TYPE_LABELS, NODE_TYPE_COLORS, NODE_TYPE_ICONS, type NodeType } from '../../types/workflow';
import { StartNodeForm } from './forms/StartNodeForm';
import { TaskNodeForm } from './forms/TaskNodeForm';
import { ApprovalNodeForm } from './forms/ApprovalNodeForm';
import { AutomatedStepForm } from './forms/AutomatedStepForm';
import { EndNodeForm } from './forms/EndNodeForm';
import { ConditionNodeForm } from './forms/ConditionNodeForm';
import { EmailNodeForm } from './forms/EmailNodeForm';
import { TimerNodeForm } from './forms/TimerNodeForm';

export function NodeFormPanel() {
  const { nodes, selectedNodeId, updateNodeData, setSelectedNode, deleteSelected, pushSnapshot, validationErrors } = useWorkflowStore();

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const nodeErrors = useMemo(
    () => validationErrors.filter((e) => e.nodeId === selectedNodeId),
    [validationErrors, selectedNodeId]
  );

  const handleChange = useCallback(
    (updates: Partial<WorkflowNodeData>) => {
      if (selectedNodeId) {
        updateNodeData(selectedNodeId, updates);
      }
    },
    [selectedNodeId, updateNodeData]
  );

  const handleSaveSnapshot = useCallback(() => {
    pushSnapshot();
  }, [pushSnapshot]);

  const handleDelete = useCallback(() => {
    deleteSelected();
    setSelectedNode(null);
  }, [deleteSelected, setSelectedNode]);

  if (!selectedNode) {
    return (
      <aside className="form-panel form-panel--empty" id="form-panel">
        <div className="form-panel-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.25">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
          <p className="form-panel-empty-title">No node selected</p>
          <p className="form-panel-empty-desc">Click on a node in the canvas to edit its configuration.</p>
        </div>
      </aside>
    );
  }

  const data = selectedNode.data as WorkflowNodeData;
  const nodeType = data.type as NodeType;
  const colors = NODE_TYPE_COLORS[nodeType];
  const iconPath = NODE_TYPE_ICONS[nodeType];

  return (
    <aside className="form-panel" id="form-panel">
      {/* Header */}
      <div className="form-panel-header" style={{ borderBottomColor: colors.border }}>
        <div className="form-panel-header-top">
          <div className="form-panel-node-icon" style={{ background: colors.bg, color: colors.icon }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={iconPath} />
            </svg>
          </div>
          <div>
            <h2 className="form-panel-title">{NODE_TYPE_LABELS[nodeType]} Node</h2>
            <p className="form-panel-id">ID: {selectedNode.id.slice(0, 12)}…</p>
          </div>
          <button
            className="form-panel-close"
            onClick={() => setSelectedNode(null)}
            title="Close panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* Validation errors */}
      {nodeErrors.length > 0 && (
        <div className="form-panel-errors">
          {nodeErrors.map((err, i) => (
            <div key={i} className={`form-panel-error form-panel-error--${err.severity}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {err.severity === 'error'
                  ? <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
                  : <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>
                }
              </svg>
              <span>{err.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Form body */}
      <div className="form-panel-body" onBlur={handleSaveSnapshot}>
        {nodeType === 'start' && <StartNodeForm data={data as StartNodeData} onChange={handleChange} />}
        {nodeType === 'task' && <TaskNodeForm data={data as TaskNodeData} onChange={handleChange} />}
        {nodeType === 'approval' && <ApprovalNodeForm data={data as ApprovalNodeData} onChange={handleChange} />}
        {nodeType === 'condition' && <ConditionNodeForm data={data as ConditionNodeData} onChange={handleChange} />}
        {nodeType === 'email' && <EmailNodeForm data={data as EmailNodeData} onChange={handleChange} />}
        {nodeType === 'timer' && <TimerNodeForm data={data as TimerNodeData} onChange={handleChange} />}
        {nodeType === 'automated' && <AutomatedStepForm data={data as AutomatedStepNodeData} onChange={handleChange} />}
        {nodeType === 'end' && <EndNodeForm data={data as EndNodeData} onChange={handleChange} />}
      </div>

      {/* Footer */}
      <div className="form-panel-footer">
        <button className="form-btn-delete" onClick={handleDelete} id="btn-delete-node">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Delete Node
        </button>
      </div>
    </aside>
  );
}
