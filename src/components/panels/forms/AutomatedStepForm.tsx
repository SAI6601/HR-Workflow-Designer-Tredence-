/**
 * AutomatedStepForm.tsx — Configuration form for Automated Step nodes.
 * 
 * Fetches available actions from the mock API and dynamically renders
 * parameter fields based on the selected action.
 */

import type { AutomatedStepNodeData } from '../../../types/workflow';
import { useAutomations } from '../../../hooks/useAutomations';

interface Props {
  data: AutomatedStepNodeData;
  onChange: (updates: Partial<AutomatedStepNodeData>) => void;
}

export function AutomatedStepForm({ data, onChange }: Props) {
  const { automations, loading } = useAutomations();

  const selectedAction = automations.find((a) => a.id === data.actionId);

  const handleActionChange = (actionId: string) => {
    // Reset params when action changes
    const action = automations.find((a) => a.id === actionId);
    const params: Record<string, string> = {};
    if (action) {
      for (const p of action.params) {
        params[p] = data.actionParams?.[p] || '';
      }
    }
    onChange({ actionId, actionParams: params });
  };

  const handleParamChange = (paramKey: string, value: string) => {
    onChange({ actionParams: { ...data.actionParams, [paramKey]: value } });
  };

  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label" htmlFor="auto-title">Title</label>
        <input
          id="auto-title"
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Send Welcome Email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="auto-action">Action</label>
        {loading ? (
          <div className="form-loading">Loading actions...</div>
        ) : (
          <select
            id="auto-action"
            className="form-select"
            value={data.actionId}
            onChange={(e) => handleActionChange(e.target.value)}
          >
            <option value="">Select an action...</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* Dynamic parameters */}
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="form-group">
          <label className="form-label">Action Parameters</label>
          <div className="form-params">
            {selectedAction.params.map((param) => (
              <div key={param} className="form-param-row">
                <label className="form-param-label" htmlFor={`param-${param}`}>{param}</label>
                <input
                  id={`param-${param}`}
                  className="form-input"
                  type="text"
                  value={data.actionParams?.[param] || ''}
                  onChange={(e) => handleParamChange(param, e.target.value)}
                  placeholder={`Enter ${param}...`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
