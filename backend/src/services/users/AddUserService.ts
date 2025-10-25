import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { type User } from "../../models/User.ts";
import { UserDataAccessor } from "../../dataAccess/UserDataAccessor.ts";
import { type UserRequestDto } from "../../dtos/UserRequestDto.ts";
import { type UserResponseDto } from "../../dtos/UserResponseDto.ts";
import { AppError } from "../../errors/AppError.ts";

export class AddUserService {
  private readonly userDataAccessor: UserDataAccessor;

  constructor(userDataAccessor: UserDataAccessor) {
    this.userDataAccessor = userDataAccessor;
  }

  async addUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    const { username, password, phone, email } = userRequestDto;

    // Validate required fields
    if (!username || !password || !phone) {
      throw AppError.userMissingInfo;
    }

    // Check if user already exists
    const existingUser =
      await this.userDataAccessor.userWithUsernameOrPhoneExists(
        username,
        phone,
      );
    if (existingUser) {
      throw AppError.userAlreadyExists;
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

    await this.userDataAccessor.insertUser(newUser);

    return {
      userid: newUser.userid,
      username: newUser.username,
      phone: newUser.phone,
      email: newUser.email,
    } as UserResponseDto;
  }
}
