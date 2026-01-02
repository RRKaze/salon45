import type { UserResponseDto } from "../dtos/UserResponseDto";

export interface IGetUsersService {
  findByUsernameOrPhone(
    username?: string,
    phoneNumber?: string,
  ): Promise<UserResponseDto[]>;

  findByUsername(username: string): Promise<UserResponseDto | null>;

  findByPhone(phoneNumber: string): Promise<UserResponseDto | null>;

  findByUserId(userId: string): Promise<UserResponseDto | null>;
}
