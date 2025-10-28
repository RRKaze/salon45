import { type Request, type Response } from "express";
import type { IAddUserService } from "../services/IAddUserService.ts";
import type { IGetUsersService } from "../services/IGetUsersService.ts";
import { injectable, inject } from "tsyringe";

@injectable()
export class UserController {
  constructor(
    @inject("IAddUserService") private addUserService: IAddUserService,
    @inject("IGetUsersService") private getUsersService: IGetUsersService,
  ) {}

  public async getUsers(req: Request, res: Response) {
    try {
      const { userName, phoneNumber } = req.query;
      const users = await this.getUsersService.findByUsernameOrPhone(
        userName && typeof userName === "string" ? userName : undefined,
        phoneNumber && typeof phoneNumber === "string" ? phoneNumber : undefined,
      );
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public async addUser(req: Request, res: Response) {
    try {
      const user = await this.addUserService.addUser(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.description });
    }
  }
}
