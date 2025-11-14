import { WebSocketProvider } from '@/components/shared/webSocketProvider';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/Login';
import { ProtectedRoute } from '@/components/shared/protectedRoute';
import { DashboardLayout } from './layouts/layout';
import { ConversationsPage } from './pages/Conversations';
import { QueuePage } from './pages/Queue';
// import { ProtectedRoute } from '../../components/shared/ProtectedRoute';
// import { WebSocketProvider } from '../../components/shared/WebSocketProvider';
// import { DashboardLayout } from './layouts/DashboardLayout';
// import { LoginPage } from './pages/LoginPage';
// import { ConversationsPage } from './pages/ConversationsPage';
// import { QueuePage } from './pages/QueuePage';

// Placeholder pages
const ResolvedPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Resolved Conversations</h1>
  </div>
);

const AnalyticsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Analytics</h1>
  </div>
);

const KnowledgePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Knowledge Base</h1>
  </div>
);

const SettingsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Settings</h1>
  </div>
);

export const AgentDashboardApp: React.FC = () => {
  return (
    <BrowserRouter>
      <WebSocketProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireRole="COMPANY_STAFF">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/conversations" replace />} />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="queue" element={<QueuePage />} />
            <Route path="resolved" element={<ResolvedPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="knowledge" element={<KnowledgePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </WebSocketProvider>
    </BrowserRouter>
  );
};