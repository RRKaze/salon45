import { injectable } from "tsyringe";
import type { User } from "../../users/models/User";

@injectable()
export class SessionService {
  public Serialize(
    user: Express.User,
    done: (err: any, id?: unknown) => void,
  ): void {
    process.nextTick(function () {
      const { password: _, ...sessionUser } = user as User;
      console.log(`Serializing user session: ${sessionUser.username}`);
      done(null, sessionUser);
    });
  }

  public Deserialize(
    user: Express.User,
    done: (err: any, user?: false | Express.User | null | undefined) => void,
  ): void {
    process.nextTick(function () {
      console.log(`Deserializing user session: ${user}`);
      return done(null, user);
    });
  }
}
