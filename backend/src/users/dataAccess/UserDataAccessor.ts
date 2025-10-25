import { Collection, type Filter, type InferIdType } from "mongodb";
import { type User } from "../models/User.ts";
import type { IMongoManager } from "../../mongo/IMongoManager.ts";
import type { IUserDataAccessor } from "./IUserDataAccessor.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class UserDataAccessor implements IUserDataAccessor {
  constructor(@inject("IMongoManager") private mongoManager: IMongoManager) {}

  public async userWithUsernameOrPhoneExists(
    username: string,
    phone?: string,
  ): Promise<boolean> {
    const collection = await this.getUserCollection();

    const filter: Filter<User> = {
      $or: [
        {
          username: {
            $regex: new RegExp(`^${username}$`, "i"),
          },
        },
        {
          phone: {
            $regex: new RegExp(`^${phone}$`, "i"),
          },
        },
      ],
    };

    const count = await collection.countDocuments(filter);
    return count > 0;
  }

  public async findByUsername(username: string): Promise<User | null> {
    const collection = await this.getUserCollection();
    const filter: Filter<User> = {
      username: {
        $regex: new RegExp(`^${username}$`, "i"),
      },
    };

    return await collection.findOne(filter);
  }

  public async findByPhone(phone: string): Promise<User | null> {
    const collection = await this.getUserCollection();
    const filter: Filter<User> = {
      phonenumber: {
        $regex: new RegExp(`^${phone}$`, "i"),
      },
    };

    return await collection.findOne(filter);
  }

  public async insertUser(user: User): Promise<InferIdType<User>> {
    const collection = await this.getUserCollection();
    const result = await collection.insertOne(user);
    return result.insertedId;
  }

  private async getUserCollection(): Promise<Collection<User>> {
    return this.mongoManager.getCollection<User>("user");
  }
}
