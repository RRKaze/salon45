import { DaySchedule } from "./DaySchedule";
import { normalizeDay, type OpenPeriod } from "./OpenPeriod";

export class NormalSchedule {
  constructor(
    private _id: string,
    private _sunday: OpenPeriod[],
    private _monday: OpenPeriod[],
    private _tuesday: OpenPeriod[],
    private _wednesday: OpenPeriod[],
    private _thursday: OpenPeriod[],
    private _friday: OpenPeriod[],
    private _saturday: OpenPeriod[],
    private _start: Date,
  ) {}

  // Public, read-only accessors
  get id(): string {
    return this._id;
  }
  get start(): Date {
    return this._start;
  }

  // Days are normalized
  get sunday(): OpenPeriod[] {
    return normalizeDay(this._sunday);
  }
  get monday(): OpenPeriod[] {
    return normalizeDay(this._monday);
  }
  get tuesday(): OpenPeriod[] {
    return normalizeDay(this._tuesday);
  }
  get wednesday(): OpenPeriod[] {
    return normalizeDay(this._wednesday);
  }
  get thursday(): OpenPeriod[] {
    return normalizeDay(this._thursday);
  }
  get friday(): OpenPeriod[] {
    return normalizeDay(this._friday);
  }
  get saturday(): OpenPeriod[] {
    return normalizeDay(this._saturday);
  }

  public getScheduleFor(date: Date): DaySchedule {
    return new DaySchedule(date, this.friday);
  }
}
