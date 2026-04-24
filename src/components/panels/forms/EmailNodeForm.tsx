import type { EmailNodeData } from '../../../types/workflow';

interface Props {
  data: EmailNodeData;
  onChange: (updates: Partial<EmailNodeData>) => void;
}

export function EmailNodeForm({ data, onChange }: Props) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label className="form-label">Title <span className="form-required">*</span></label>
        <input
          type="text"
          className="form-input"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g., Send Welcome Email"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Recipient <span className="form-required">*</span></label>
        <input
          type="email"
          className="form-input"
          value={data.recipient}
          onChange={(e) => onChange({ recipient: e.target.value })}
          placeholder="e.g., candidate@example.com"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Subject <span className="form-required">*</span></label>
        <input
          type="text"
          className="form-input"
          value={data.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          placeholder="Email Subject"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Body</label>
        <textarea
          className="form-textarea"
          value={data.body}
          onChange={(e) => onChange({ body: e.target.value })}
          placeholder="Email body content..."
          rows={4}
        />
      </div>
    </div>
  );
}
