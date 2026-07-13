import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Users, Building2, FileText, TrendingUp, Search,
  Shield, Activity, AlertTriangle, CheckCircle2, XCircle, RefreshCw,
  UserCog, ClipboardList, Bell, Flag, Eye, Plus,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import type {
  AdminDashboardStats, AdminUserSummary, Company,
  StudentProfile, AuditLogEntry, AdminLevel,
  PlacementReport, PlacementCompanyStat, ModerationQueueItem, ApiError,
} from '../types';

type Tab = 'overview' | 'students' | 'companies' | 'experiences' | 'users' | 'audit' | 'notifications';

function getErrorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === 'object') {
    const err = e as ApiError;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
  }
  return fallback;
}

interface TabDef {
  id: Tab;
  label: string;
  icon: typeof Activity;
  /** Minimum admin level required to see this tab. */
  minLevel: AdminLevel;
  /** Specific permission, if any. */
  permission?: string;
}

const ALL_TABS: TabDef[] = [
  { id: 'overview', label: 'Overview', icon: Activity, minLevel: 'MODERATOR' },
  { id: 'students', label: 'Students', icon: Users, minLevel: 'DIRECTOR', permission: 'USER:READ' },
  { id: 'companies', label: 'Companies', icon: Building2, minLevel: 'DIRECTOR', permission: 'COMPANY:READ' },
  { id: 'experiences', label: 'Experiences', icon: FileText, minLevel: 'MODERATOR' },
  { id: 'users', label: 'Admin Users', icon: UserCog, minLevel: 'SYSTEM_ADMIN' },
  { id: 'audit', label: 'Audit Logs', icon: ClipboardList, minLevel: 'DIRECTOR', permission: 'AUDIT:READ' },
  { id: 'notifications', label: 'Notify', icon: Bell, minLevel: 'ASSOCIATE', permission: 'NOTIFICATION:SEND' },
];

