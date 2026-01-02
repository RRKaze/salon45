import { inject, injectable } from "tsyringe";
import type { IAppointmentDataAccessor } from "../dataAccess/IAppointmentDataAccessor";
import { AppointmentResponseDto } from "../dtos/AppointmentResponseDto.ts";

export interface IGetAppointmentsService {
  getAppointments(
    userId?: string,
    pageSize?: number,
    lastAppointmentId?: string,
  ): Promise<AppointmentResponseDto[]>;
}

@injectable()
export class GetAppointmentsService implements IGetAppointmentsService {
  constructor(
    @inject("IAppointmentDataAccessor")
    private appointmentDataAccessor: IAppointmentDataAccessor,
  ) {}

  async getAppointments(
    userId?: string,
    pageSize: number = 10,
    lastAppointmentId?: string,
  ): Promise<AppointmentResponseDto[]> {
    // Get appointments from a wide date range (past and future)
    const from = new Date(0); // Start of epoch
    const until = new Date("2100-01-01"); // Far future

    let appointments = await this.appointmentDataAccessor.get(
      from,
      until,
      pageSize * 10, // Get more to filter
      userId,
    );

    // Filter by lastAppointmentId if provided
    if (lastAppointmentId) {
      const lastIdIndex = appointments.findIndex(
        (apt) => apt._id === lastAppointmentId,
      );
      if (lastIdIndex >= 0) {
        appointments = appointments.slice(lastIdIndex + 1);
      }
    }

    // Sort by startTime descending (newest first)
    appointments.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

    // Limit to pageSize
    appointments = appointments.slice(0, pageSize);

    return appointments.map((apt) => new AppointmentResponseDto(apt));
  }
}
