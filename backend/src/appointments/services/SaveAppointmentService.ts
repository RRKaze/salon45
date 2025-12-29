import { inject, injectable } from "tsyringe";
import type { IAppointmentDataAccessor } from "../dataAccess/IAppointmentDataAccessor";
import { Appointment } from "../models/Appointment.ts";
import { AppointmentResponseDto } from "../dtos/AppointmentResponseDto.ts";

export interface ISaveAppointmentService {
  saveAppointment(
    userId: string,
    date: string,
    startTime: string,
  ): Promise<AppointmentResponseDto>;
}

@injectable()
export class SaveAppointmentService implements ISaveAppointmentService {
  constructor(
    @inject("IAppointmentDataAccessor")
    private appointmentDataAccessor: IAppointmentDataAccessor,
  ) {}

  async saveAppointment(
    userId: string,
    date: string,
    startTime: string,
  ): Promise<AppointmentResponseDto> {
    // Parse date and time
    const timeParts = startTime.split(":");
    if (timeParts.length !== 2 || !timeParts[0] || !timeParts[1]) {
      throw new Error("Invalid startTime format. Expected HH:mm");
    }
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
      throw new Error("Invalid startTime format. Expected HH:mm");
    }

    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Calculate end time (assuming 1 hour appointments)
    const endTime = new Date(appointmentDate);
    endTime.setHours(endTime.getHours() + 1);

    // Create new appointment with status as Requested (which maps to "pending")
    const appointment = Appointment.NewAppointment(
      userId,
      appointmentDate,
      endTime,
    );

    // Save to database
    const appointmentId = await this.appointmentDataAccessor.save(appointment);
    appointment._id = appointmentId as string;

    return new AppointmentResponseDto(appointment);
  }
}
