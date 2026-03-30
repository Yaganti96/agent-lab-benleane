import type { User, LeaveRequest, Shift, HRDocument } from '../types/portal';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex.johnson@acme.com',
  department: 'Engineering',
  role: 'Software Engineer',
  managerId: 'u2',
};

export const MOCK_USERS: User[] = [
  MOCK_USER,
  { id: 'u2', name: 'Morgan Lee', email: 'morgan.lee@acme.com', department: 'Engineering', role: 'Engineering Manager' },
  { id: 'u3', name: 'Sam Rivera', email: 'sam.rivera@acme.com', department: 'HR', role: 'HR Business Partner' },
];

export const LEAVE_BALANCES: Record<string, number> = {
  annual: 18,
  sick: 10,
  personal: 3,
  maternity: 90,
  paternity: 14,
  unpaid: 0,
};

export const LEAVE_USED: Record<string, number> = {
  annual: 5,
  sick: 2,
  personal: 1,
  maternity: 0,
  paternity: 0,
  unpaid: 0,
};

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1',
    userId: 'u1',
    type: 'annual',
    startDate: '2026-04-14',
    endDate: '2026-04-18',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    submittedAt: '2026-03-10T10:00:00Z',
    reviewedAt: '2026-03-12T14:30:00Z',
    reviewedBy: 'Morgan Lee',
  },
  {
    id: 'lr2',
    userId: 'u1',
    type: 'sick',
    startDate: '2026-03-03',
    endDate: '2026-03-04',
    days: 2,
    reason: 'Cold and fever',
    status: 'approved',
    submittedAt: '2026-03-03T08:15:00Z',
    reviewedAt: '2026-03-03T09:00:00Z',
    reviewedBy: 'Morgan Lee',
  },
  {
    id: 'lr3',
    userId: 'u1',
    type: 'personal',
    startDate: '2026-05-01',
    endDate: '2026-05-01',
    days: 1,
    reason: 'Personal appointment',
    status: 'pending',
    submittedAt: '2026-03-28T11:00:00Z',
  },
];

// Generate schedule for the next 2 weeks
const today = new Date('2026-03-30');
export const MOCK_SHIFTS: Shift[] = Array.from({ length: 10 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() + i);
  const dayOfWeek = d.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return null;
  const dateStr = d.toISOString().split('T')[0];
  return {
    id: `s${i}`,
    userId: 'u1',
    date: dateStr,
    startTime: '09:00',
    endTime: '17:30',
    location: i % 3 === 0 ? 'Home' : 'Office – Floor 3',
    role: 'Software Engineer',
  };
}).filter(Boolean) as Shift[];

