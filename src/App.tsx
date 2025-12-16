import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { AgentDashboardApp } from './apps/agent-dashboard/App';
import { LandingPageApp } from './apps/landing-page/App';
import { ChatWidgetApp } from './apps/chat-widget/App';
import { LoginPage } from './apps/agent-dashboard/pages/Login';
import { RegisterPage } from './apps/agent-dashboard/pages/Register';
import { CompanySetupPage } from './apps/agent-dashboard/pages/CompanySetup';
import { FirstLoginSetupPage } from './apps/agent-dashboard/pages/FirstLoginSetup';
import { useTokenExpirationCheck } from './hooks';

function App() {
  // Check token expiration periodically
  // useTokenExpirationCheck();

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPageApp />} />

          {/* Chat Widget Demo */}
          <Route path="/demo" element={<ChatWidgetApp />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/company-setup" element={<CompanySetupPage />} />
          <Route path="/first-login-setup" element={<FirstLoginSetupPage />} />

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
