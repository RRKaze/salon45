import { User } from "../../models/User.ts";
import { type UserRequestDto } from "../../dtos/UserRequestDto.ts";
import { UserResponseDto } from "../../dtos/UserResponseDto.ts";
import { AppError } from "../../errors/AppError.ts";
import type { IUserDataAccessor } from "../../dataAccess/IUserDataAccessor.ts";
import type { IAddUserService } from "./IAddUserService.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class AddUserService implements IAddUserService {
  constructor(
    @inject("IUserDataAccessor") private userDataAccessor: IUserDataAccessor,
  ) {}

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

    newUser._id = await this.userDataAccessor.insertUser(newUser);

    return new UserResponseDto(newUser);
  }
}
