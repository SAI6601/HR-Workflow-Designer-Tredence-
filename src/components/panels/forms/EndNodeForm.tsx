/**
 * EndNodeForm.tsx — Configuration form for End nodes.
 */

import type { EndNodeData } from '../../../types/workflow';

interface Props {
  data: EndNodeData;
  onChange: (updates: Partial<EndNodeData>) => void;
}

export function EndNodeForm({ data, onChange }: Props) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label" htmlFor="end-message">End Message</label>
        <textarea
          id="end-message"
          className="form-textarea"
          value={data.endMessage}
          onChange={(e) => onChange({ endMessage: e.target.value })}
          placeholder="e.g., Onboarding process completed successfully."
          rows={3}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Summary Flag</label>
        <div className="form-toggle-row">
          <button
            className={`form-toggle ${data.showSummary ? 'form-toggle--active' : ''}`}
            onClick={() => onChange({ showSummary: !data.showSummary })}
            id="end-summary-toggle"
            role="switch"
            aria-checked={data.showSummary}
          >
            <span className="form-toggle-track">
              <span className="form-toggle-thumb" />
            </span>
          </button>
          <span className="form-toggle-label">
            {data.showSummary ? 'Show summary at end' : 'No summary'}
          </span>
        </div>
      </div>
    </div>
  );
}
