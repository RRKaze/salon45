import { inject, injectable } from "tsyringe";
import type { IUserDataAccessor } from "../dataAccess/IUserDataAccessor.ts";
import { UserResponseDto } from "../dtos/UserResponseDto.ts";
import type { IGetUsersService } from "./IGetUsersService.ts";

@injectable()
export class GetUsersService implements IGetUsersService {
  constructor(
    @inject("IUserDataAccessor") private userDataAccessor: IUserDataAccessor,
  ) {}

  public async findByUsernameOrPhone(
    username?: string,
    phoneNumber?: string,
  ): Promise<UserResponseDto[]> {
    const users = [];

    if (!!username) {
      const userByUsername =
        await this.userDataAccessor.findByUsername(username);
      users.push(userByUsername);
    }

    if (!!phoneNumber) {
      const userByPhone = await this.userDataAccessor.findByPhone(phoneNumber);
      users.push(userByPhone);
    }

    return users.filter((u) => !!u).map((u) => new UserResponseDto(u));
  }

  public async findByUsername(
    username: string,
  ): Promise<UserResponseDto | null> {
    try {
      const user = await this.userDataAccessor.findByUsername(username);
      return !!user ? new UserResponseDto(user) : null;
    } catch (error) {
      console.error("Error fetching user by username: ", error);
      return null;
    }
  }

  public async findByPhone(
    phoneNumber: string,
  ): Promise<UserResponseDto | null> {
    try {
      const user = await this.userDataAccessor.findByPhone(phoneNumber);
      return !!user ? new UserResponseDto(user) : null;
    } catch (error) {
      console.error("Error fetching user by phone number: ", error);
      return null;
    }
  }

  public async findByUserId(userId: string): Promise<UserResponseDto | null> {
    try {
      const user = await this.userDataAccessor.findByUserId(userId);
      return !!user ? new UserResponseDto(user) : null;
    } catch (error) {
      console.error("Error fetching user by user id: ", error);
      return null;
    }
  }
}
