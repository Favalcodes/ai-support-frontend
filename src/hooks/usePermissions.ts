import { useAuthStore } from '../stores/authStore';
import { Permission } from '../types/permission.types';
import { UserRole } from '../types/user.types';

/**
 * Custom hook for permission checking
 * Provides easy access to permission checks in React components
 */
export const usePermissions = () => {
  const { user, permissions, hasPermission, hasAnyPermission, hasAllPermissions } = useAuthStore();

  // Check if user has a specific permission
  const can = (permission: Permission): boolean => {
    return hasPermission(permission);
  };

  // Check if user has ANY of the specified permissions (OR logic)
  const canAny = (requiredPermissions: Permission[]): boolean => {
    return hasAnyPermission(requiredPermissions);
  };

  // Check if user has ALL of the specified permissions (AND logic)
  const canAll = (requiredPermissions: Permission[]): boolean => {
    return hasAllPermissions(requiredPermissions);
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Check if user is platform admin (SUPER_ADMIN or ADMIN)
  const isPlatformAdmin = (): boolean => {
    return hasAnyRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]);
  };

  // Check if user is company admin (COMPANY_SUPER_ADMIN or COMPANY_ADMIN)
  const isCompanyAdmin = (): boolean => {
    return hasAnyRole([UserRole.COMPANY_SUPER_ADMIN, UserRole.COMPANY_ADMIN]);
  };

  // Check if user is company super admin
  const isCompanySuperAdmin = (): boolean => {
    return hasRole(UserRole.COMPANY_SUPER_ADMIN);
  };

  // Check if user is staff
  const isStaff = (): boolean => {
    return hasRole(UserRole.COMPANY_STAFF);
  };

  return {
    user,
    permissions,
    can,
    canAny,
    canAll,
    hasRole,
    hasAnyRole,
    isPlatformAdmin,
    isCompanyAdmin,
    isCompanySuperAdmin,
    isStaff,
  };
};
