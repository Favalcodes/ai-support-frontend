import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  CheckCircle,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  UserCog,
  Boxes,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { useConversationStore } from '../../../stores';
import { Avatar } from '../../../components/ui';
import { usePermissions } from '../../../hooks/usePermissions';
import { Permission } from '../../../types/permission.types';
import { logo } from '../../../assets/brand';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unassignedCount } = useConversationStore();
  const { can } = usePermissions();
  const navigate = useNavigate()

  const navItems = [
    {
      to: '/dashboard/conversations',
      icon: MessageSquare,
      label: 'My Conversations',
      permission: Permission.VIEW_ASSIGNED_CONVERSATIONS,
    },
    {
      to: '/dashboard/queue',
      icon: Users,
      label: 'Unassigned Queue',
      badge: unassignedCount,
      permission: Permission.ASSIGN_CONVERSATIONS,
    },
    {
      to: '/dashboard/resolved',
      icon: CheckCircle,
      label: 'Resolved',
      permission: Permission.VIEW_ALL_CONVERSATIONS,
    },
    {
      to: '/dashboard/analytics',
      icon: BarChart3,
      label: 'Analytics',
      permission: Permission.VIEW_ANALYTICS,
    },
    {
      to: '/dashboard/knowledge',
      icon: BookOpen,
      label: 'Knowledge Base',
      permission: Permission.VIEW_KNOWLEDGE_BASE,
    },
    {
      to: '/dashboard/staff',
      icon: UserCog,
      label: 'Staff Management',
      permission: Permission.VIEW_STAFF,
    },
    {
      to: '/dashboard/departments',
      icon: Briefcase,
      label: 'Departments',
      permission: Permission.VIEW_DEPARTMENTS,
    },
    {
      to: '/dashboard/widget',
      icon: Boxes,
      label: 'Chat Widget',
      permission: Permission.VIEW_WIDGET_SETTINGS,
    },
  ];

  // Filter nav items based on user permissions
  const visibleNavItems = navItems.filter((item) => can(item.permission));

  return (
    <div className="w-64 bg-dark-600 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-dark-800 cursor-pointer" onClick={() => navigate('/')}>
        <img src={logo.fullOnDark} alt="rlayAi" className="h-9 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 mt-10 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-primary-50 text-primary-900 font-semibold'
                : 'text-white hover:bg-dark-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="flex-1">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        {can(Permission.VIEW_COMPANY_SETTINGS) && (
          <div className="pt-4 border-t border-dark-800 mt-4">
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-primary-50 text-primary-900 font-semibold'
                  : 'text-white hover:bg-dark-800'
                }`
              }
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Settings</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-dark-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            name={user ? `${user.first_name} ${user.last_name}` : 'User'}
            size="md"
            className='bg-primary-100 text-primary'
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-dark-300 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-dark-300 hover:bg-dark-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};