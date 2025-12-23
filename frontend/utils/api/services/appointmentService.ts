import {api} from '../client';

/**
 * start: Time in HH:mm format (e.g. "15:00")
 * end: Same
 */
export interface TimeRange {
    start: string;
    end: string;
}

/**
 * date: ISO date format (e.g. "2025-01-31")
 */
export interface DayAvailability {
    date: string;
    timeRanges: TimeRange[];
}

export interface Appointment {
    id: string;
    appointmentDateTime: string;
    bookedDateTime: string;
    status: 'pending' | 'completed' | 'missed' | 'canceled';
}

/**
 * availableDays: Availability in the listed days.
 * more: Whether there are more days available after the last day in the array.
 *       If true, the user can make another request to get more days.
 */
export interface AvailabilityResponse {
    availableDays: DayAvailability[];
    more: boolean;
}

interface IAppointmentService {
    getAvailability(offset: number, days: number): Promise<AvailabilityResponse>;

    bookAppointment(date: string, startTime: string): Promise<unknown>;

    getAppointments(pageSize: number, lastAppointmentId?: string): Promise<Appointment[]>;

    cancelAppointment(appointmentId: string): Promise<unknown>;
}

export class AppointmentServiceProvider {
    static get(): IAppointmentService {
        return new FakeAppointmentService();
    }
}

class AppointmentService implements IAppointmentService {
    async getAvailability(offset: number, days: number = 5) {
        return api.get<AvailabilityResponse>(
            `/api/appointments/availability?offset=${offset}&days=${days}`
        );
    }

    async bookAppointment(date: string, startTime: string) {
        return api.post('/api/appointments', {date, startTime});
    }

    async getAppointments(pageSize: number, lastAppointmentId?: string) {
        const params = new URLSearchParams({pageSize: pageSize.toString()});
        if (lastAppointmentId) {
            params.append('lastId', lastAppointmentId);
        }
        return api.get<Appointment[]>(`/api/appointments?${params.toString()}`);
    }

    async cancelAppointment(appointmentId: string) {
        return api.delete(`/api/appointments/${appointmentId}`);
    }
}

class FakeAppointmentService implements IAppointmentService {
    public async getAvailability(offset: number, days: number = 5) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const mockData: DayAvailability[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const dayOffset = offset * days + i;
            const date = new Date(today);
            date.setDate(today.getDate() + dayOffset);

            // Format date as YYYY-MM-DD (local timezone)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            // Generate mock time slots
            const timeRanges: TimeRange[] = [];
            const allPossibleSlots = [
                { start: "09:00", end: "10:00" },
                { start: "10:00", end: "11:00" },
                { start: "11:00", end: "12:00" },
                { start: "13:00", end: "14:00" },
                { start: "14:00", end: "15:00" },
                { start: "15:00", end: "16:00" },
                { start: "16:00", end: "17:00" },
                { start: "17:00", end: "18:00" },
            ];

            // Randomly make some slots available (simulating real availability)
            allPossibleSlots.forEach(slot => {
                if (Math.random() > 0.3) { // 70% chance of being available
                    timeRanges.push(slot);
                }
            });

            mockData.push({
                date: dateString,
                timeRanges,
            });
        }

        return {
            availableDays: mockData,
            more: offset < 3,
        } as AvailabilityResponse;
    }

    public async getAppointments() {
        return [];
    }

    public async bookAppointment() {
        return { };
    }

    public async cancelAppointment() {
        return { };
    }
}