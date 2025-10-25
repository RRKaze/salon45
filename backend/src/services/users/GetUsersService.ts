import { type User } from "../../models/User.ts";
import { UserDataAccessor } from "../../dataAccess/UserDataAccessor.ts";

export class GetUsersService {
  private readonly userDataAccessor: UserDataAccessor;

  constructor(userDataAccessor: UserDataAccessor) {
    this.userDataAccessor = userDataAccessor;
  }

  public async findByUsernameOrPhone(
    username?: string,
    phoneNumber?: string,
  ): Promise<User[]> {
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

    return users.filter((u) => !!u);
  }

  public async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.userDataAccessor.findByUsername(username);
    } catch (error) {
      console.error("Error fetching user by username: ", error);
      return null;
    }
  }

  public async findByPhone(phoneNumber: string): Promise<User | null> {
    try {
      return await this.userDataAccessor.findByPhone(phoneNumber);
    } catch (error) {
      console.error("Error fetching user by phone number: ", error);
      return null;
    }
  }
}
