/** Domain types for the Employee Self-Service Portal */

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  managerId?: string;
}

export type LeaveType = 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface Shift {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  role: string;
}

export interface HRDocument {
  id: string;
  title: string;
  category: 'policy' | 'benefit' | 'procedure' | 'form' | 'handbook';
  description: string;
  lastUpdated: string;
  content: string;
  tags: string[];
}

export type IncidentCategory = 'it-support' | 'facilities' | 'hr-query' | 'payroll' | 'benefits' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high';

export interface Ticket {
  id: string;
  userId: string;
  category: IncidentCategory;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: RequestStatus;
  submittedAt: string;
  updatedAt: string;
}

export type PortalView =
  | 'login'
  | 'dashboard'
  | 'leave'
  | 'schedule'
  | 'documents'
  | 'requests'
  | 'policy-qa';
