import type { DaySchedule } from "../models/DaySchedule";

export class DuplicateDayOverrideError extends Error {
  public readonly conflicts: DaySchedule[];

  constructor(conflicts: DaySchedule[]) {
    const date = conflicts.map((c) => c.date.toISOString().slice(0, 10))[0];
    super(`Multiple day overrides found for the same date (${date})`);
    this.name = "DuplicateDayOverride";
    this.conflicts = conflicts;

    // Restore prototype chain for instanceof checks when targeting ES5
    Object.setPrototypeOf(this, DuplicateDayOverrideError.prototype);
  }
}
