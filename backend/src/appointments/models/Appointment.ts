import { AppointmentStatus } from "./AppointmentStatus";

export class Appointment {
  _id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date | null;
  status: AppointmentStatus;

  private constructor(
    id: string,
    userId: string,
    startTime: Date,
    endTime: Date,
  ) {
    this._id = id;
    this.userId = userId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.createdAt = new Date();
    this.updatedAt = null;
    this.status = AppointmentStatus.Requested;
  }

  public updateStatus(newStatus: AppointmentStatus): void {
    if (this.status !== AppointmentStatus.Confirmed) {
      throw new Error(
        `Appointment ${this._id}: Status is ${this.status}, it cannot be updated to ${newStatus}`,
      );
    }
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}
