import { Router } from "express";
import { type DependencyContainer } from "tsyringe";

export class AuthServices {
  public register(container: DependencyContainer): Router {
    const router = Router();
    container.isRegistered("test");
    return router;
  }
}

const authServices = new AuthServices();
export default authServices;
