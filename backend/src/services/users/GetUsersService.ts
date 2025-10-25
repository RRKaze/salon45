import { UserDataAccessor } from "../../dataAccess/UserDataAccessor.ts";
import { UserResponseDto } from "../../dtos/UserResponseDto.ts";

export class GetUsersService {
  private readonly userDataAccessor: UserDataAccessor;

  constructor(userDataAccessor: UserDataAccessor) {
    this.userDataAccessor = userDataAccessor;
  }

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
}
