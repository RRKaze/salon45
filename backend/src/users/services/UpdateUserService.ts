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
    update: Partial<UserRequestDto>,
  ): Promise<UserResponseDto> {
    // Only update fields that are provided, exclude password and username from updates
    const updateData: Partial<User> = {};
    if (update.firstName !== undefined) updateData.firstName = update.firstName;
    if (update.lastName !== undefined) updateData.lastName = update.lastName;
    if (update.phone !== undefined) updateData.phone = update.phone;
    if (update.email !== undefined) updateData.email = update.email;

    const userAfterUpdate = await this.userDataAccessor.updateUser(
      userId,
      updateData,
    );
    if (!userAfterUpdate) {
      throw UsersError.userNotFound;
    }
    return new UserResponseDto(userAfterUpdate);
  }
}
