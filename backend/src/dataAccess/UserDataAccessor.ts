import { Collection, type Filter, type InsertOneResult } from "mongodb";
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

  public async insertUser(user: User): Promise<InsertOneResult<User>> {
    const collection = await this.getUserCollection();
    return await collection.insertOne(user);
  }

  private async getUserCollection(): Promise<Collection<User>> {
    return this.mongoManager.getCollection<User>("user");
  }
}
