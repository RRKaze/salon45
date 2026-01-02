import type { InferIdType, Collection } from "mongodb";
import type { Appointment } from "../models/Appointment";

export interface IAppointmentDataAccessor {
  save(appointment: Appointment): Promise<InferIdType<Appointment>>;

  update(appointment: Appointment): Promise<Appointment | null>;

  get(
    from: Date,
    until: Date,
    maxCount: number,
    userId?: string,
  ): Promise<Appointment[]>;

  getAppointmentCollection(): Promise<Collection<Appointment>>;
}
