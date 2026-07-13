import { Bell, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 glass-strong border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search companies, topics, experiences..."
            className="input-dark w-full pl-10 pr-4 py-2 rounded-xl text-sm"
            id="global-search"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl hover:bg-surface-800 transition-colors"
          id="notification-bell"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-surface-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-400 rounded-full animate-pulse-soft" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-surface-800 transition-colors"
            id="user-menu-button"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-surface-100">{user?.anonymizedId || 'Student'}</p>
              <p className="text-xs text-surface-400">{user?.branch?.split(' ').map(w => w[0]).join('') || 'CSE'} · {user?.graduationYear || '2025'}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl border border-white/10 py-2 animate-slide-up shadow-2xl">
              <button
                onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-200 hover:bg-surface-700/50 transition-colors"
                id="menu-profile"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-surface-200 hover:bg-surface-700/50 transition-colors"
                id="menu-settings"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <hr className="border-white/5 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger-400 hover:bg-surface-700/50 transition-colors"
                id="menu-logout"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
