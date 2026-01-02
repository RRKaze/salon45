import { type Request, type Response } from "express";
import { injectable, inject } from "tsyringe";
import type { ISaveAppointmentService } from "../services/SaveAppointmentService";
import type { IGetAppointmentsService } from "../services/GetAppointments";
import type { IAppointmentDataAccessor } from "../dataAccess/IAppointmentDataAccessor";
import { AppointmentStatus } from "../models/AppointmentStatus.ts";
import { AppointmentResponseDto } from "../dtos/AppointmentResponseDto.ts";
import { ObjectId } from "mongodb";
import type { User } from "../../users/models/User";

@injectable()
export class AppointmentController {
  constructor(
    @inject("ISaveAppointmentService")
    private saveAppointmentService: ISaveAppointmentService,
    @inject("IGetAppointmentsService")
    private getAppointmentsService: IGetAppointmentsService,
    @inject("IAppointmentDataAccessor")
    private appointmentDataAccessor: IAppointmentDataAccessor,
  ) {}

  public async createAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = req.user as User;
      const { date, startTime } = req.body;

      if (!date || !startTime) {
        return res
          .status(400)
          .json({ error: "Date and startTime are required" });
      }

      const appointmentDto = await this.saveAppointmentService.saveAppointment(
        user._id,
        date,
        startTime,
      );

