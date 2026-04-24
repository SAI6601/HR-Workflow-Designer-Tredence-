/**
 * SimulationPanel.tsx — Modal panel for workflow testing / sandbox.
 * 
 * Serializes the workflow, validates it, sends it to the mock /simulate API,
 * and displays a step-by-step execution timeline.
 */

import { useState, useCallback } from 'react';
import { useWorkflowStore } from '../../hooks/useWorkflowStore';
import { validateWorkflow } from '../../utils/validation';
import { simulateWorkflow } from '../../api/mockApi';
import type { SimulationResult, ValidationError } from '../../types/workflow';
import { NODE_TYPE_COLORS, NODE_TYPE_ICONS } from '../../types/workflow';

interface SimulationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimulationPanel({ isOpen, onClose }: SimulationPanelProps) {
  const { nodes, edges } = useWorkflowStore();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [running, setRunning] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(0);

  const handleRun = useCallback(async () => {
    // Step 1: Validate
    const validationErrors = validateWorkflow(nodes, edges);
    setErrors(validationErrors);
    if (validationErrors.some((e) => e.severity === 'error')) {
      setResult(null);
      return;
    }

    // Step 2: Simulate
    setRunning(true);
    setResult(null);
    setRevealedSteps(0);

    try {
      const simResult = await simulateWorkflow(nodes, edges);
      setResult(simResult);

      // Animated step reveal
      for (let i = 0; i < simResult.steps.length; i++) {
        await new Promise((r) => setTimeout(r, 250));
        setRevealedSteps((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setRunning(false);
    }
  }, [nodes, edges]);

  const handleClose = () => {
    setResult(null);
    setErrors([]);
    setRevealedSteps(0);
    onClose();
  };

  if (!isOpen) return null;

  const statusColors: Record<string, string> = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    skipped: '#94a3b8',
    pending: '#6b7280',
    running: '#3b82f6',
  };

  const statusIcons: Record<string, string> = {
    success: 'M20 6L9 17l-5-5',
    warning: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01',
    error: 'M18 6L6 18M6 6l12 12',
    skipped: 'M5 12h14',
    pending: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
    running: 'M12 2v4M12 18v4M4.93 4.93l2.83 2.83',
  };

  return (
    <div className="simulation-overlay" onClick={handleClose}>
      <div className="simulation-panel" onClick={(e) => e.stopPropagation()} id="simulation-panel">
        {/* Header */}
        <div className="simulation-header">
          <div className="simulation-header-left">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <div>
              <h2 className="simulation-title">Workflow Simulation</h2>
              <p className="simulation-subtitle">{nodes.length} nodes · {edges.length} connections</p>
            </div>
          </div>
          <button className="simulation-close" onClick={handleClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="simulation-body">
          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="simulation-errors">
              <h3 className="simulation-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Validation Errors
              </h3>
              {errors.map((err, i) => (
                <div key={i} className={`simulation-error-item simulation-error-item--${err.severity}`}>
                  <span className="simulation-error-severity">{err.severity}</span>
                  <span>{err.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          {result && (
            <div className="simulation-timeline">
              <h3 className="simulation-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Execution Timeline
              </h3>
              <div className="simulation-steps">
                {result.steps.map((step, i) => {
                  if (i >= revealedSteps) return null;
                  const colors = NODE_TYPE_COLORS[step.nodeType];
                  const iconPath = NODE_TYPE_ICONS[step.nodeType];
                  return (
                    <div key={i} className="simulation-step" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="simulation-step-line">
                        <div
                          className="simulation-step-dot"
                          style={{ background: statusColors[step.status] }}
                        />
                        {i < result.steps.length - 1 && <div className="simulation-step-connector" />}
                      </div>
                      <div className="simulation-step-content">
                        <div className="simulation-step-header">
                          <div className="simulation-step-icon" style={{ background: colors.bg, color: colors.icon }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d={iconPath} />
                            </svg>
                          </div>
                          <span className="simulation-step-title">{step.nodeTitle}</span>
                          <span className="simulation-step-badge" style={{ background: `${statusColors[step.status]}20`, color: statusColors[step.status] }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d={statusIcons[step.status]} />
                            </svg>
                            {step.status}
                          </span>
                        </div>
                        <p className="simulation-step-message">{step.message}</p>
                        <span className="simulation-step-duration">{step.durationMs}ms</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              {revealedSteps >= result.steps.length && (
                <div className={`simulation-summary ${result.success ? 'simulation-summary--success' : 'simulation-summary--error'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {result.success
                      ? <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                      : <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>
                    }
                  </svg>
                  <div>
                    <strong>{result.success ? 'Simulation Passed' : 'Simulation Failed'}</strong>
                    <span>Total: {result.totalDurationMs}ms · {result.steps.length} steps · {result.errors.length} errors</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!result && errors.length === 0 && !running && (
            <div className="simulation-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <p>Click "Run Simulation" to test your workflow.</p>
              <p className="simulation-empty-hint">The workflow will be validated and each step will be executed in sequence.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="simulation-footer">
          <button className="simulation-btn-secondary" onClick={handleClose}>Close</button>
          <button className="simulation-btn-primary" onClick={handleRun} disabled={running} id="btn-run-simulation">
            {running ? (
              <>
                <span className="simulation-spinner" />
                Running...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run Simulation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
