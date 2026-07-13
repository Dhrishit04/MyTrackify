import { Shield } from 'lucide-react';
import Login from './Login';

/**
 * Admin login page — wraps the regular login form with an admin badge.
 * Route: /admin/login
 */
export default function AdminLogin() {
  return (
    <div className="relative">
      {/* Admin badge overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-sm font-medium">
          <Shield className="w-4 h-4" />
          Admin Portal
        </div>
      </div>
      <Login />
    </div>
  );
}