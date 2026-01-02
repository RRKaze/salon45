import { normalizeDay, type OpenPeriod } from "./OpenPeriod";

export class DaySchedule {
  constructor(
    private _date: Date,
    private _open: OpenPeriod[],
  ) {}

  get date(): Date {
    return this._date;
  }
  get open(): OpenPeriod[] {
    return normalizeDay(this._open);
  }
}
