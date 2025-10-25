import { User } from "../../models/User.ts";
import { UserDataAccessor } from "../../dataAccess/UserDataAccessor.ts";
import { type UserRequestDto } from "../../dtos/UserRequestDto.ts";
import { UserResponseDto } from "../../dtos/UserResponseDto.ts";
import { AppError } from "../../errors/AppError.ts";

export class AddUserService {
  private readonly userDataAccessor: UserDataAccessor;

  constructor(userDataAccessor: UserDataAccessor) {
    this.userDataAccessor = userDataAccessor;
  }

  async addUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    const { username, password, phone, email } = userRequestDto;

    // Check if user already exists
    const existingUser =
      await this.userDataAccessor.userWithUsernameOrPhoneExists(
        username,
        phone,
      );
    if (existingUser) {
      throw AppError.userAlreadyExists;
    }

    // Create new user
    const newUser = await User.NewUser(username, password, phone, email);

    const insertedUser = await this.userDataAccessor.insertUser(newUser);

    newUser._id = insertedUser.insertedId;

    return new UserResponseDto(newUser);
  }
}
