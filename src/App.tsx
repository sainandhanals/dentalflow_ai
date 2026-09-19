import React from 'react';
import { DentalFlowProvider, useDentalFlow } from './context/DentalFlowContext';
import { Shell } from './components/layout/Shell';
import { DashboardPage } from './pages/DashboardPage';
import { EnquiriesPage } from './pages/EnquiriesPage';
import { PatientsPage } from './pages/PatientsPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AIOperationsPage } from './pages/AIOperationsPage';

const AppContent: React.FC = () => {
  const { activePage } = useDentalFlow();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'ai-operations':
        return <AIOperationsPage />;
      case 'enquiries':
        return <EnquiriesPage />;
      case 'patients':
        return <PatientsPage />;
      case 'followups':
        return <FollowUpsPage />;
      case 'workflows':
        return <WorkflowsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <Shell>{renderCurrentPage()}</Shell>;
};

export function App() {
  return (
    <DentalFlowProvider>
      <AppContent />
    </DentalFlowProvider>
  );
}

export default App;
