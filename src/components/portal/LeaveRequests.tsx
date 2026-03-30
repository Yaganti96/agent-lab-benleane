import { useState } from 'react';
import type { LeaveRequest, LeaveType } from '../../types/portal';

const LEAVE_LABELS: Record<LeaveType, string> = {
  annual: 'Annual Leave',
  sick: 'Sick Leave',
  personal: 'Personal Leave',
  maternity: 'Maternity Leave',
  paternity: 'Paternity Leave',
  unpaid: 'Unpaid Leave',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
  return Math.max(1, diff);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface LeaveRequestsProps {
  leaveRequests: LeaveRequest[];
  leaveBalances: Record<string, number>;
  leaveUsed: Record<string, number>;
  onSubmit: (req: Omit<LeaveRequest, 'id' | 'userId' | 'submittedAt' | 'status'>) => void;
  onCancel: (id: string) => void;
}

export function LeaveRequests({
  leaveRequests,
  leaveBalances,
  leaveUsed,
  onSubmit,
  onCancel,
}: LeaveRequestsProps) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select start and end dates.');
      return;
    }
    if (endDate < startDate) {
      setError('End date must be on or after start date.');
      return;
    }
    const days = daysBetween(startDate, endDate);
    setError('');
    onSubmit({ type, startDate, endDate, days, reason });
    setShowForm(false);
    setSubmitted(true);
    setType('annual');
    setStartDate('');
    setEndDate('');
    setReason('');
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="p-4 space-y-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-bold text-portal-fg">Leave Requests</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm bg-portal-primary text-white px-3 py-1.5 rounded-lg hover:bg-portal-primary-hover transition-colors"
          >
            + New request
          </button>
        )}
      </div>

      {submitted && (
        <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm border border-green-200">
          ✅ Leave request submitted and awaiting approval.
        </div>
      )}

      {/* Leave balances */}
      <div>
        <h3 className="text-sm font-semibold text-portal-fg mb-3">Leave balances</h3>
        <div className="grid grid-cols-3 gap-2">
          {(['annual', 'sick', 'personal'] as LeaveType[]).map((t) => (
            <div key={t} className="bg-portal-surface rounded-xl border border-portal-border p-3 text-center">
              <div className="text-xs text-portal-muted capitalize mb-1">{t}</div>
              <div className="text-xl font-bold text-portal-primary">
                {leaveBalances[t] - leaveUsed[t]}
              </div>
              <div className="text-xs text-portal-muted">/ {leaveBalances[t]} days</div>
            </div>
          ))}
        </div>
      </div>

      {/* New request form */}
      {showForm && (
        <div className="bg-portal-surface rounded-xl border border-portal-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-portal-fg">New Leave Request</h3>
            <button onClick={() => setShowForm(false)} className="text-portal-muted hover:text-portal-fg text-lg leading-none">×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-portal-fg mb-1">Leave type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as LeaveType)}
                className="w-full px-3 py-2 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50"
              >
                {Object.entries(LEAVE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-portal-fg mb-1">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-portal-fg mb-1">End date</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50"
                />
              </div>
            </div>

            {startDate && endDate && endDate >= startDate && (
              <p className="text-xs text-portal-muted">
                Duration: <strong>{daysBetween(startDate, endDate)} day(s)</strong>
              </p>
            )}

            <div>
              <label className="block text-xs font-medium text-portal-fg mb-1">Reason (optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50 resize-none"
                placeholder="Brief reason for your leave..."
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 bg-portal-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-portal-primary-hover transition-colors"
              >
                Submit request
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-portal-bg text-portal-fg text-sm font-medium py-2 rounded-lg border border-portal-border hover:bg-portal-border transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Request list */}
      <div>
        <h3 className="text-sm font-semibold text-portal-fg mb-3">My requests</h3>
        {leaveRequests.length === 0 ? (
          <p className="text-sm text-portal-muted text-center py-8">No leave requests yet.</p>
        ) : (
          <div className="space-y-3">
            {leaveRequests.map((req) => (
              <div key={req.id} className="bg-portal-surface rounded-xl border border-portal-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-portal-fg">{LEAVE_LABELS[req.type]}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[req.status]}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-portal-muted">
                      {formatDate(req.startDate)} – {formatDate(req.endDate)} · {req.days} day{req.days !== 1 ? 's' : ''}
                    </p>
                    {req.reason && <p className="text-xs text-portal-muted mt-0.5 truncate">{req.reason}</p>}
                    {req.reviewedBy && (
                      <p className="text-xs text-portal-muted mt-0.5">Reviewed by {req.reviewedBy}</p>
                    )}
                  </div>
                  {req.status === 'pending' && (
                    <button
                      onClick={() => onCancel(req.id)}
                      className="text-xs text-red-500 hover:text-red-700 shrink-0"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
