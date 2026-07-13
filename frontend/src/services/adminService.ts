import api from './api';
import type {
  AdminUserSummary,
  AdminDashboardStats,
  AssignRoleRequest,
  RevokeRoleRequest,
  AuditLogEntry,
  Company,
  StudentProfile,
  InterviewExperience,
  FlagExperienceRequest,
  RevisionRequest,
  NotificationRequest,
} from '../types';

export const adminService = {
  async getDashboard(): Promise<AdminDashboardStats> {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
  },

  async getStudents(): Promise<StudentProfile[]> {
    const res = await api.get('/admin/students');
    return res.data.data;
  },

  async getCompanies(): Promise<Company[]> {
    const res = await api.get('/admin/companies');
    return res.data.data;
  },

  async getAdmins(): Promise<AdminUserSummary[]> {
    const res = await api.get('/admin/users');
    return res.data.data;
  },

  async assignRole(userId: number, request: AssignRoleRequest): Promise<AdminUserSummary> {
    const res = await api.post(`/admin/users/${userId}/assign-role`, request);
    return res.data.data;
  },

  async revokeRole(userId: number, request: RevokeRoleRequest): Promise<AdminUserSummary> {
    const res = await api.post(`/admin/users/${userId}/revoke-role`, request);
    return res.data.data;
  },

  async getAuditLogs(params?: {
    page?: number;
    size?: number;
    action?: string;
    adminEmail?: string;
  }): Promise<{ content: AuditLogEntry[]; totalElements: number }> {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data.data;
  },

  async verifyExperience(experienceId: number): Promise<InterviewExperience> {
    const res = await api.post(`/admin/experiences/${experienceId}/verify`);
    return res.data.data;
  },

  async flagExperience(experienceId: number, request: FlagExperienceRequest): Promise<InterviewExperience> {
    const res = await api.post(`/admin/experiences/${experienceId}/flag`, request);
    return res.data.data;
  },

  async requestRevision(experienceId: number, request: RevisionRequest): Promise<InterviewExperience> {
    const res = await api.post(`/admin/experiences/${experienceId}/request-revision`, request);
    return res.data.data;
  },

  async verifyProcess(processId: number): Promise<void> {
    await api.post(`/admin/processes/${processId}/verify`);
  },

  async sendNotification(request: NotificationRequest): Promise<{ status: string; recipientGroup: string; message: string }> {
    const res = await api.post('/admin/notifications/send', request);
    return res.data.data;
  },

  async getModerationQueue(page = 0, size = 20): Promise<{ content: InterviewExperience[]; totalElements: number }> {
    const res = await api.get('/admin/moderation/queue', { params: { page, size } });
    return res.data.data;
  },

  async getPlacementReport(): Promise<{ byCompany: any[]; totalApplications: number; totalOffers: number; successRate: number }> {
    const res = await api.get('/admin/reports/placement');
    return res.data.data;
  },

  async exportCompaniesCsv(): Promise<string> {
    const res = await api.get('/admin/data/export', { responseType: 'text' });
    return typeof res.data === 'string' ? res.data : res.data.data;
  },
};