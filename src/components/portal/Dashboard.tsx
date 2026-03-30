import type { User, LeaveRequest, Shift, PortalView } from '../../types/portal';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  onClick?: () => void;
}

function StatCard({ label, value, sub, color = 'text-portal-primary', onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-portal-surface rounded-xl p-4 border border-portal-border text-left ${onClick ? 'hover:border-portal-primary transition-colors' : 'cursor-default'} flex flex-col gap-1`}
    >
      <span className="text-xs text-portal-muted">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      {sub && <span className="text-xs text-portal-muted">{sub}</span>}
    </button>
  );
}

interface DashboardProps {
  currentUser: User;
  leaveRequests: LeaveRequest[];
  shifts: Shift[];
  leaveBalances: Record<string, number>;
  leaveUsed: Record<string, number>;
  onNavigate: (view: PortalView) => void;
}

export function Dashboard({
  currentUser,
  leaveRequests,
  shifts,
  leaveBalances,
  leaveUsed,
  onNavigate,
}: DashboardProps) {
  const pending = leaveRequests.filter((r) => r.status === 'pending');
  const annualRemaining = leaveBalances.annual - leaveUsed.annual;
  const nextShift = shifts[0];

  const recentRequests = leaveRequests.slice(0, 3);

  return (
    <div className="p-4 space-y-5 max-w-xl mx-auto">
      {/* Welcome */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-portal-fg">
          Hello, {currentUser.name.split(' ')[0]} 👋
        </h2>
        <p className="text-sm text-portal-muted">{currentUser.role} · {currentUser.department}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Annual leave remaining"
          value={annualRemaining}
          sub="days available"
          onClick={() => onNavigate('leave')}
        />
        <StatCard
          label="Pending requests"
          value={pending.length}
          sub="awaiting approval"
          color={pending.length > 0 ? 'text-amber-600' : 'text-portal-primary'}
          onClick={() => onNavigate('leave')}
        />
        <StatCard
          label="Next shift"
          value={nextShift ? formatDate(nextShift.date) : '—'}
          sub={nextShift ? nextShift.location : 'No upcoming shifts'}
          onClick={() => onNavigate('schedule')}
        />
        <StatCard
          label="Sick leave remaining"
          value={leaveBalances.sick - leaveUsed.sick}
          sub="days available"
          onClick={() => onNavigate('leave')}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-portal-fg mb-3">Quick actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Request leave', view: 'leave' as PortalView, emoji: '🏖️' },
            { label: 'View schedule', view: 'schedule' as PortalView, emoji: '📅' },
            { label: 'HR documents', view: 'documents' as PortalView, emoji: '📄' },
            { label: 'Raise a request', view: 'requests' as PortalView, emoji: '💬' },
            { label: 'Policy Q&A', view: 'policy-qa' as PortalView, emoji: '🔍' },
          ].map((action) => (
            <button
              key={action.view}
              onClick={() => onNavigate(action.view)}
              className="flex items-center gap-2 bg-portal-surface border border-portal-border rounded-xl px-3 py-3 text-sm text-portal-fg hover:border-portal-primary transition-colors text-left"
            >
              <span className="text-lg">{action.emoji}</span>
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent leave requests */}
      {recentRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-portal-fg">Recent leave</h3>
            <button
              onClick={() => onNavigate('leave')}
              className="text-xs text-portal-primary hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-portal-surface rounded-xl border border-portal-border p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-portal-fg capitalize">{req.type} leave</p>
                  <p className="text-xs text-portal-muted">
                    {formatDate(req.startDate)} – {formatDate(req.endDate)} · {req.days}d
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[req.status]}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
