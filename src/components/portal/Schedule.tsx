import type { Shift } from '../../types/portal';

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface ScheduleProps {
  shifts: Shift[];
}

export function Schedule({ shifts }: ScheduleProps) {
  const now = new Date().toISOString().split('T')[0];
  const upcomingShifts = shifts.filter((s) => s.date >= now);
  const pastShifts = shifts.filter((s) => s.date < now);

  function ShiftCard({ shift }: { shift: Shift }) {
    const isToday = shift.date === now;
    const isHome = shift.location.toLowerCase().includes('home');
    return (
      <div className={`bg-portal-surface rounded-xl border p-4 ${isToday ? 'border-portal-primary' : 'border-portal-border'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-portal-fg">{formatDayLabel(shift.date)}</p>
              {isToday && (
                <span className="text-xs bg-portal-primary text-white px-2 py-0.5 rounded-full">Today</span>
              )}
            </div>
            <p className="text-xs text-portal-muted">{formatFullDate(shift.date)}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isHome ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
            {isHome ? '🏠 Remote' : '🏢 Office'}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-portal-muted">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {shift.startTime} – {shift.endTime}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {shift.location}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 max-w-xl mx-auto">
      <div className="pt-2">
        <h2 className="text-xl font-bold text-portal-fg">My Schedule</h2>
        <p className="text-sm text-portal-muted">Upcoming shifts for the next 2 weeks</p>
      </div>

      {upcomingShifts.length === 0 ? (
        <div className="text-center py-12 text-portal-muted text-sm">
          No upcoming shifts scheduled.
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingShifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
        </div>
      )}

      {pastShifts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-portal-muted mb-3">Past</h3>
          <div className="space-y-2 opacity-60">
            {pastShifts.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
