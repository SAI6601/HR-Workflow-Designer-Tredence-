/**
 * ApprovalNodeForm.tsx — Configuration form for Approval nodes.
 */

import type { ApprovalNodeData } from '../../../types/workflow';

interface Props {
  data: ApprovalNodeData;
  onChange: (updates: Partial<ApprovalNodeData>) => void;
}

const APPROVER_ROLES = ['Manager', 'HRBP', 'Director', 'VP', 'C-Level', 'Legal', 'Finance'];

export function ApprovalNodeForm({ data, onChange }: Props) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label" htmlFor="approval-title">
          Title <span className="form-required">*</span>
        </label>
        <input
          id="approval-title"
          className="form-input"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Manager Approval"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="approval-role">Approver Role</label>
        <select
          id="approval-role"
          className="form-select"
          value={data.approverRole}
          onChange={(e) => onChange({ approverRole: e.target.value })}
        >
          {APPROVER_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="approval-threshold">Auto-Approve Threshold</label>
        <input
          id="approval-threshold"
          className="form-input"
          type="number"
          min={0}
          value={data.autoApproveThreshold}
          onChange={(e) => onChange({ autoApproveThreshold: Number(e.target.value) || 0 })}
          placeholder="0 = manual approval required"
        />
        <p className="form-hint">Set to 0 for manual approval. Positive value auto-approves below threshold.</p>
      </div>
    </div>
  );
}
