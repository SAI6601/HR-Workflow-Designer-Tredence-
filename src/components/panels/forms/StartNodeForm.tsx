/**
 * StartNodeForm.tsx — Configuration form for Start nodes.
 */

import { useState } from 'react';
import type { StartNodeData } from '../../../types/workflow';

interface Props {
  data: StartNodeData;
  onChange: (updates: Partial<StartNodeData>) => void;
}

export function StartNodeForm({ data, onChange }: Props) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const addMetadata = () => {
    if (!newKey.trim()) return;
    onChange({ metadata: { ...data.metadata, [newKey.trim()]: newValue } });
    setNewKey('');
    setNewValue('');
  };

  const removeMetadata = (key: string) => {
    const updated = { ...data.metadata };
    delete updated[key];
    onChange({ metadata: updated });
  };

  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label" htmlFor="start-title">Title</label>
        <input
          id="start-title"
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Onboarding Start"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Metadata (Key-Value)</label>
        <div className="form-kv-list">
          {Object.entries(data.metadata || {}).map(([key, val]) => (
            <div key={key} className="form-kv-item">
              <span className="form-kv-key">{key}</span>
              <span className="form-kv-val">{val}</span>
              <button className="form-kv-remove" onClick={() => removeMetadata(key)} title="Remove">×</button>
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
          <button className="form-btn-add" onClick={addMetadata} disabled={!newKey.trim()}>+</button>
        </div>
      </div>
    </div>
  );
}
