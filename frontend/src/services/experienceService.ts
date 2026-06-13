// ============================================
// Experience Service — Mock experience logging
// ============================================

import type { LogExperienceRequest, InterviewExperience } from '../types';
import { interviewExperiences } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const experienceService = {
  async logExperience(data: LogExperienceRequest): Promise<{ success: boolean; message: string }> {
    await delay(1200);
    // Simulate successful logging
    console.log('Experience logged:', data);
    return {
      success: true,
      message: 'Your interview experience has been logged successfully! Thank you for helping future batches.',
    };
  },

  async getMyExperiences(): Promise<InterviewExperience[]> {
    await delay(400);
    // Return first few experiences as "mine"
    return interviewExperiences.slice(0, 3);
  },

  async upvoteExperience(experienceId: number): Promise<{ helpfulCount: number }> {
    await delay(200);
    const exp = interviewExperiences.find(e => e.id === experienceId);
    if (exp) {
      exp.helpfulCount += 1;
    }
    return { helpfulCount: exp?.helpfulCount || 0 };
  },
};
