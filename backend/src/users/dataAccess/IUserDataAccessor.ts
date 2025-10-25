import type { InferIdType } from "mongodb";
import type { User } from "../models/User";

export interface IUserDataAccessor {
  userWithUsernameOrPhoneExists(
    username: string,
    phone?: string,
  ): Promise<boolean>;

  findByUsername(username: string): Promise<User | null>;

  findByPhone(phone: string): Promise<User | null>;

  insertUser(user: User): Promise<InferIdType<User>>;
}
