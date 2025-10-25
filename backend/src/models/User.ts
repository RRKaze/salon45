import bcrypt from "bcrypt";
import { AppError } from "../errors/AppError.ts";

export class User {
  _id!: string;
  username: string;
  password: string;
  phone: string;
  email: string | undefined;

  private constructor(
    id: string,
    username: string,
    password: string,
    phone: string,
    email?: string,
  ) {
    this._id = id;
    this.username = username;
    this.password = password;
    this.phone = phone;
    this.email = email;
  }

  public static async NewUser(
    username: string,
    password: string,
    phone: string,
    email?: string,
  ) {
    if (!username || !password || !phone) {
      throw AppError.userMissingInfo;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return new User(null!, username, hashedPassword, phone, email);
  }
}
