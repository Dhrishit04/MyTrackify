import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PenSquare,
  UserCircle,
  BarChart3,
  ChevronLeft,
  Sparkles,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const studentNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/log-experience', icon: PenSquare, label: 'Log Experience' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

const adminNavItems = [
  { to: '/admin', icon: Shield, label: 'Admin Panel' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/companies', icon: Building2, label: 'Companies' },
  { to: '/log-experience', icon: PenSquare, label: 'Log Experience' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'ADMIN';
  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <aside
      className={`${
        collapsed ? 'w-[72px]' : 'w-64'
      } h-full min-h-screen glass-strong border-r border-white/5 flex flex-col transition-all duration-300 sticky top-0 z-50`}
    >
      {/* Logo & Brand */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[36px] h-9 rounded-lg bg-primary-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-gradient">MyTrackify</h1>
              <p className="text-[10px] text-surface-400 -mt-0.5">Placement Intelligence</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Badge */}
      {isAdmin && !collapsed && (
        <div className="mx-3 mt-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-amber-400">Admin Mode</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? item.to === '/admin'
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'bg-primary-600/20 text-primary-300 glow-primary'
                : 'text-surface-300 hover:bg-surface-800 hover:text-surface-100'
              }`
            }
            id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
          >
            <item.icon className={`w-5 h-5 min-w-[20px] transition-transform group-hover:scale-110`} />
            {!collapsed && <span className="animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full p-2 rounded-xl hover:bg-surface-800 transition-colors text-surface-400 hover:text-surface-200"
          id="sidebar-collapse-btn"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </aside>
  );
}
