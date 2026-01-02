import type { User } from "../models/User";

export class UserResponseDto {
  id: string;
  username: string;
  phone: string;
  email?: string | undefined;
  firstName: string;
  lastName: string;

  constructor(user: User) {
    this.id = user._id;
    this.username = user.username;
    this.phone = user.phone;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
