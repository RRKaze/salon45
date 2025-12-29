import type { Appointment } from "../models/Appointment";
import { AppointmentStatus } from "../models/AppointmentStatus.ts";

export class AppointmentResponseDto {
  id: string;
  appointmentDateTime: string;
  bookedDateTime: string;
  status: "pending" | "completed" | "missed" | "canceled";

  constructor(appointment: Appointment) {
    this.id = appointment._id;
    this.appointmentDateTime = appointment.startTime.toISOString();
    this.bookedDateTime = appointment.createdAt.toISOString();

    // Map AppointmentStatus enum to string
    switch (appointment.status) {
      case AppointmentStatus.Requested:
        this.status = "pending";
        break;
      case AppointmentStatus.Confirmed:
        this.status = "pending"; // Frontend uses "pending" for confirmed appointments
        break;
      case AppointmentStatus.Canceled:
        this.status = "canceled";
        break;
      case AppointmentStatus.Completed:
        this.status = "completed";
        break;
      case AppointmentStatus.Missed:
        this.status = "missed";
        break;
      default:
        this.status = "pending";
    }
  }
}
