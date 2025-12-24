import type { UserRequestDto } from "../dtos/UserRequestDto";
import type { UserResponseDto } from "../dtos/UserResponseDto";

export interface IUpdateUserService {
  updateUser(
    userId: string,
    userRequestDto: Partial<UserRequestDto>,
  ): Promise<UserResponseDto>;
}
