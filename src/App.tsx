import { usePortal } from './hooks/usePortal';
import { LoginScreen } from './components/portal/LoginScreen';
import { Shell } from './components/portal/Shell';
import { Dashboard } from './components/portal/Dashboard';
import { LeaveRequests } from './components/portal/LeaveRequests';
import { Schedule } from './components/portal/Schedule';
import { HRDocuments } from './components/portal/HRDocuments';
import { Requests } from './components/portal/Requests';
import { PolicyQA } from './components/portal/PolicyQA';

function App() {
  const {
    currentUser,
    view,
    setView,
    leaveRequests,
    tickets,
    shifts,
    documents,
    leaveBalances,
    leaveUsed,
    login,
    logout,
    submitLeaveRequest,
    cancelLeaveRequest,
    submitTicket,
  } = usePortal();

  if (!currentUser || view === 'login') {
    return <LoginScreen onLogin={login} />;
  }

  function renderView() {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard
            currentUser={currentUser!}
            leaveRequests={leaveRequests}
            shifts={shifts}
            leaveBalances={leaveBalances}
            leaveUsed={leaveUsed}
            onNavigate={setView}
          />
        );
      case 'leave':
        return (
          <LeaveRequests
            leaveRequests={leaveRequests}
            leaveBalances={leaveBalances}
            leaveUsed={leaveUsed}
            onSubmit={submitLeaveRequest}
            onCancel={cancelLeaveRequest}
          />
        );
      case 'schedule':
        return <Schedule shifts={shifts} />;
      case 'documents':
        return <HRDocuments documents={documents} />;
      case 'requests':
        return <Requests tickets={tickets} onSubmit={submitTicket} />;
      case 'policy-qa':
        return <PolicyQA documents={documents} />;
      default:
        return null;
    }
  }

  return (
    <Shell
      currentUser={currentUser}
      view={view}
      onNavigate={setView}
      onLogout={logout}
    >
      {renderView()}
    </Shell>
  );
}

export default App;
