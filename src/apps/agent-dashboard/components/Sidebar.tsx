import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  CheckCircle,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../../hooks';
import { useConversationStore } from '../../../stores';
import { Avatar } from '../../../components/ui';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { unassignedCount } = useConversationStore();

  const navItems = [
    {
      to: '/dashboard/conversations',
      icon: MessageSquare,
      label: 'My Conversations',
    },
    {
      to: '/dashboard/queue',
      icon: Users,
      label: 'Unassigned Queue',
      badge: unassignedCount,
    },
    {
      to: '/dashboard/resolved',
      icon: CheckCircle,
      label: 'Resolved',
    },
    {
      to: '/dashboard/analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      to: '/dashboard/knowledge',
      icon: BookOpen,
      label: 'Knowledge Base',
    },
  ];

  return (
    <div className="w-64 bg-navy-900 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-sky-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-white font-bold text-lg">SupportHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500 text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
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

        <div className="pt-4 border-t border-navy-800 mt-4">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500 text-white'
                  : 'text-navy-300 hover:bg-navy-800 hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-navy-800">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            name={user ? `${user.first_name} ${user.last_name}` : 'User'}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-navy-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};