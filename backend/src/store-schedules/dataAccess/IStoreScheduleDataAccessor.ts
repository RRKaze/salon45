import type { DaySchedule } from "../models/DaySchedule";
import type { NormalSchedule } from "../models/NormalSchedule";

export interface IStoreScheduleDataAccessor {
  // Should return all schedules which could be active in any timeframe within from and until.
  getNormalSchedules(from: Date, until: Date): Promise<NormalSchedule[]>;
  getExceptions(from: Date, until: Date): Promise<DaySchedule[]>;
}
