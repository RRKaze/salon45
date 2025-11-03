import { User } from "../models/User.ts";
import { type UserRequestDto } from "../dtos/UserRequestDto.ts";
import { UserResponseDto } from "../dtos/UserResponseDto.ts";
import { UsersError } from "../errors/UsersError.ts";
import type { IUserDataAccessor } from "../dataAccess/IUserDataAccessor.ts";
import type { IUpdateUserService } from "./IUpdateUserService.ts";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUserService implements IUpdateUserService {
  constructor(
    @inject("IUserDataAccessor") private userDataAccessor: IUserDataAccessor,
  ) {}

  async updateUser(
    userId: string,
    update: UserRequestDto,
  ): Promise<UserResponseDto> {
    const userAfterUpdate = await this.userDataAccessor.updateUser(
      userId,
      update as User,
    );
    if (!userAfterUpdate) {
      throw UsersError.userNotFound;
    }
    return new UserResponseDto(userAfterUpdate);
  }
}
