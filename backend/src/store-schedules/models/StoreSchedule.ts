import type { IStoreScheduleDataAccessor } from "../dataAccess/IStoreScheduleDataAccessor";
import type { DaySchedule } from "./DaySchedule";
import { DuplicateDayOverrideError } from "../errors/DuplicateDayOverrideError";
import { NoActiveScheduleError } from "../errors/NoActiveScheduleError";

export class StoreSchedule {
  constructor(private _storeScheduleDataAccessor: IStoreScheduleDataAccessor) {}

  public async get(from: Date, until: Date): Promise<DaySchedule[]> {
    const normalSchedules =
      await this._storeScheduleDataAccessor.getNormalSchedules(from, until);
    const exceptions = await this._storeScheduleDataAccessor.getExceptions(
      from,
      until,
    );

    normalSchedules.sort((a, b) => a.start.valueOf() - b.start.valueOf());

    const result: DaySchedule[] = [];
    let currentDay = from;
    while (currentDay <= until) {
      const correspondingExceptions = exceptions.filter(
        (ex) => ex.date === currentDay,
      );
      if (correspondingExceptions.length > 0) {
        if (correspondingExceptions.length > 1) {
          throw new DuplicateDayOverrideError(correspondingExceptions);
        }
        result.push(correspondingExceptions[0]!);
      } else {
        const correspondingSchedule = normalSchedules.find(
          (s) => s.start <= currentDay,
        );
        if (!!correspondingSchedule) {
          throw new NoActiveScheduleError(currentDay);
        }
        result.push(correspondingSchedule!.getScheduleFor(currentDay));
      }

      currentDay = new Date(currentDay.setDate(currentDay.getDate() + 1));
    }

    return result;
  }
}
