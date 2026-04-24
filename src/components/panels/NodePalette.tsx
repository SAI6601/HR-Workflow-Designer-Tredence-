/**
 * NodePalette.tsx — Left sidebar with draggable node cards.
 * 
 * Users drag nodes from here onto the canvas. Also contains
 * toolbar actions for undo/redo, export/import, and simulation.
 */

import React, { useCallback } from 'react';
import { NODE_TYPES, NODE_TYPE_LABELS, NODE_TYPE_COLORS, NODE_TYPE_ICONS, type NodeType } from '../../types/workflow';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { exportWorkflow, importWorkflow } from '../../utils/serialization';

const NODE_DESCRIPTIONS: Record<NodeType, string> = {
  start: 'Workflow entry point',
  task: 'Human task step',
  approval: 'Manager/HR approval',
  automated: 'System-triggered action',
  end: 'Workflow completion',
};

interface NodePaletteProps {
  onOpenSimulation: () => void;
}

export function NodePalette({ onOpenSimulation }: NodePaletteProps) {
  const { undo, redo, canUndo, canRedo, getSnapshot, loadSnapshot, runValidation } = useWorkflowStore();

  const onDragStart = useCallback((event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleExport = useCallback(() => {
    const snapshot = getSnapshot();
    exportWorkflow(snapshot);
  }, [getSnapshot]);

  const handleImport = useCallback(async () => {
    try {
      const snapshot = await importWorkflow();
      loadSnapshot(snapshot);
    } catch (err) {
      console.error('Import failed:', err);
    }
  }, [loadSnapshot]);

  const handleValidate = useCallback(() => {
    const errors = runValidation();
    if (errors.length === 0) {
      alert('✅ Workflow is valid!');
    }
  }, [runValidation]);

  return (
    <aside className="node-palette" id="node-palette">
      {/* Header */}
      <div className="node-palette-header">
        <div className="node-palette-logo">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="14" fill="#6366f1"/>
            <path d="M18 20h8v4H18zM26 24h12v4H26zM38 20h8v4H38zM22 32h20v4H22zM18 40h8v4H18zM38 40h8v4H38zM26 36h12v4H26z" fill="white" opacity="0.9"/>
            <circle cx="32" cy="32" r="4" fill="white"/>
          </svg>
          <div>
            <h1 className="node-palette-title">HR Workflow</h1>
            <p className="node-palette-subtitle">Designer</p>
          </div>
        </div>
      </div>

      {/* Node cards */}
      <div className="node-palette-section">
        <h2 className="node-palette-section-title">Components</h2>
        <p className="node-palette-section-desc">Drag onto the canvas</p>

        <div className="node-palette-cards">
          {NODE_TYPES.map((type) => {
            const colors = NODE_TYPE_COLORS[type];
            const iconPath = NODE_TYPE_ICONS[type];
            return (
              <div
                key={type}
                className="palette-card"
                draggable
                onDragStart={(e) => onDragStart(e, type)}
                style={{ '--card-accent': colors.border } as React.CSSProperties}
              >
                <div className="palette-card-icon" style={{ background: colors.bg, color: colors.icon }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={iconPath} />
                  </svg>
                </div>
                <div className="palette-card-text">
                  <span className="palette-card-label">{NODE_TYPE_LABELS[type]}</span>
                  <span className="palette-card-desc">{NODE_DESCRIPTIONS[type]}</span>
                </div>
                <div className="palette-card-drag">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
                    <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                    <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="node-palette-section node-palette-toolbar">
        <h2 className="node-palette-section-title">Actions</h2>

        <div className="toolbar-grid">
          <button className="toolbar-btn" onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" id="btn-undo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            <span>Undo</span>
          </button>
          <button className="toolbar-btn" onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" id="btn-redo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/></svg>
            <span>Redo</span>
          </button>
          <button className="toolbar-btn" onClick={handleExport} title="Export workflow JSON" id="btn-export">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Export</span>
          </button>
          <button className="toolbar-btn" onClick={handleImport} title="Import workflow JSON" id="btn-import">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Import</span>
          </button>
          <button className="toolbar-btn" onClick={handleValidate} title="Validate workflow" id="btn-validate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Validate</span>
          </button>
          <button className="toolbar-btn toolbar-btn--primary" onClick={onOpenSimulation} title="Test workflow simulation" id="btn-simulate">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Simulate</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
