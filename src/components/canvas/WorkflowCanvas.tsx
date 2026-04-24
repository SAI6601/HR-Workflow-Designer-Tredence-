/**
 * WorkflowCanvas.tsx — The main React Flow canvas component.
 * 
 * Handles drag-and-drop from the sidebar, node/edge rendering,
 * keyboard shortcuts, and canvas controls.
 */

import { useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react';
import type { ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from '../nodes/nodeTypes';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import type { NodeType, WorkflowNodeData, WorkflowNode, WorkflowEdge } from '../../types/workflow';
import { NODE_TYPE_COLORS } from '../../types/workflow';

interface WorkflowCanvasProps {
  isDarkMode?: boolean;
}

export function WorkflowCanvas({ isDarkMode }: WorkflowCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
    deleteSelected,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const rfInstanceRef = useRef<ReactFlowInstance<WorkflowNode, WorkflowEdge> | null>(null);

  // Handle drop from sidebar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow-type') as NodeType;
      if (!type) return;

      const rfInstance = rfInstanceRef.current;
      if (!rfInstance || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(type, position);
    },
    [addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onInit = useCallback((instance: ReactFlowInstance<WorkflowNode, WorkflowEdge>) => {
    rfInstanceRef.current = instance;
  }, []);

  // Deselect when clicking on canvas background
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Keyboard shortcuts
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelected();
      }
    },
    [deleteSelected]
  );

  // MiniMap node color based on type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const miniMapNodeColor = useCallback((node: any) => {
    const data = node.data as WorkflowNodeData;
    return NODE_TYPE_COLORS[data.type]?.border || '#94a3b8';
  }, []);

  // Custom edge style
  const defaultEdgeOptions = useMemo(() => ({
    type: 'smoothstep',
    animated: true,
    className: 'animated',
    style: { strokeWidth: 2 },
  }), []);

  return (
    <div
      className="workflow-canvas-wrapper"
      ref={reactFlowWrapper}
      onKeyDown={onKeyDown}
      tabIndex={0}
      id="workflow-canvas"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          color={isDarkMode ? '#334155' : '#cbd5e1'} 
        />
        <Controls
          className="canvas-controls"
          showInteractive={false}
        />
        <MiniMap
          className="canvas-minimap"
          nodeColor={miniMapNodeColor}
          maskColor="rgba(255,255,255,0.7)"
          pannable
          zoomable
        />
      </ReactFlow>

      {/* Empty state overlay */}
      {nodes.length === 0 && (
        <div className="canvas-empty-state">
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            <line x1="10" y1="6.5" x2="14" y2="6.5"/><line x1="17.5" y1="10" x2="17.5" y2="14"/>
            <line x1="6.5" y1="10" x2="6.5" y2="14"/>
          </svg>
          <h3>Start building your workflow</h3>
          <p>Drag nodes from the sidebar onto the canvas, then connect them to define your HR process.</p>
        </div>
      )}
    </div>
  );
}
