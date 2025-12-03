import { WebSocketProvider } from '@/components/shared/webSocketProvider';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/shared/protectedRoute';
import { DashboardLayout } from './layouts/layout';
import { ConversationsPage } from './pages/Conversations';
import { QueuePage } from './pages/Queue';
import { ResolvedPage } from './pages/Resolved';
import { AnalyticsPage } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';
import { KnowledgePage } from './pages/Knowledge';
import { KnowledgeArticleEditor } from './pages/KnowledgeArticleEditor';
import { StaffPage } from './pages/Staff';
import { WidgetSettingsPage } from './pages/WidgetSettings';
import { DepartmentsPage } from './pages/Departments';
import { UserRole } from '@/types/user.types';

export const AgentDashboardApp: React.FC = () => {
  return (
    <WebSocketProvider>
      <Routes>
        {/* Protected Dashboard Routes - Accessible by COMPANY_STAFF and above */}
        <Route
          path="/*"
          element={
            <ProtectedRoute requireRole={UserRole.COMPANY_STAFF}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="conversations" replace />} />
          <Route path="conversations" element={<ConversationsPage />} />
          <Route path="queue" element={<QueuePage />} />
          <Route path="resolved" element={<ResolvedPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="knowledge/article/new" element={<KnowledgeArticleEditor />} />
          <Route path="knowledge/article/:id" element={<KnowledgeArticleEditor />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="widget" element={<WidgetSettingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </WebSocketProvider>
  );
};
