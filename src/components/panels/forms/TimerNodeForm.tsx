import type { TimerNodeData } from '../../../types/workflow';

interface Props {
  data: TimerNodeData;
  onChange: (updates: Partial<TimerNodeData>) => void;
}

export function TimerNodeForm({ data, onChange }: Props) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label">Title <span className="form-required">*</span></label>
        <input
          type="text"
          className="form-input"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Wait 2 Days"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Duration <span className="form-required">*</span></label>
        <input
          type="number"
          className="form-input"
          value={data.duration}
          onChange={(e) => onChange({ duration: Number(e.target.value) })}
          min="1"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Unit</label>
        <select
          className="form-select"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={data.unit}
          onChange={(e) => onChange({ unit: e.target.value as any })}
        >
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
    </div>
  );
}
