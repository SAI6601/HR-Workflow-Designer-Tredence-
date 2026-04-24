import type { ConditionNodeData } from '../../../types/workflow';

interface Props {
  data: ConditionNodeData;
  onChange: (updates: Partial<ConditionNodeData>) => void;
}

export function ConditionNodeForm({ data, onChange }: Props) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label">Title <span className="form-required">*</span></label>
        <input
          type="text"
          className="form-input"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Is Manager?"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Field to Check <span className="form-required">*</span></label>
        <input
          type="text"
          className="form-input"
          value={data.conditionField}
          onChange={(e) => onChange({ conditionField: e.target.value })}
          placeholder="e.g., department"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Operator</label>
        <select
          className="form-select"
          value={data.conditionOperator}
          onChange={(e) => onChange({ conditionOperator: e.target.value })}
        >
          <option value="equals">Equals</option>
          <option value="not_equals">Not Equals</option>
          <option value="contains">Contains</option>
          <option value="greater_than">Greater Than</option>
          <option value="less_than">Less Than</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Value <span className="form-required">*</span></label>
        <input
          type="text"
          className="form-input"
          value={data.conditionValue}
          onChange={(e) => onChange({ conditionValue: e.target.value })}
          placeholder="e.g., Engineering"
        />
      </div>
    </div>
  );
}
