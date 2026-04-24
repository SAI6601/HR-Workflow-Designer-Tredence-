/**
 * App.tsx — Root application component.
 * 
 * Three-column layout: NodePalette (left), WorkflowCanvas (center), NodeFormPanel (right).
 * Also manages the simulation panel modal state and keyboard shortcuts.
 */

import { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { WorkflowProvider, useWorkflowStore } from './hooks/useWorkflowStore';
import { NodePalette } from './components/panels/NodePalette';
import { NodeFormPanel } from './components/panels/NodeFormPanel';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';

function AppInner() {
  const [simulationOpen, setSimulationOpen] = useState(false);
  const { undo, redo, selectedNodeId } = useWorkflowStore();

  // Global keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }
    },
    [undo, redo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app-layout">
      <NodePalette onOpenSimulation={() => setSimulationOpen(true)} />
      <main className="app-canvas-area">
        <WorkflowCanvas />
      </main>
      <NodeFormPanel key={selectedNodeId} />
      <SimulationPanel isOpen={simulationOpen} onClose={() => setSimulationOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowProvider>
        <AppInner />
      </WorkflowProvider>
    </ReactFlowProvider>
  );
}
