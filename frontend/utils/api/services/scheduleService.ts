// utils/api/services/scheduleService.ts
import { api } from '../client';
import { NormalSchedule } from '@/models/normalSchedule';

export const scheduleService = {
  getSchedules: async (pageSize: number, afterId?: string | null) => {
    const params = new URLSearchParams({ pageSize: pageSize.toString() });
    if (afterId) {
        params.append('afterId', afterId);
    }

    return api.get<NormalSchedule[]>(`/api/admin/schedules?${params}`);
  },
  
  getScheduleById: async (id: string) => {
    return api.get<NormalSchedule>(`/api/admin/schedules/${encodeURIComponent(id)}`);
  },
  
  updateSchedule: async (id: string, schedule: NormalSchedule) => {
    return api.put<NormalSchedule>(
      `/api/admin/schedules/${encodeURIComponent(id)}`,
      schedule
    );
  },
};