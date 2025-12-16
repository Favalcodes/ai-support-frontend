import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Permission } from '../../types/permission.types';
import { UserRole } from '../../types/user.types';
import { useAuthStore } from '../../stores/authStore';
import { usePermissions } from '../../hooks/usePermissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permissions?: Permission[];
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY permission
  roles?: UserRole[];
  redirectTo?: string;
}

/**
 * Component that protects routes based on authentication and permissions
 * Usage:
 * <Route
 *   path="/staff"
 *   element={
 *     <ProtectedRoute permissions={[Permission.VIEW_STAFF]}>
 *       <StaffPage />
 *     </ProtectedRoute>
 *   }
 * />
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permissions = [],
  requireAll = true,
  roles = [],
  redirectTo = '/login',
}) => {
  const { isAuthenticated } = useAuthStore();
  const { canAll, canAny, hasAnyRole } = usePermissions();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (roles.length > 0) {
    if (!hasAnyRole(roles)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission-based access if permissions are specified
  if (permissions.length > 0) {
    const hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
