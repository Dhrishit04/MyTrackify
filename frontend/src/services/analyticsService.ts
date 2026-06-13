// ============================================
// Analytics Service — Mock analytics data
// ============================================

import type { DashboardStats, ReadinessAnalysis } from '../types';
import { dashboardStats, readinessData } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(600);
    return dashboardStats;
  },

  async getReadiness(companyId: number): Promise<ReadinessAnalysis> {
    await delay(800);
    // Return mock readiness with adjusted company name
    return {
      ...readinessData,
      companyId,
    };
  },
};