      return res.status(201).json(appointmentDto);
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      const errorMessage =
        error?.message || error?.description || "Failed to create appointment";
      return res.status(400).json({ error: errorMessage });
    }
  }

  public async getAppointments(req: Request, res: Response) {
    try {
      const userId = req.user ? (req.user as User)._id : undefined;
      const pageSize = req.query["pageSize"]
        ? parseInt(req.query["pageSize"] as string, 10)
        : 10;
      const lastId = req.query["lastId"] as string | undefined;

      const appointments = await this.getAppointmentsService.getAppointments(
        userId,
        pageSize,
        lastId,
      );

      return res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async getAvailability(req: Request, res: Response) {
    try {
      const offset = req.query["offset"]
        ? parseInt(req.query["offset"] as string, 10)
        : 0;
      const days = req.query["days"]
        ? parseInt(req.query["days"] as string, 10)
        : 5;

      // Generate available time slots
      // Default schedule: 9 AM to 6 PM with 1-hour slots
      const availableDays: Array<{
        date: string;
        timeRanges: Array<{ start: string; end: string }>;
      }> = [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Generate time slots for each day
      for (let i = 0; i < days; i++) {
        const dayOffset = offset * days + i;
        const date = new Date(today);
        date.setDate(today.getDate() + dayOffset);

        // Format date as YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        // Generate 1-hour time slots from 9 AM to 6 PM
        const timeRanges: Array<{ start: string; end: string }> = [];
        for (let hour = 9; hour < 18; hour++) {
          const startHour = String(hour).padStart(2, "0");
          const endHour = String(hour + 1).padStart(2, "0");
          timeRanges.push({
            start: `${startHour}:00`,
            end: `${endHour}:00`,
          });
        }

        availableDays.push({
          date: dateString,
          timeRanges,
        });
      }

      // Get existing appointments to filter out taken slots
      const from = new Date(today);
      from.setDate(today.getDate() + offset * days);
      const until = new Date(today);
      until.setDate(today.getDate() + offset * days + days);

      const existingAppointments = await this.appointmentDataAccessor.get(
        from,
        until,
        1000,
      );

      /**
       * Converts a UTC Date to EST/EDT time and returns hours and minutes as a string (HH:mm)
       */
      const utcToEstTime = (utcDate: Date): string => {
        // Get UTC time components
        const utcHours = utcDate.getUTCHours();
        const utcMinutes = utcDate.getUTCMinutes();
        const utcYear = utcDate.getUTCFullYear();
        const utcMonth = utcDate.getUTCMonth();
        const utcDay = utcDate.getUTCDate();

        // Determine if the date is in DST (EDT) or not (EST)
        // DST in US: Second Sunday in March to First Sunday in November
        const isDST = isDateInDST(utcYear, utcMonth, utcDay);
        const offsetHours = isDST ? 4 : 5; // EDT is UTC-4, EST is UTC-5

        // Convert UTC to EST/EDT
        // EST is UTC-5, so 7:00 PM UTC = 2:00 PM EST (subtract 5 hours)
        // EDT is UTC-4, so 6:00 PM UTC = 2:00 PM EDT (subtract 4 hours)
        let estHours = utcHours - offsetHours;
        let estMinutes = utcMinutes;

        // Handle day rollover
        if (estHours >= 24) {
          estHours -= 24;
        } else if (estHours < 0) {
          estHours += 24;
        }

        return `${String(estHours).padStart(2, "0")}:${String(estMinutes).padStart(2, "0")}`;
      };

      /**
       * Determines if a date is in Daylight Saving Time (EDT) or Standard Time (EST)
       */
      const isDateInDST = (
        year: number,
        month: number,
        day: number,
      ): boolean => {
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
      };

      // Filter out taken slots
      const filteredDays = availableDays.map((day) => {
        // Parse the day date to compare with appointment dates
        const dateParts = day.date.split("-").map(Number);
        if (dateParts.length !== 3) {
          return day; // Skip if invalid date format
        }
        const year = dateParts[0];
        const month = dateParts[1];
        const dayNum = dateParts[2];

        if (year === undefined || month === undefined || dayNum === undefined) {
          return day; // Skip if invalid
        }

        const dayStartUTC = new Date(
          Date.UTC(year, month - 1, dayNum, 0, 0, 0, 0),
        );
        const dayEndUTC = new Date(
          Date.UTC(year, month - 1, dayNum, 23, 59, 59, 999),
        );

        // Filter appointments for this day (compare UTC dates)
        const dayAppointments = existingAppointments.filter((apt) => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= dayStartUTC && aptDate <= dayEndUTC;
        });

        // Convert appointment times to EST and create a set of taken slots
        const takenSlots = new Set<string>();
        dayAppointments.forEach((apt) => {
          const estTime = utcToEstTime(new Date(apt.startTime));
          takenSlots.add(estTime);
        });

        return {
          ...day,
          timeRanges: day.timeRanges.filter(
            (slot) => !takenSlots.has(slot.start),
          ),
        };
      });

      return res.json({
        availableDays: filteredDays,
        more: offset < 10, // Allow up to 10 pages
      });
    } catch (error) {
      console.error("Error fetching availability:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async cancelAppointment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const appointmentId = req.params["appointmentId"];
      if (!appointmentId) {
        return res.status(400).json({ error: "Appointment ID is required" });
      }

      // Get the appointment
      const collection =
        await this.appointmentDataAccessor["getAppointmentCollection"]();
      let idFilter: any;
      try {
        if (ObjectId.isValid(appointmentId)) {
          idFilter = { _id: new ObjectId(appointmentId) };
        } else {
          idFilter = { _id: appointmentId };
        }
      } catch {
        idFilter = { _id: appointmentId };
      }

      const appointment = await collection.findOne(idFilter);

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Check if user owns this appointment
      const user = req.user as User;
      const userId = user._id;
      if (appointment.userId !== userId) {
        return res.status(403).json({ error: "Not authorized" });
      }

      // Update status to Canceled
      appointment.status = AppointmentStatus.Canceled;
      appointment.updatedAt = new Date();

      const updated = await this.appointmentDataAccessor.update(appointment);

      if (!updated) {
        return res.status(500).json({ error: "Failed to cancel appointment" });
      }

      return res.json(new AppointmentResponseDto(updated));
    } catch (error: any) {
      console.error("Error canceling appointment:", error);
      const errorMessage =
        error?.message || error?.description || "Failed to cancel appointment";
      return res.status(400).json({ error: errorMessage });
    }
  }
}
