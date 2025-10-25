import type { UserRequestDto } from "../../dtos/UserRequestDto";
import type { UserResponseDto } from "../../dtos/UserResponseDto";

export interface IAddUserService {
  addUser(userRequestDto: UserRequestDto): Promise<UserResponseDto>;
}
