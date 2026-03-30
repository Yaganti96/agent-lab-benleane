import { useState, useCallback } from 'react';
import type { User, LeaveRequest, Ticket, PortalView } from '../types/portal';
import {
  MOCK_USER,
  MOCK_LEAVE_REQUESTS,
  MOCK_SHIFTS,
  HR_DOCUMENTS,
  LEAVE_BALANCES,
  LEAVE_USED,
} from '../data/hrData';

export function usePortal() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<PortalView>('login');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const login = useCallback(
    (email: string, password: string) => {
      // Mock authentication — accept any non-empty password
      void email;
      void password;
      setCurrentUser(MOCK_USER);
      setView('dashboard');
    },
    []
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setView('login');
  }, []);

  const submitLeaveRequest = useCallback(
    (req: Omit<LeaveRequest, 'id' | 'userId' | 'submittedAt' | 'status'>) => {
      const newReq: LeaveRequest = {
        ...req,
        id: `lr${Date.now()}`,
        userId: currentUser!.id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      setLeaveRequests((prev) => [newReq, ...prev]);
    },
    [currentUser]
  );

  const cancelLeaveRequest = useCallback((id: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );
  }, []);

  const submitTicket = useCallback(
    (t: Omit<Ticket, 'id' | 'userId' | 'submittedAt' | 'updatedAt' | 'status'>) => {
      const newTicket: Ticket = {
        ...t,
        id: `tk${Date.now()}`,
        userId: currentUser!.id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTickets((prev) => [newTicket, ...prev]);
    },
    [currentUser]
  );

  return {
    currentUser,
    view,
    setView,
    leaveRequests,
    tickets,
    shifts: MOCK_SHIFTS,
    documents: HR_DOCUMENTS,
    leaveBalances: LEAVE_BALANCES,
    leaveUsed: LEAVE_USED,
    login,
    logout,
    submitLeaveRequest,
    cancelLeaveRequest,
    submitTicket,
  };
}
