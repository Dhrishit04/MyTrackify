import type { Company, CompanyWithProcess, InterviewExperience, CompanyFilters, RoundStats } from '../types';
import { companies, interviewProcesses, interviewExperiences, companyRoundStats } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const companyService = {
  async getCompanies(filters?: CompanyFilters): Promise<Company[]> {
    await delay(500);
    let result = [...companies];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.sector.toLowerCase().includes(search)
      );
    }

    if (filters?.sector && filters.sector !== 'all') {
      result = result.filter(c => c.sector === filters.sector);
    }

    if (filters?.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'name': comparison = a.name.localeCompare(b.name); break;
          case 'successRate': comparison = a.avgSuccessRate - b.avgSuccessRate; break;
          case 'totalApplications': comparison = a.totalApplications - b.totalApplications; break;
          default: comparison = 0;
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  },

  async getCompanyById(id: number): Promise<CompanyWithProcess> {
    await delay(400);
    const company = companies.find(c => c.id === id);
    if (!company) throw new Error('Company not found');

    const process = interviewProcesses.find(p => p.companyId === id && p.isCurrent) || null;
    const experiences = interviewExperiences.filter(e => e.companyName === company.name);

    return {
      ...company,
      currentProcess: process,
      recentExperiences: experiences,
    };
  },

  async getCompanyExperiences(companyId: number, page = 1, pageSize = 10): Promise<{
    experiences: InterviewExperience[];
    total: number;
    hasMore: boolean;
  }> {
    await delay(300);
    const company = companies.find(c => c.id === companyId);
    if (!company) throw new Error('Company not found');

    const allExperiences = interviewExperiences.filter(e => e.companyName === company.name);
    const start = (page - 1) * pageSize;
    const paged = allExperiences.slice(start, start + pageSize);

    return {
      experiences: paged,
      total: allExperiences.length,
      hasMore: start + pageSize < allExperiences.length,
    };
  },

  async getRoundStats(companyId: number): Promise<RoundStats[]> {
    await delay(300);
    return companyRoundStats[companyId] || [];
  },
};