export const HR_DOCUMENTS: HRDocument[] = [
  {
    id: 'doc1',
    title: 'Annual Leave Policy',
    category: 'policy',
    description: 'Guidelines for requesting and managing annual leave entitlements.',
    lastUpdated: '2025-01-15',
    tags: ['leave', 'annual', 'vacation', 'holiday', 'pto'],
    content: `## Annual Leave Policy

**Entitlement**
Full-time employees are entitled to 20 days of annual leave per year (pro-rated for part-time). Leave accrues from your start date.

**Booking Leave**
- Submit requests at least 2 weeks in advance for leave of 3+ days.
- Same-day or next-day requests require manager approval and are subject to business need.

**Carry-Over**
Up to 5 days may be carried over into Q1 of the next calendar year. Any unused balance after March 31 is forfeited.

**Public Holidays**
Public holidays are in addition to your annual leave entitlement and are listed in the HR calendar.

**Payout on Termination**
Accrued but unused leave is paid out on termination of employment at the employee's current rate of pay.`,
  },
  {
    id: 'doc2',
    title: 'Sick Leave & Wellness Policy',
    category: 'policy',
    description: 'Information on sick leave entitlements, reporting, and wellness support.',
    lastUpdated: '2025-02-01',
    tags: ['sick', 'illness', 'wellness', 'medical', 'health'],
    content: `## Sick Leave & Wellness Policy

**Entitlement**
Employees receive 10 days of paid sick leave per year. This resets on January 1.

**Reporting Absence**
Notify your manager and HR via the self-service portal before your shift starts. For absences of 3+ consecutive days, a doctor's certificate is required.

**Return to Work**
A return-to-work meeting will be arranged after absences of 5+ days. Adjustments to duties may be made on medical advice.

**Employee Assistance Programme (EAP)**
All employees have access to our free, confidential EAP providing counselling and wellbeing support. Contact HR for the referral link.`,
  },
  {
    id: 'doc3',
    title: 'Remote Work Policy',
    category: 'policy',
    description: 'Rules and expectations for working from home or remote locations.',
    lastUpdated: '2025-03-10',
    tags: ['remote', 'work from home', 'wfh', 'hybrid', 'flexible'],
    content: `## Remote Work Policy

**Hybrid Model**
The company operates a hybrid model. Employees are expected in the office at least 3 days per week unless otherwise agreed with their manager.

**Home Office Setup**
Employees working from home must ensure a safe, ergonomic workspace. A one-time home office allowance of $300 is available — submit receipts to Payroll.

**Data Security**
All remote work must be conducted over the company VPN. Confidential documents must not be saved to personal devices or unmanaged cloud services.

**Availability**
Core hours are 10:00–15:00 local time. Outside these hours, reasonable flexibility is permitted.`,
  },
  {
    id: 'doc4',
    title: 'Performance Review Process',
    category: 'procedure',
    description: 'How performance reviews are conducted, including timelines and expectations.',
    lastUpdated: '2024-12-01',
    tags: ['performance', 'review', 'appraisal', 'feedback', 'goals'],
    content: `## Performance Review Process

**Cycle**
Performance reviews are held bi-annually: mid-year (June) and year-end (December).

**Steps**
1. Employee completes self-assessment form (available in HR Portal).
2. Manager completes assessment independently.
3. One-on-one meeting to discuss ratings, achievements, and development goals.
4. Final ratings submitted to HR within 5 business days of the meeting.

**Ratings Scale**
- 1 – Below expectations
- 2 – Meets expectations
- 3 – Exceeds expectations
- 4 – Outstanding

**Pay Reviews**
Salary adjustments linked to performance ratings are processed in January and July.`,
  },
  {
    id: 'doc5',
    title: 'Employee Benefits Summary',
    category: 'benefit',
    description: 'Overview of health insurance, pension, and other employee benefits.',
    lastUpdated: '2025-01-01',
    tags: ['benefits', 'health', 'insurance', 'pension', 'perks', '401k'],
    content: `## Employee Benefits Summary

**Health Insurance**
Company-subsidised health, dental, and vision insurance. 80% premium covered for employee; 50% for dependants. Open enrollment in November.

**Retirement / 401(k)**
Company matches 4% of salary. Vesting schedule: 25% per year over 4 years. Enrol via the Benefits portal.

**Life Insurance**
3× annual salary life insurance provided at no cost. Supplemental coverage available at employee expense.

**Parental Leave**
- Primary caregiver: 16 weeks fully paid.
- Secondary caregiver: 4 weeks fully paid.

**Learning & Development**
Annual L&D budget of $1,500 per employee. Submit requests through the HR portal.

**Other Perks**
Gym subsidy ($50/month), commuter benefits (pre-tax), and employee discount programme.`,
  },
  {
    id: 'doc6',
    title: 'Code of Conduct',
    category: 'handbook',
    description: 'Expected behaviours, ethics, and disciplinary procedures.',
    lastUpdated: '2024-10-15',
    tags: ['conduct', 'ethics', 'behaviour', 'harassment', 'discipline'],
    content: `## Code of Conduct

**Our Values**
We are committed to a respectful, inclusive, and harassment-free workplace. Every employee is expected to treat colleagues, customers, and partners with dignity.

**Prohibited Conduct**
- Harassment, bullying, or discrimination of any kind.
- Misuse of company assets or confidential information.
- Conflicts of interest not disclosed to HR.
- Falsification of records or timesheets.

**Reporting**
Report concerns to your HR Business Partner or via the anonymous ethics hotline (details on the intranet).

**Disciplinary Process**
1. Verbal warning
2. Written warning
3. Final written warning / suspension
4. Termination (for gross misconduct, steps 1–3 may be bypassed)`,
  },
];
