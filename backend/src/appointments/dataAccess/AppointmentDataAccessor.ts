import { inject, injectable } from "tsyringe";
import type { IMongoManager } from "../../mongo/IMongoManager";
import type { IAppointmentDataAccessor } from "./IAppointmentDataAccessor";
import type { Collection, Filter, InferIdType } from "mongodb";
import type { Appointment } from "../models/Appointment";

@injectable()
export class AppointmentDataAccessor implements IAppointmentDataAccessor {
  constructor(@inject("IMongoManager") private mongoManager: IMongoManager) {}

  async save(appointment: Appointment): Promise<InferIdType<Appointment>> {
    const collection = await this.getAppointmentCollection();
    const result = await collection.insertOne(appointment);
    return result.insertedId;
  }

  async update(appointment: Appointment): Promise<Appointment | null> {
    const collection = await this.getAppointmentCollection();
    const result = await collection.findOneAndUpdate(
      { _id: appointment._id },
      { $set: appointment },
      { returnDocument: "after" },
    );
    return result;
  }

  async get(
    from: Date,
    until: Date,
    maxCount: number,
    userId?: string,
  ): Promise<Appointment[]> {
    const collection = await this.getAppointmentCollection();
    const filter: Filter<Appointment> = {
      startTime: { $gte: from, $lte: until },
    };
    if (userId) {
      filter.userId = userId;
    }
    return await collection.find(filter).batchSize(maxCount).toArray();
  }

  private getAppointmentCollection(): Promise<Collection<Appointment>> {
    return this.mongoManager.getCollection<Appointment>("appointment");
  }
}
