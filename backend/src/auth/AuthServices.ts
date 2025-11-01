import { Router } from "express";
import { type DependencyContainer } from "tsyringe";
import passport from "passport";
import { LocalStrategy } from "./services/LocalStrategy.ts";
import { SessionService } from "./services/SessionService.ts";

export class AuthServices {
  public register(container: DependencyContainer): Router {
    const router = Router();

    const localStrategy = container.resolve(LocalStrategy);
    const sessionService = container.resolve(SessionService);

    passport.use(localStrategy);
    passport.serializeUser(sessionService.Serialize);
    passport.deserializeUser(sessionService.Deserialize);

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
