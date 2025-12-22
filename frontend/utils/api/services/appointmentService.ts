import { api } from '../client';

export interface TimeRange {
    start: string;
    end: string;
}

export interface DayAvailability {
    date: string;
    timeRanges: TimeRange[];
}

export const appointmentService = {
    getAvailability: async (offset: number, days: number = 5) => {
        return api.get<DayAvailability[]>(
            `/api/appointments/availability?offset=${offset}&days=${days}`
        );
    },

    bookAppointment: async (date: string, startTime: string) => {
        return api.post('/api/appointments', { date, startTime });
    },
};