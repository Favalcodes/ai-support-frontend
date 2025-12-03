import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LoadingOverlay } from '../../components/ui';
import { UserRole } from '../../types/user.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: UserRole | UserRole[];
}

// Role hierarchy - higher roles have access to lower role pages
const roleHierarchy: Record<UserRole, number> = {
  [UserRole.USER]: 0,
  [UserRole.COMPANY_STAFF]: 1,
  [UserRole.COMPANY_ADMIN]: 2,
  [UserRole.COMPANY_SUPER_ADMIN]: 3,
  [UserRole.ADMIN]: 4,
  [UserRole.SUPER_ADMIN]: 5,
};

const hasRequiredRole = (userRole: UserRole, requiredRole: UserRole | UserRole[]): boolean => {
  const userLevel = roleHierarchy[userRole] || 0;
  
  if (Array.isArray(requiredRole)) {
    // If multiple roles specified, user must have at least one
    return requiredRole.some(role => {
      const requiredLevel = roleHierarchy[role] || 0;
      return userLevel >= requiredLevel;
    });
  }
  
  const requiredLevel = roleHierarchy[requiredRole] || 0;
  return userLevel >= requiredLevel;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRole,
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingOverlay message="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if specified
  if (requireRole && user) {
    const hasAccess = hasRequiredRole(user.role as UserRole, requireRole);
    
    if (!hasAccess) {
      console.log('Access Denied - User Role:', user.role, 'Required:', requireRole);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-2">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Your role: <strong>{user.role}</strong>
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
