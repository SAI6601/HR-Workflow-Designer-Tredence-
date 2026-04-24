/**
 * useWorkflowStore.ts — Central workflow state management via React Context.
 * 
 * Manages nodes, edges, selection, undo/redo history, and validation.
 * Provides a single context for all workflow operations.
 */

import React, { createContext, useContext, useCallback, useRef, useState, useMemo } from 'react';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as rfAddEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeData,
  WorkflowSnapshot,
  ValidationError,
  NodeType,
} from '../types/workflow';
import { createDefaultNodeData } from '../types/workflow';
import { validateWorkflow } from '../utils/validation';

// ─── Store Shape ───────────────────────────────────────────────────────────────

interface WorkflowStore {
  // State
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];

  // React Flow callbacks
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // CRUD
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteSelected: () => void;
  setSelectedNode: (nodeId: string | null) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  pushSnapshot: () => void;

  // Import / Export helpers
  getSnapshot: () => WorkflowSnapshot;
  loadSnapshot: (snapshot: WorkflowSnapshot) => void;

  // Validation
  runValidation: () => ValidationError[];
}

const WorkflowContext = createContext<WorkflowStore | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

const MAX_HISTORY = 50;

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Undo / Redo stacks
  const pastRef = useRef<WorkflowSnapshot[]>([]);
  const futureRef = useRef<WorkflowSnapshot[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0); // trigger re-renders

  const pushSnapshot = useCallback(() => {
    pastRef.current.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
    if (pastRef.current.length > MAX_HISTORY) pastRef.current.shift();
    futureRef.current = [];
    setHistoryVersion((v) => v + 1);
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const prev = pastRef.current.pop()!;
    futureRef.current.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setHistoryVersion((v) => v + 1);
  }, [nodes, edges]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop()!;
    pastRef.current.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
    setNodes(next.nodes);
    setEdges(next.edges);
    setHistoryVersion((v) => v + 1);
  }, [nodes, edges]);

  // React Flow change handlers
  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);

      // Track selection
      for (const change of changes) {
        if (change.type === 'select' && change.selected) {
          setSelectedNodeId(change.id);
        }
      }
    },
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as WorkflowEdge[]);
    },
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      pushSnapshot();
      setEdges((eds) =>
        rfAddEdge(
          {
            ...connection,
            id: `e-${uuidv4()}`,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          },
          eds
        ) as WorkflowEdge[]
      );
    },
    [pushSnapshot]
  );

  // Add a new node
  const addNode = useCallback(
    (type: NodeType, position: { x: number; y: number }) => {
      pushSnapshot();
      const newNode: WorkflowNode = {
        id: `node-${uuidv4()}`,
        type,
        position,
        data: createDefaultNodeData(type),
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [pushSnapshot]
  );

  // Update a node's data (partial merge)
  const updateNodeData = useCallback(
    (nodeId: string, updates: Partial<WorkflowNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n;
          return { ...n, data: { ...n.data, ...updates } as WorkflowNodeData };
        })
      );
    },
    []
  );

  // Delete selected nodes & edges
  const deleteSelected = useCallback(() => {
    pushSnapshot();
    setNodes((nds) => {
      const remaining = nds.filter((n) => !n.selected);
      const removedIds = new Set(nds.filter((n) => n.selected).map((n) => n.id));
      setEdges((eds) => eds.filter((e) => !removedIds.has(e.source) && !removedIds.has(e.target)));
      if (selectedNodeId && removedIds.has(selectedNodeId)) setSelectedNodeId(null);
      return remaining;
    });
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [pushSnapshot, selectedNodeId]);

  const setSelectedNode = useCallback((id: string | null) => {
    setSelectedNodeId(id);
    if (id) {
      setNodes((nds) => nds.map((n) => ({ ...n, selected: n.id === id })));
    }
  }, []);

  const getSnapshot = useCallback((): WorkflowSnapshot => {
    return { nodes: structuredClone(nodes), edges: structuredClone(edges) };
  }, [nodes, edges]);

  const loadSnapshot = useCallback((snapshot: WorkflowSnapshot) => {
    pushSnapshot();
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setSelectedNodeId(null);
  }, [pushSnapshot]);

  const runValidation = useCallback((): ValidationError[] => {
    const errs = validateWorkflow(nodes, edges);
    setValidationErrors(errs);
    return errs;
  }, [nodes, edges]);

  // Suppress the lint about historyVersion — it's intentional for re-render
  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;
  void historyVersion; // used to trigger re-render

  const value = useMemo<WorkflowStore>(
    () => ({
      nodes,
      edges,
      selectedNodeId,
      validationErrors,
      onNodesChange,
      onEdgesChange,
      onConnect,
      addNode,
      updateNodeData,
      deleteSelected,
      setSelectedNode,
      setNodes,
      setEdges,
      undo,
      redo,
      canUndo,
      canRedo,
      pushSnapshot,
      getSnapshot,
      loadSnapshot,
      runValidation,
    }),
    [
      nodes, edges, selectedNodeId, validationErrors,
      onNodesChange, onEdgesChange, onConnect,
      addNode, updateNodeData, deleteSelected, setSelectedNode,
      undo, redo, canUndo, canRedo, pushSnapshot,
      getSnapshot, loadSnapshot, runValidation,
    ]
  );

  return React.createElement(WorkflowContext.Provider, { value }, children);
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useWorkflowStore(): WorkflowStore {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflowStore must be used within WorkflowProvider');
  return ctx;
}
