// ============================================
// Admin Panel — Full system access
// ============================================

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Users, Building2, FileText, TrendingUp, Trash2, Edit3, Plus, Search,
  Shield, Activity, Database, AlertTriangle, CheckCircle2, XCircle, Eye, RefreshCw,
} from 'lucide-react';

// Types for admin data
interface AdminStudent {
  id: number;
  email: string;
  anonymizedId: string;
  branch: string;
  graduationYear: number;
  cgpaRange: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface AdminCompany {
  id: number;
  name: string;
  sector: string;
  avgCtcRange: string;
  totalApplications: number;
  totalOffers: number;
  avgSuccessRate: number;
}

interface SystemStats {
  totalStudents: number;
  totalCompanies: number;
  totalExperiences: number;
  totalApplications: number;
  activeUsers: number;
  pendingVerifications: number;
}

// Mock admin data
const mockStats: SystemStats = {
  totalStudents: 312,
  totalCompanies: 12,
  totalExperiences: 547,
  totalApplications: 1842,
  activeUsers: 189,
  pendingVerifications: 23,
};

const mockStudents: AdminStudent[] = [
  { id: 1, email: 'dhrishit@college.edu', anonymizedId: 'STUDENT_1520D97D', branch: 'Computer Science', graduationYear: 2025, cgpaRange: '8.5-9.0', role: 'STUDENT', isActive: true, createdAt: '2026-04-20' },
  { id: 2, email: 'rahul@college.edu', anonymizedId: 'STUDENT_A8F3B2C1', branch: 'Information Technology', graduationYear: 2025, cgpaRange: '8.0-8.5', role: 'STUDENT', isActive: true, createdAt: '2026-04-18' },
  { id: 3, email: 'priya@college.edu', anonymizedId: 'STUDENT_C4D9E6F0', branch: 'Electronics & Communication', graduationYear: 2026, cgpaRange: '9.0-10.0', role: 'STUDENT', isActive: true, createdAt: '2026-04-15' },
  { id: 4, email: 'admin@mytrackify.com', anonymizedId: 'ADMIN_00000001', branch: 'System', graduationYear: 2025, cgpaRange: 'N/A', role: 'ADMIN', isActive: true, createdAt: '2026-01-01' },
  { id: 5, email: 'amit@college.edu', anonymizedId: 'STUDENT_F7G2H8I3', branch: 'Mechanical Engineering', graduationYear: 2025, cgpaRange: '7.0-7.5', role: 'STUDENT', isActive: false, createdAt: '2026-03-10' },
];

const mockCompanies: AdminCompany[] = [
  { id: 1, name: 'Google', sector: 'Product', avgCtcRange: '18-22 LPA', totalApplications: 47, totalOffers: 6, avgSuccessRate: 12.7 },
  { id: 2, name: 'Microsoft', sector: 'Product', avgCtcRange: '16-20 LPA', totalApplications: 52, totalOffers: 10, avgSuccessRate: 19.2 },
  { id: 3, name: 'Amazon', sector: 'Product', avgCtcRange: '14-18 LPA', totalApplications: 63, totalOffers: 15, avgSuccessRate: 23.8 },
  { id: 4, name: 'Goldman Sachs', sector: 'Trading', avgCtcRange: '20-28 LPA', totalApplications: 38, totalOffers: 5, avgSuccessRate: 13.2 },
  { id: 5, name: 'Flipkart', sector: 'Product', avgCtcRange: '14-17 LPA', totalApplications: 45, totalOffers: 12, avgSuccessRate: 26.7 },
  { id: 6, name: 'Deloitte', sector: 'Consulting', avgCtcRange: '8-12 LPA', totalApplications: 72, totalOffers: 25, avgSuccessRate: 34.7 },
  { id: 7, name: 'Infosys', sector: 'Service', avgCtcRange: '4-8 LPA', totalApplications: 120, totalOffers: 65, avgSuccessRate: 54.2 },
  { id: 8, name: 'Adobe', sector: 'Product', avgCtcRange: '18-25 LPA', totalApplications: 35, totalOffers: 4, avgSuccessRate: 11.4 },
];

type Tab = 'overview' | 'students' | 'companies' | 'experiences';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats] = useState<SystemStats>(mockStats);
  const [students] = useState<AdminStudent[]>(mockStudents);
  const [companies] = useState<AdminCompany[]>(mockCompanies);

  // Only admins can access this
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Activity },
    { id: 'students' as Tab, label: 'Students', icon: Users },
    { id: 'companies' as Tab, label: 'Companies', icon: Building2 },
    { id: 'experiences' as Tab, label: 'Experiences', icon: FileText },
  ];

  const filteredStudents = students.filter(s =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.anonymizedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            ADMIN ACCESS
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-900/50 border border-white/[0.06] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats Grid */}
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
                { label: 'Add Company', icon: Plus, action: () => setActiveTab('companies') },
                { label: 'Manage Students', icon: Users, action: () => setActiveTab('students') },
                { label: 'Review Experiences', icon: Eye, action: () => setActiveTab('experiences') },
                { label: 'Refresh Data', icon: RefreshCw, action: () => window.location.reload() },
              ].map(({ label, icon: Icon, action }) => (
                <button key={label} onClick={action}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-surface-800/30 hover:bg-surface-800/60 transition-colors text-sm text-surface-300 hover:text-white">
                  <Icon className="w-4 h-4 text-primary-400" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Database Info */}
          <div className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Database Connection</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-surface-500 text-xs mb-0.5">Host</p>
                <p className="text-surface-200 font-mono text-xs">localhost:5432</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs mb-0.5">Database</p>
                <p className="text-surface-200 font-mono text-xs">mytrackify</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs mb-0.5">Status</p>
                <p className="text-emerald-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Connected</p>
              </div>
              <div>
                <p className="text-surface-500 text-xs mb-0.5">Engine</p>
                <p className="text-surface-200 font-mono text-xs">PostgreSQL 17.9</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input type="text" placeholder="Search students by email, ID, or branch..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-900/80 border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Branch</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Year</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">CGPA</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-white/[0.04] hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-surface-200 font-medium">{student.email}</p>
                        <p className="text-xs text-surface-500 font-mono">{student.anonymizedId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-300">{student.branch}</td>
                    <td className="px-4 py-3 text-surface-300">{student.graduationYear}</td>
                    <td className="px-4 py-3 text-surface-300">{student.cgpaRange}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        student.role === 'ADMIN'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {student.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {student.isActive ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-red-400">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-primary-400 transition-colors" title="Edit">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-12 text-surface-500 text-sm">No students found matching your search.</div>
            )}
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input type="text" placeholder="Search companies..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600/20 text-primary-300 hover:bg-primary-600/30 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Company
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="rounded-xl border border-white/[0.06] bg-surface-900/50 p-5 hover:border-white/[0.1] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">{company.name}</h3>
                    <span className="text-xs text-surface-400">{company.sector} • {company.avgCtcRange}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-primary-400 transition-colors" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-surface-800/50 p-2.5 text-center">
                    <p className="text-lg font-bold text-white">{company.totalApplications}</p>
                    <p className="text-[10px] text-surface-500">Applications</p>
                  </div>
                  <div className="rounded-lg bg-surface-800/50 p-2.5 text-center">
                    <p className="text-lg font-bold text-emerald-400">{company.totalOffers}</p>
                    <p className="text-[10px] text-surface-500">Offers</p>
                  </div>
                  <div className="rounded-lg bg-surface-800/50 p-2.5 text-center">
                    <p className="text-lg font-bold text-primary-400">{company.avgSuccessRate}%</p>
                    <p className="text-[10px] text-surface-500">Success Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredCompanies.length === 0 && (
            <div className="text-center py-12 text-surface-500 text-sm">No companies found matching your search.</div>
          )}
        </div>
      )}

      {/* Experiences Tab */}
      {activeTab === 'experiences' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input type="text" placeholder="Search experiences..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-2.5 rounded-lg text-sm" />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-900/80 border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Company</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Round</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Difficulty</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Verified</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, company: 'Google', round: 'Online Assessment', student: 'STUDENT_1520D97D', difficulty: 3, verified: false, helpful: 12 },
                  { id: 2, company: 'Google', round: 'Technical Interview', student: 'STUDENT_1520D97D', difficulty: 4, verified: false, helpful: 8 },
                  { id: 3, company: 'Microsoft', round: 'Coding Round', student: 'STUDENT_A8F3B2C1', difficulty: 3, verified: true, helpful: 24 },
                  { id: 4, company: 'Amazon', round: 'System Design', student: 'STUDENT_C4D9E6F0', difficulty: 5, verified: true, helpful: 31 },
                  { id: 5, company: 'Goldman Sachs', round: 'Aptitude Test', student: 'STUDENT_A8F3B2C1', difficulty: 2, verified: false, helpful: 6 },
                ].map((exp) => (
                  <tr key={exp.id} className="border-b border-white/[0.04] hover:bg-surface-800/30 transition-colors">
                    <td className="px-4 py-3 text-surface-200 font-medium">{exp.company}</td>
                    <td className="px-4 py-3 text-surface-300">{exp.round}</td>
                    <td className="px-4 py-3 text-surface-400 font-mono text-xs">{exp.student}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className={`w-2 h-2 rounded-full ${star <= exp.difficulty ? 'bg-amber-400' : 'bg-surface-700'}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {exp.verified ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-400">
                          <AlertTriangle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-emerald-400 transition-colors" title="Verify">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
