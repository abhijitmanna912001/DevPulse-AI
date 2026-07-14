import { apiClient } from './client';
import type { DashboardResponse } from '../types/dashboard';

export type DailyCheckInPayload = {
  entryDate: string;
  sleepHours: number;
  moodScore: number;
  energyScore: number;
  workHours: number;
  codingMinutes: number;
  steps: number;
  breakCount: number;
  notes?: string;
};

export async function saveDailyCheckIn(payload: DailyCheckInPayload): Promise<DashboardResponse> {
  const response = await apiClient.post<DashboardResponse>('/wellness/entries', payload);

  return response.data;
}
