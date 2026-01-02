import { User } from "../models/User.ts";
import { type UserRequestDto } from "../dtos/UserRequestDto.ts";
import { UserResponseDto } from "../dtos/UserResponseDto.ts";
import { UsersError } from "../errors/UsersError.ts";
import type { IUserDataAccessor } from "../dataAccess/IUserDataAccessor.ts";
import type { IAddUserService } from "./IAddUserService.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class AddUserService implements IAddUserService {
  constructor(
    @inject("IUserDataAccessor") private userDataAccessor: IUserDataAccessor,
  ) {}

  async addUser(userRequestDto: UserRequestDto): Promise<UserResponseDto> {
    const { username, password, phone, email, firstName, lastName } =
      userRequestDto;

    // Check if user already exists
    const existingUser =
      await this.userDataAccessor.userWithUsernameOrPhoneExists(
        username,
        phone,
      );
    console.log(`trying to find user: ${username} ---------------`);
    if (existingUser) {
      console.log(`user existing ------------- `);
      throw UsersError.userAlreadyExists;
    }

    // Create new user
    const newUser = await User.NewUser(
      username,
      password,
      phone,
      firstName,
      lastName,
      email,
    );
    console.log(`new user created ------------- `);
    newUser._id = await this.userDataAccessor.insertUser(newUser);
    console.log(`new user created with id: ${newUser._id}------------- `);
    return new UserResponseDto(newUser);
  }
}
