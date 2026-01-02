import type { Filter } from "mongodb";
import { Strategy, type VerifyFunction } from "passport-local";
import type { User } from "../../users/models/User.ts";
import type { IMongoManager } from "../../mongo/IMongoManager";
import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

@injectable()
export class LocalStrategy extends Strategy {
  constructor(@inject("IMongoManager") mongoManager: IMongoManager) {
    super(LocalStrategy.getVerifyFunction(mongoManager));
  }

  private static getVerifyFunction(
    mongoManager: IMongoManager,
  ): VerifyFunction {
    const getByUsername = async (username: string) => {
      const userCollection = await mongoManager.getCollection<User>("user");
      const filter: Filter<User> = { username: { $eq: username } };
      return await userCollection.findOne(filter);
    };

    return async (username, password, done) => {
      const user = await getByUsername(username);
      if (!user) {
        console.log(`User not found: ${username}`);
        done(null, false, { message: "Incorrect username or password." });
        return;
      }

      const result = await bcrypt.compare(password, user?.password);
      console.log(
        result
          ? `User '${username}' authenticated correctly`
          : `User '${username}' failed authentication`,
      );
      if (result) {
        done(null, user);
      } else {
        done(null, false, { message: "Incorrect username or password." });
      }
    };
  }
}
