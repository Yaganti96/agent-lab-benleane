import { useState } from 'react';
import type { Ticket, IncidentCategory, TicketPriority } from '../../types/portal';

const CATEGORY_LABELS: Record<IncidentCategory, string> = {
  'it-support': 'IT Support',
  facilities: 'Facilities',
  'hr-query': 'HR Query',
  payroll: 'Payroll',
  benefits: 'Benefits',
  other: 'Other',
};

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface RequestsProps {
  tickets: Ticket[];
  onSubmit: (t: Omit<Ticket, 'id' | 'userId' | 'submittedAt' | 'updatedAt' | 'status'>) => void;
}

export function Requests({ tickets, onSubmit }: RequestsProps) {
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<IncidentCategory>('hr-query');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) {
      setError('Please enter a subject.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }
    setError('');
    onSubmit({ category, subject: subject.trim(), description: description.trim(), priority });
    setShowForm(false);
    setSubmitted(true);
    setCategory('hr-query');
    setSubject('');
    setDescription('');
    setPriority('medium');
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="p-4 space-y-5 max-w-xl mx-auto">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-bold text-portal-fg">Requests</h2>
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
          ✅ Your request has been submitted. You'll receive a response within 2 business days.
        </div>
      )}

      {/* New request form */}
      {showForm && (
        <div className="bg-portal-surface rounded-xl border border-portal-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-portal-fg">New Request</h3>
            <button onClick={() => setShowForm(false)} className="text-portal-muted hover:text-portal-fg text-lg leading-none">×</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-portal-fg mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full px-3 py-2 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50"
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-portal-fg mb-1">Priority</label>
              <div className="flex gap-2">
                {(Object.keys(PRIORITY_LABELS) as TicketPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors capitalize ${
                      priority === p
                        ? 'bg-portal-primary text-white border-portal-primary'
                        : 'border-portal-border bg-portal-bg text-portal-muted hover:text-portal-fg'
                    }`}
                  >
                    {PRIORITY_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-portal-fg mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50"
                placeholder="Brief description of your request..."
                maxLength={120}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-portal-fg mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-portal-border bg-portal-input text-portal-fg text-sm focus:outline-none focus:ring-2 focus:ring-portal-primary/50 resize-none"
                placeholder="Provide more details about your request..."
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 bg-portal-primary text-white text-sm font-medium py-2 rounded-lg hover:bg-portal-primary-hover transition-colors"
              >
                Submit
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

      {/* Ticket list */}
      <div>
        <h3 className="text-sm font-semibold text-portal-fg mb-3">My requests</h3>
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">💬</p>
            <p className="text-sm text-portal-muted">No requests yet.</p>
            <p className="text-xs text-portal-muted mt-1">Use the button above to raise a new request.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-portal-surface rounded-xl border border-portal-border p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-portal-fg">{ticket.subject}</p>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[ticket.status]}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-xs text-portal-muted line-clamp-2 mb-2">{ticket.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-portal-muted">{CATEGORY_LABELS[ticket.category]}</span>
                  <span className="text-portal-muted">·</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[ticket.priority]}`}>
                    {PRIORITY_LABELS[ticket.priority]}
                  </span>
                  <span className="text-portal-muted">·</span>
                  <span className="text-xs text-portal-muted">{formatDate(ticket.submittedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
