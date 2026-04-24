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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const { undo, redo, selectedNodeId } = useWorkflowStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

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
    <div className={`app-layout ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <NodePalette 
        onOpenSimulation={() => setSimulationOpen(true)} 
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />
      <main className="app-canvas-area">
        <WorkflowCanvas isDarkMode={isDarkMode} />
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
