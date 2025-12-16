import React from 'react';
import { Permission } from '../../types/permission.types';
import { UserRole } from '../../types/user.types';
import { usePermissions } from '../../hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions?: Permission[];
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY permission
  roles?: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 * Usage:
 * <PermissionGate permissions={[Permission.VIEW_STAFF]}>
 *   <StaffList />
 * </PermissionGate>
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions = [],
  requireAll = true,
  roles = [],
  fallback = null,
}) => {
  const { canAll, canAny, hasAnyRole } = usePermissions();

  // Check role-based access if roles are specified
  if (roles.length > 0) {
    if (!hasAnyRole(roles)) {
      return <>{fallback}</>;
    }
  }

  // Check permission-based access if permissions are specified
  if (permissions.length > 0) {
    const hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};
