import { type Request, type Response } from "express";
import { injectable, inject } from "tsyringe";

@injectable()
export class AuthController {
  constructor() {}

  public async getUsers(req: Request, res: Response) {}
}
