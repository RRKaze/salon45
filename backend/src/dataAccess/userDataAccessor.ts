import { Collection } from "mongodb";
import { MongoManager } from "../config/MongoManager.ts";
import { type User } from "../models/user.ts";

export class UserDataAccessor {
  private static getUserCollection(): Collection<User> {
    return MongoManager.getCollection("user");
  }

  // Exclude password from the result using projection
  static async findByUsernameOrPhone(
    username?: string,
    phone?: string
  ): Promise<Omit<User, "password"> | null> {
    const collection = this.getUserCollection();
    const filter: Record<string, any> = {};
    if (username) filter["username"] = { $regex: new RegExp(`^${username}$`, "i") };
    if (phone) filter["phonenumber"] = { $regex: new RegExp(`^${phone}$`, "i") };

    const user = await collection.findOne(filter, {
      projection: { password: 0 }, // exclude password
    });

    return user as Omit<User, "password"> | null;
  }

  static async insertUser(user: User) {
    const collection = this.getUserCollection();
    await collection.insertOne(user);
  }
}
