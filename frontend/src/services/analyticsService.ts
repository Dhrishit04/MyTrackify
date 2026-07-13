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
    return {
      ...readinessData,
      companyId,
    };
  },
};
