import { type Request, type Response } from "express";
import { AddUserService } from "../services/users/AddUserService.ts";
import type { GetUsersService } from "../services/users/GetUsersService.ts";

export class UserController {
  private readonly addUserService: AddUserService;
  private readonly getUsersService: GetUsersService;

  constructor(
    addUserService: AddUserService,
    getUsersService: GetUsersService,
  ) {
    this.addUserService = addUserService;
    this.getUsersService = getUsersService;
  }

  public async getUsers(req: Request, res: Response) {
    try {
      const { userName, phoneNumber } = req.query;
      const users = await this.getUsersService.findByUsernameOrPhone(
        userName && typeof userName === "string" ? userName : undefined,
        phoneNumber && typeof phoneNumber === "string"
          ? phoneNumber
          : undefined,
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
