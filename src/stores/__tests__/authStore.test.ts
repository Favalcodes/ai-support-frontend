import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../authStore';
import { Permission } from '../../types/permission.types';
import type { User } from '../../types/user.types';

const user = { id: 'u1', email: 'a@b.com', role: 'COMPANY_ADMIN' } as User;

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  it('persists the token under auth_token, the key the axios interceptor reads', () => {
    useAuthStore.getState().login(user, 'tok123', [Permission.VIEW_DASHBOARD]);

    // The register page used to write a bare 'token' key, leaving every
    // request after signup unauthenticated.
    expect(localStorage.getItem('auth_token')).toBe('tok123');
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('persists the user and permissions alongside the token', () => {
    useAuthStore.getState().login(user, 'tok123', [Permission.VIEW_DASHBOARD]);

    expect(JSON.parse(localStorage.getItem('user')!)).toMatchObject({ id: 'u1' });
    expect(JSON.parse(localStorage.getItem('permissions')!)).toEqual([Permission.VIEW_DASHBOARD]);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('clears every stored key on logout', () => {
    useAuthStore.getState().login(user, 'tok123', [Permission.VIEW_DASHBOARD]);
    useAuthStore.getState().logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('permissions')).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('answers permission checks from the granted set', () => {
    useAuthStore.getState().login(user, 'tok', [Permission.VIEW_DASHBOARD, Permission.VIEW_STAFF]);
    const s = useAuthStore.getState();

    expect(s.hasPermission(Permission.VIEW_STAFF)).toBe(true);
    expect(s.hasPermission(Permission.DELETE_STAFF)).toBe(false);
    expect(s.hasAnyPermission([Permission.DELETE_STAFF, Permission.VIEW_STAFF])).toBe(true);
    expect(s.hasAllPermissions([Permission.DELETE_STAFF, Permission.VIEW_STAFF])).toBe(false);
    expect(s.hasAllPermissions([Permission.VIEW_DASHBOARD, Permission.VIEW_STAFF])).toBe(true);
  });
});
