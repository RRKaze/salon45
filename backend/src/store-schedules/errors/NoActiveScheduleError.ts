export class NoActiveScheduleError extends Error {
  public readonly date: Date;

  constructor(date: Date) {
    super(`No active schedule found for ${date.toISOString().slice(0, 10)}`);
    this.name = "NoActiveScheduleError";
    this.date = date;

    // Restore prototype chain for instanceof checks when targeting ES5
    Object.setPrototypeOf(this, NoActiveScheduleError.prototype);
  }
}
