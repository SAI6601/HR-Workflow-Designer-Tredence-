/**
 * serialization.ts — Export / Import utilities for the HR Workflow Designer.
 * 
 * Serializes the workflow (nodes + edges) to JSON and supports
 * downloading as a file or importing from a JSON file.
 */

import type { WorkflowSnapshot } from '../types/workflow';

/**
 * Export the current workflow as a JSON file download.
 */
export function exportWorkflow(snapshot: WorkflowSnapshot, filename = 'hr-workflow.json'): void {
  const json = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import a workflow from a JSON file.
 * Returns a Promise that resolves with the parsed snapshot.
 */
export function importWorkflow(): Promise<WorkflowSnapshot> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error('No file selected.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as WorkflowSnapshot;
          if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
            throw new Error('Invalid workflow format: missing nodes or edges.');
          }
          resolve(data);
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Failed to parse workflow file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsText(file);
    };

    input.click();
  });
}
