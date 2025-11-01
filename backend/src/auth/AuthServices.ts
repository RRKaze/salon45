import { Router } from "express";
import { type DependencyContainer } from "tsyringe";
import passport from "passport";
import { User } from "../users/models/User.ts";
import { LocalStrategy } from "./services/LocalStrategy.ts";

export class AuthServices {
  public register(container: DependencyContainer): Router {
    const router = Router();

    const localStrategy = container.resolve(LocalStrategy);
    passport.use(localStrategy);

    passport.serializeUser(function (user, cb) {
      process.nextTick(function () {
        cb(null, { id: (user as User)._id, username: (user as User).username });
      });
    });

    passport.deserializeUser(function (user, cb) {
      process.nextTick(function () {
        return cb(null, user as User);
      });
    });

    router.post(
      "/login",
      passport.authenticate("local", {
        successReturnToOrRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true,
      }),
    );

    return router;
  }
}

const authServices = new AuthServices();
export default authServices;
