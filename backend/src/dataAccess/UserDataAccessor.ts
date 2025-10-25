import { Collection } from "mongodb";
import { MongoManager } from "../config/MongoManager.ts";
import { type User } from "../models/User.ts";

export class UserDataAccessor {
  private readonly mongoManager: MongoManager;

  constructor(mongoManager: MongoManager) {
    this.mongoManager = mongoManager;
  }

  public async userWithUsernameOrPhoneExists(
    username: string,
    phone?: string,
  ): Promise<boolean> {
    const collection = await this.getUserCollection();
    const filter: Record<string, any> = {
      username: {
        $regex: new RegExp(`^${username}$`, "i"),
      },
    };

    if (phone) {
      filter["phonenumber"] = { $regex: new RegExp(`^${phone}$`, "i") };
    }

    const cursor = collection.find(filter);
    return await cursor.hasNext();
  }

  public async findByUsername(username: string): Promise<User | null> {
    const collection = await this.getUserCollection();
    const filter: Record<string, any> = {
      username: {
        $regex: new RegExp(`^${username}$`, "i"),
      },
    };

    return await collection.findOne(filter);
  }

  public async findByPhone(phone: string): Promise<User | null> {
    const collection = await this.getUserCollection();
    const filter: Record<string, any> = {
      phonenumber: {
        $regex: new RegExp(`^${phone}$`, "i"),
      },
    };

    return await collection.findOne(filter);
  }

  public async insertUser(user: User) {
    const collection = await this.getUserCollection();
    await collection.insertOne(user);
  }

  private async getUserCollection(): Promise<Collection<User>> {
    return this.mongoManager.getCollection("user");
  }
}
