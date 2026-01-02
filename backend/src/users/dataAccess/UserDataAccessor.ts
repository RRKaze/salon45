import { Collection, type Filter, type InferIdType, ObjectId } from "mongodb";
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

  public async findByUserId(userId: string): Promise<User | null> {
    const collection = await this.getUserCollection();
    // Convert string ID to ObjectId if it's a valid ObjectId string
    let idFilter: any;
    try {
      if (ObjectId.isValid(userId)) {
        idFilter = { _id: new ObjectId(userId) };
      } else {
        idFilter = { _id: userId };
      }
    } catch {
      idFilter = { _id: userId };
    }

    return await collection.findOne(idFilter);
  }

  public async insertUser(user: User): Promise<InferIdType<User>> {
    const collection = await this.getUserCollection();
    const result = await collection.insertOne(user);
    return result.insertedId;
  }

  public async updateUser(
    userId: string,
    newInfo: Partial<User>,
  ): Promise<User | null> {
    const collection = await this.getUserCollection();
    // Convert string ID to ObjectId if it's a valid ObjectId string
    let idFilter: any;
    try {
      // Try to convert to ObjectId if it's a valid ObjectId string
      if (ObjectId.isValid(userId)) {
        idFilter = { _id: new ObjectId(userId) };
      } else {
        // If not a valid ObjectId, try as string
        idFilter = { _id: userId };
      }
    } catch {
      // If conversion fails, use as string
      idFilter = { _id: userId };
    }

    console.log("Updating user with filter:", idFilter);
    console.log("Update info:", newInfo);

    const result = await collection.findOneAndUpdate(
      idFilter,
      { $set: newInfo },
      { returnDocument: "after" },
    );

    console.log("Update result:", result ? "Success" : "User not found");
    return result;
  }

  private async getUserCollection(): Promise<Collection<User>> {
    return this.mongoManager.getCollection<User>("user");
  }
}
