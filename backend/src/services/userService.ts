import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { type User } from "../models/user.ts";
import { UserDataAccessor } from "../dataAccess/userDataAccessor.ts";
import { type UserRequestDto, type UserResponseDto } from "../dtos/userDto.ts";
import { appError } from "../errors/errors.ts";

export class UserService {
  static async addUser(userRequestDto: UserRequestDto): Promise< UserResponseDto > {
    const { username, password, phone, email } = userRequestDto;

    // Validate required fields
    if (!username || !password || !phone) {
      throw appError.userMissingInfo;
    }

    // Check if user already exists
    const existingUser = await UserDataAccessor.findByUsernameOrPhone(username, phone);
    if (existingUser) {
      throw appError.userAlreadyExists;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser: User = {
      userid: uuidv4(),
      username,
      password: hashedPassword,
      phone,
      ...(email !== undefined && { email }),
    };

    await UserDataAccessor.insertUser(newUser);

    return {userid: newUser.userid,
        username: newUser.username,
        phone: newUser.phone,
        email: newUser.email} as UserResponseDto;
  }
}
