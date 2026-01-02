import bcrypt from "bcrypt";
import { UsersError } from "../errors/UsersError.ts";

export class User implements Express.User {
  _id!: string;
  username: string;
  password: string;
  phone: string;
  email: string | undefined;
  firstName: string;
  lastName: string;

  private constructor(
    id: string,
    username: string,
    password: string,
    phone: string,
    firstName: string,
    lastName: string,
    email?: string,
  ) {
    this._id = id;
    this.username = username;
    this.password = password;
    this.phone = phone;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  public static async NewUser(
    username: string,
    password: string,
    phone: string,
    firstName: string,
    lastName: string,
    email?: string,
  ) {
    if (!username || !password || !phone || !firstName || !lastName) {
      throw UsersError.userMissingInfo;
    }

    const hashedPassword = await this.HashPassword(password);
    return new User(
      null!,
      username,
      hashedPassword,
      phone,
      firstName,
      lastName,
      email,
    );
  }

  public static async HashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
