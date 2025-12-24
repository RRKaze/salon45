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
          console.log("Authentication error:", err);
          return next(err);
        } else if (!usr) {
          return res
            .status(401)
            .json({ success: false, error: "USER_NOT_FOUND" });
        }
        return req.logIn(usr, (err) => {
          if (err) {
            console.error("Login error:", err);
            return next(err);
          }
          return res.json({ success: true });
        });
      })(req, res, next),
    );

    router.post("/logout", (req, res) => {
      req.logout((err) => {
        if (err) {
          console.error("Logout error:", err);
          res.status(500).json({ success: false, error: "Logout failed" });
          return;
        }
        req.session.destroy((err) => {
          if (err) {
            console.error("Session destroy error:", err);
            res
              .status(500)
              .json({ success: false, error: "Session destroy failed" });
            return;
          }
          res.json({ success: true });
        });
      });
    });

    return router;
  }
}

const authServices = new AuthServices();
export default authServices;