export default function AdminPanel() {
  const { user, adminLevel, hasPermission, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Data
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [placementReport, setPlacementReport] = useState<PlacementReport | null>(null);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserSummary[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Role assignment
  const [assignUserId, setAssignUserId] = useState('');
  const [assignLevel, setAssignLevel] = useState<AdminLevel>('MODERATOR');
  const [assignScope, setAssignScope] = useState('ALL');
  const [assignFeedback, setAssignFeedback] = useState<string | null>(null);

  const handleAssignRole = useCallback(async () => {
    const uid = parseInt(assignUserId);
    if (isNaN(uid)) return;
    setAssignFeedback(null);
    try {
      await adminService.assignRole(uid, { level: assignLevel, scope: assignScope });
      setAssignFeedback(`Role ${assignLevel} assigned to user #${uid}`);
      setAssignUserId('');
      adminService.getAdmins().then(setAdminUsers).catch(() => {});
    } catch (e) {
      setAssignFeedback(getErrorMessage(e, 'Failed to assign role'));
    }
  }, [assignUserId, assignLevel, assignScope]);

  const handleRevokeRole = useCallback(async (studentId: number) => {
    try {
      await adminService.revokeRole(studentId, { reason: 'Revoked via admin panel' });
      adminService.getAdmins().then(setAdminUsers).catch(() => {});
    } catch (e) {
      setError(getErrorMessage(e, 'Failed to revoke role'));
    }
  }, []);

  // Redirect non-admins
  useEffect(() => {
    if (user && !isAdmin) {
      window.location.href = '/dashboard';
    }
  }, [user, isAdmin]);

  // Filter tabs by role
  const visibleTabs = ALL_TABS.filter(t => {
    if (!adminLevel) return false;
    // Map AdminLevel to numeric access level
    const levelMap: Record<AdminLevel, number> = { SYSTEM_ADMIN: 100, DIRECTOR: 70, ASSOCIATE: 45, MODERATOR: 20 };
    const userLevel = levelMap[adminLevel] ?? 0;
    const minLevel = levelMap[t.minLevel] ?? 0;
    if (userLevel < minLevel) return false;
    if (t.permission && !hasPermission(t.permission)) return false;
    return true;
  });

  // Reset tab when switching
  const switchTab = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setError(null);
  }, []);

  // Fetch data per tab
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'overview': {
          const [dash, report] = await Promise.all([
            adminService.getDashboard(),
            adminService.getPlacementReport().catch(() => ({ byCompany: [], totalApplications: 0, totalOffers: 0, successRate: 0 })),
          ]);
          setStats(dash);
          setPlacementReport(report);
          break;
        }
        case 'students':
          setStudents(await adminService.getStudents());
          break;
        case 'companies':
          setCompanies(await adminService.getCompanies());
          break;
        case 'users':
          setAdminUsers(await adminService.getAdmins());
          break;
        case 'audit': {
          const result = await adminService.getAuditLogs({ size: 50 });
          setAuditLogs(result.content);
          break;
        }
        case 'experiences':
          // For experience/moderator tabs, the moderation queue is sufficient
          break;
        case 'notifications':
          break;
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load data'));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchData(); }, [fetchData]);

  if (!isAdmin) return null;

  const filteredStudents = students.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.anonymizedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.sector || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelLabel: Record<AdminLevel, string> = {
    SYSTEM_ADMIN: 'System Admin',
    DIRECTOR: 'Director',
    ASSOCIATE: 'Associate',
    MODERATOR: 'Moderator',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <p className="text-surface-400 text-sm">System management & oversight</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20">
            {adminLevel ? levelLabel[adminLevel] : 'ADMIN'} ACCESS
          </span>
        </div>
      </div>

      {/* Tabs */}
      {visibleTabs.length > 0 && (
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-900/50 border border-white/[0.06] w-fit overflow-x-auto">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-600/20 text-primary-300 shadow-sm'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={fetchData} className="ml-auto text-red-300 hover:text-red-200 underline text-xs">Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-surface-400 text-sm">Loading...</p>
          </div>
        </div>
      )}

      {/* ==================== OVERVIEW ==================== */}
      {activeTab === 'overview' && !loading && stats && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Companies', value: stats.totalCompanies, icon: Building2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Experiences', value: stats.totalExperiences, icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10' },
              { label: 'Applications', value: stats.totalApplications, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'Pending Verification', value: stats.pendingVerifications, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
                <p className="text-xs text-surface-400 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'View Companies', icon: Building2, tab: 'companies' as Tab, minLevel: 'DIRECTOR' as AdminLevel },
                { label: 'Manage Students', icon: Users, tab: 'students' as Tab, minLevel: 'DIRECTOR' as AdminLevel },
                { label: 'Review Experiences', icon: Eye, tab: 'experiences' as Tab, minLevel: 'MODERATOR' as AdminLevel },
                { label: 'Refresh Data', icon: RefreshCw, tab: null as Tab | null, minLevel: 'MODERATOR' as AdminLevel },
              ].filter(a => {
                const lv: Record<AdminLevel, number> = { SYSTEM_ADMIN: 100, DIRECTOR: 70, ASSOCIATE: 45, MODERATOR: 20 };
                return adminLevel ? (lv[adminLevel] ?? 0) >= (lv[a.minLevel] ?? 0) : false;
              }).map(({ label, icon: Icon, tab }) => (
                <button key={label} onClick={() => tab ? switchTab(tab) : fetchData()}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-surface-800/30 hover:bg-surface-800/60 transition-colors text-sm text-surface-300 hover:text-white">
                  <Icon className="w-4 h-4 text-primary-400" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Placement Chart */}
          {placementReport && placementReport.byCompany && placementReport.byCompany.length > 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Placement Success Rate by Company</h3>
                <span className="text-xs text-surface-400">Overall: {placementReport.successRate}%</span>
              </div>
              <div className="space-y-2">
                {placementReport.byCompany.slice(0, 10).map((c: PlacementCompanyStat) => (
                  <div key={c.company} className="flex items-center gap-3">
                    <span className="text-xs text-surface-300 w-24 truncate text-right shrink-0">{c.company}</span>
                    <div className="flex-1 h-5 rounded-full bg-surface-800 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all"
                        style={{ width: `${Math.min(c.successRate, 100)}%` }} />
                    </div>
                    <span className="text-xs text-surface-400 w-12 text-right shrink-0">{c.successRate}%</span>
                    <span className="text-xs text-surface-500 w-16 text-right shrink-0">({c.offers}/{c.applications})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== STUDENTS ==================== */}
      {activeTab === 'students' && !loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input type="text" placeholder="Search students by email, ID, or branch..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-900/80 border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Branch</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Year</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">CGPA</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="border-b border-white/[0.04] hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-surface-200 font-medium">{s.email}</p>
                        <p className="text-xs text-surface-500 font-mono">{s.anonymizedId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-300">{s.branch}</td>
                    <td className="px-4 py-3 text-surface-300">{s.graduationYear}</td>
                    <td className="px-4 py-3 text-surface-300">{s.cgpaRange}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.role === 'ADMIN' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
                      }`}>{s.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      {s.isActive ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" /> Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-surface-500 text-sm">No students found.</div>
            )}
          </div>
        </div>
      )}

      {/* ==================== COMPANIES ==================== */}
      {activeTab === 'companies' && !loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input type="text" placeholder="Search companies..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCompanies.map((c) => (
              <div key={c.id} className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-5 hover:border-white/[0.1] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{c.name}</h3>
                    <span className="text-xs text-surface-400">{c.sector} • {c.avgCtcRange}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-surface-800/50 p-2.5 text-center">
                    <p className="text-lg font-bold text-white">{c.totalApplications}</p>
                    <p className="text-[10px] text-surface-500">Applications</p>
                  </div>
                  <div className="rounded-lg bg-surface-800/50 p-2.5 text-center">
                    <p className="text-lg font-bold text-emerald-400">{c.totalOffers}</p>
                    <p className="text-[10px] text-surface-500">Offers</p>
                  </div>
                  <div className="rounded-lg bg-surface-800/50 p-2.5 text-center">
                    <p className="text-lg font-bold text-primary-400">{c.avgSuccessRate}%</p>
                    <p className="text-[10px] text-surface-500">Success Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCompanies.length === 0 && (
            <div className="text-center py-12 text-surface-500 text-sm">No companies found.</div>
          )}
        </div>
      )}

      {/* ==================== EXPERIENCES / MODERATION ==================== */}
      {activeTab === 'experiences' && !loading && (
        <div className="space-y-4 animate-fade-in">
          <ModerationQueueTab />
        </div>
      )}

      {/* ==================== ADMIN USERS ==================== */}
      {activeTab === 'users' && !loading && (
        <div className="space-y-4 animate-fade-in">
          {/* Assign Role Form */}
          <div className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <UserCog className="w-4 h-4 text-primary-400" /> Assign Admin Role
            </h3>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-surface-400 mb-1">Student ID</label>
                <input type="number" placeholder="User ID"
                  value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
                  className="input-dark w-full rounded-lg text-sm px-3 py-2.5" />
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Role</label>
                <select value={assignLevel} onChange={e => setAssignLevel(e.target.value as AdminLevel)}
                  className="input-dark rounded-lg text-sm px-3 py-2.5">
                  <option value="MODERATOR">Moderator (20%)</option>
                  <option value="ASSOCIATE">Associate (45%)</option>
                  <option value="DIRECTOR">Director (70%)</option>
                  <option value="SYSTEM_ADMIN">System Admin (100%)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-surface-400 mb-1">Scope</label>
                <select value={assignScope} onChange={e => setAssignScope(e.target.value)}
                  className="input-dark rounded-lg text-sm px-3 py-2.5">
                  <option value="ALL">ALL</option>
                  <option value="BATCH_2025">Batch 2025</option>
                  <option value="BATCH_2026">Batch 2026</option>
                </select>
              </div>
              <button onClick={handleAssignRole} disabled={!assignUserId}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 disabled:opacity-40 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" /> Assign
              </button>
            </div>
            {assignFeedback && <p className="text-xs mt-2 text-emerald-400">{assignFeedback}</p>}
          </div>

          {/* Admin Users Table */}
          <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-900/80 border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Level</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Access</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Scope</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Assigned</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((a) => (
                  <tr key={a.id} className="border-b border-white/[0.04] hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-surface-200 font-medium">{a.email}</p>
                      <p className="text-xs text-surface-500 font-mono">{a.anonymizedId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400">{a.level}</span>
                    </td>
                    <td className="px-4 py-3 text-surface-300">{a.accessLevel}%</td>
                    <td className="px-4 py-3 text-surface-300">{a.scope}</td>
                    <td className="px-4 py-3">
                      {a.isActive ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Active</span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" /> Revoked</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-surface-400 text-xs">{a.assignedAt?.split('T')[0]}</td>
                    <td className="px-4 py-3 text-right">
                      {a.isActive && (
                        <button onClick={() => handleRevokeRole(a.studentId)}
                          className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors" title="Revoke">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {adminUsers.length === 0 && <div className="text-center py-12 text-surface-500 text-sm">No admin users.</div>}
          </div>
        </div>
      )}

      {/* ==================== AUDIT LOGS ==================== */}
      {activeTab === 'audit' && !loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-900/80 border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Admin</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Target</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/[0.04] hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-700 text-surface-200">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-surface-300">{log.adminEmail}</td>
                    <td className="px-4 py-3 text-surface-400">{log.targetType} #{log.targetId}</td>
                    <td className="px-4 py-3 text-surface-400 text-xs max-w-[200px] truncate">{log.changeReason || '-'}</td>
                    <td className="px-4 py-3 text-surface-500 text-xs">{log.createdAt?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {auditLogs.length === 0 && (
              <div className="text-center py-12 text-surface-500 text-sm">No audit log entries yet.</div>
            )}
          </div>
        </div>
      )}

      {/* ==================== NOTIFICATIONS ==================== */}
      {activeTab === 'notifications' && !loading && (
        <NotifyTab />
      )}
    </div>
  );
}

/* ── Moderation Queue Tab ── */
function ModerationQueueTab() {
  const { adminLevel, hasPermission } = useAuth();
  const [queue, setQueue] = useState<ModerationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminService.getModerationQueue(0, 50);
      setQueue(result.content);
    } catch { setQueue([]); }
    finally { setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const canVerify = adminLevel && (hasPermission('EXPERIENCE:VERIFY') || (adminLevel === 'DIRECTOR' || adminLevel === 'SYSTEM_ADMIN'));
  const canFlag = hasPermission('EXPERIENCE:FLAG');

  const handleVerify = async (id: number) => {
    try {
      await adminService.verifyExperience(id);
      setActionFeedback(`Experience #${id} verified`);
      fetchQueue();
    } catch (e) { setActionFeedback(getErrorMessage(e, 'Verify failed')); }
  };

  const handleFlag = async (id: number) => {
    try {
      await adminService.flagExperience(id, { reason: 'Flagged via admin panel' });
      setActionFeedback(`Experience #${id} flagged`);
      fetchQueue();
    } catch (e) { setActionFeedback(getErrorMessage(e, 'Flag failed')); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionFeedback && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600/15 border border-primary-500/20 text-primary-300 text-sm">
          <CheckCircle2 className="w-4 h-4" /> {actionFeedback}
          <button onClick={() => setActionFeedback(null)} className="ml-auto text-primary-400 hover:text-primary-300">✕</button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Flag className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Moderation Queue</h3>
        <span className="text-xs text-surface-500">({queue.length} flagged)</span>
      </div>
      <div className="rounded-xl border border-white/[0.06] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-900/80 border-b border-white/[0.06]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Reason</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((exp: ModerationQueueItem) => (
              <tr key={exp.id} className="border-b border-white/[0.04] hover:bg-surface-800/30 transition-colors">
                <td className="px-4 py-3 text-surface-200 font-mono text-xs">#{exp.id}</td>
                <td className="px-4 py-3 text-surface-400 text-xs max-w-[300px] truncate">{exp.flagReason || 'Flagged'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {canVerify && (
                      <button onClick={() => handleVerify(exp.id)}
                        className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-emerald-400 transition-colors" title="Verify">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {canFlag && (
                      <button onClick={() => handleFlag(exp.id)}
                        className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors" title="Flag">
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {queue.length === 0 && <div className="text-center py-12 text-surface-500 text-sm">No flagged experiences.</div>}
      </div>
    </div>
  );
}

/* ── Notifications Tab ── */
function NotifyTab() {
  const [group, setGroup] = useState('all');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await adminService.sendNotification({ recipientGroup: group, message: message.trim() });
      setSent(true);
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  return (
    <div className="max-w-lg space-y-4 animate-fade-in">
      <div className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-400" /> Send Notification
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-surface-400 mb-1">Recipient Group</label>
            <select value={group} onChange={e => setGroup(e.target.value)}
              className="input-dark w-full rounded-lg text-sm px-3 py-2.5">
              <option value="ALL">All Students</option>
              <option value="BATCH_2025">Batch 2025</option>
              <option value="BATCH_2026">Batch 2026</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-surface-400 mb-1">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)}
              className="input-dark w-full rounded-lg text-sm px-3 py-2.5 min-h-[100px] resize-y"
              placeholder="Type your announcement..." />
          </div>
          <button onClick={handleSend} disabled={sending || !message.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium">
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
          {sent && <p className="text-xs text-emerald-400 text-center">✅ Notification sent (logged)</p>}
        </div>
      </div>
    </div>
  );
}