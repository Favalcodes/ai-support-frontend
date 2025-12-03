import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { AgentDashboardApp } from './apps/agent-dashboard/App';
import { LandingPageApp } from './apps/landing-page/App';
import { ChatWidgetApp } from './apps/chat-widget/App';
import { LoginPage } from './apps/agent-dashboard/pages/Login';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPageApp />} />

          {/* Chat Widget Demo */}
          <Route path="/demo" element={<ChatWidgetApp />} />

          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard - All routes handled by AgentDashboardApp */}
          <Route path="/dashboard/*" element={<AgentDashboardApp />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
