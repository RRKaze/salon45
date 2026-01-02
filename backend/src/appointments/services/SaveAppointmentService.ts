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

/**
 * Converts a date string (YYYY-MM-DD) and time string (HH:mm) interpreted as EST/EDT
 * to a UTC Date object for storage in the database.
 *
 * EST is UTC-5, EDT is UTC-4 (Daylight Saving Time: March to November)
 */
function estToUtcDate(dateString: string, timeString: string): Date {
  const dateParts = dateString.split("-").map(Number);
  const timeParts = timeString.split(":").map(Number);

  if (dateParts.length !== 3 || timeParts.length !== 2) {
    throw new Error("Invalid date or time format");
  }

  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const hours = timeParts[0];
  const minutes = timeParts[1];

  if (
    year === undefined ||
    month === undefined ||
    day === undefined ||
    hours === undefined ||
    minutes === undefined ||
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    isNaN(hours) ||
    isNaN(minutes)
  ) {
    throw new Error("Invalid date or time values");
  }

  // Create a date in UTC, treating the input hours/minutes as EST/EDT time
  // We'll manually adjust for EST/EDT offset
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));

  // Determine if the date is in DST (EDT) or not (EST)
  // DST in US: Second Sunday in March to First Sunday in November
  const isDST = isDateInDST(year, month - 1, day);
  const offsetHours = isDST ? 4 : 5; // EDT is UTC-4, EST is UTC-5

  // ADD the offset to convert EST/EDT to UTC
  // EST is UTC-5, so 2:00 PM EST = 7:00 PM UTC (add 5 hours)
  // EDT is UTC-4, so 2:00 PM EDT = 6:00 PM UTC (add 4 hours)
  date.setUTCHours(date.getUTCHours() + offsetHours);

  return date;
}

/**
 * Determines if a date is in Daylight Saving Time (EDT) or Standard Time (EST)
 * DST in US: Second Sunday in March to First Sunday in November
 */
function isDateInDST(year: number, month: number, day: number): boolean {
  // DST starts: Second Sunday in March
  const marchFirst = new Date(Date.UTC(year, 2, 1)); // March is month 2 (0-indexed)
  const marchFirstDay = marchFirst.getUTCDay(); // 0 = Sunday
  const daysToSecondSunday = ((7 - marchFirstDay) % 7) + 7; // Days to second Sunday
  const dstStart = new Date(Date.UTC(year, 2, 1 + daysToSecondSunday));

  // DST ends: First Sunday in November
  const novemberFirst = new Date(Date.UTC(year, 10, 1)); // November is month 10
  const novemberFirstDay = novemberFirst.getUTCDay();
  const daysToFirstSunday = (7 - novemberFirstDay) % 7;
  const dstEnd = new Date(Date.UTC(year, 10, 1 + daysToFirstSunday));

  const checkDate = new Date(Date.UTC(year, month, day));

  // DST is active if date is on or after DST start and before DST end
  return checkDate >= dstStart && checkDate < dstEnd;
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

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid date format. Expected YYYY-MM-DD");
    }

    // Convert EST/EDT date and time to UTC Date object
    const appointmentDate = estToUtcDate(date, startTime);

    // Calculate end time (assuming 1 hour appointments) in EST/EDT, then convert to UTC
    const endHours = (hours + 1) % 24;
    const endMinutes = minutes;
    const endTimeString = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
    const endTime = estToUtcDate(date, endTimeString);

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
