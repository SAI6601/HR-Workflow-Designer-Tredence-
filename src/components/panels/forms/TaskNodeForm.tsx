/**
 * TaskNodeForm.tsx — Configuration form for Task nodes.
 */

import { useState } from 'react';
import type { TaskNodeData } from '../../../types/workflow';

interface Props {
  data: TaskNodeData;
  onChange: (updates: Partial<TaskNodeData>) => void;
}

export function TaskNodeForm({ data, onChange }: Props) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addCustomField = () => {
    if (!newKey.trim()) return;
    onChange({ customFields: { ...data.customFields, [newKey.trim()]: newValue } });
    setNewKey('');
    setNewValue('');
  };

  const removeCustomField = (key: string) => {
    const updated = { ...data.customFields };
    delete updated[key];
    onChange({ customFields: updated });
  };

  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label" htmlFor="task-title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="task-title"
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Collect Documents"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          className="form-textarea"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Describe the task..."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="task-assignee">Assignee</label>
        <input
          id="task-assignee"
          className="form-input"
          type="text"
          value={data.assignee}
          onChange={(e) => onChange({ assignee: e.target.value })}
          placeholder="e.g., john.doe@company.com"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="task-duedate">Due Date</label>
        <input
          id="task-duedate"
          className="form-input"
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Custom Fields (Key-Value)</label>
        <div className="form-kv-list">
          {Object.entries(data.customFields || {}).map(([key, val]) => (
            <div key={key} className="form-kv-item">
              <span className="form-kv-key">{key}</span>
              <span className="form-kv-val">{val}</span>
              <button className="form-kv-remove" onClick={() => removeCustomField(key)} title="Remove">×</button>
            </div>
          ))}
        </div>
        <div className="form-kv-add">
          <input
            className="form-input form-input--sm"
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key"
          />
          <input
            className="form-input form-input--sm"
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
          />
          <button className="form-btn-add" onClick={addCustomField} disabled={!newKey.trim()}>+</button>
        </div>
      </div>
    </div>
  );
}
