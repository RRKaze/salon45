import { Router } from "express";
import { type DependencyContainer } from "tsyringe";
import passport from "passport";
import { LocalStrategy } from "./services/LocalStrategy.ts";
import { SessionService } from "./services/SessionService.ts";
import type { User } from "../users/models/User.ts";

export class AuthServices {
  public register(container: DependencyContainer): Router {
    const router = Router();

    const localStrategy = container.resolve(LocalStrategy);
    const sessionService = container.resolve(SessionService);

    passport.use(localStrategy);
    passport.serializeUser(sessionService.Serialize);
    passport.deserializeUser(sessionService.Deserialize);

    router.post("/login", (req, res, next) =>
      passport.authenticate("local", (err: Error, usr: User) => {
        if (err) {
          return next(err);
        } else if (!usr) {
          return res
            .status(401)
            .json({ success: false, error: "USER_NOT_FOUND" });
        }
        return req.logIn(usr, (err) => {
          if (err) {
            return next(err);
          }
          return res.json({ success: true });
        });
      })(req, res, next),
    );

    return router;
  }
}

const authServices = new AuthServices();
export default authServices;
