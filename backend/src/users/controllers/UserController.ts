import { type Request, type Response } from "express";
import type { IAddUserService } from "../services/IAddUserService.ts";
import type { IGetUsersService } from "../services/IGetUsersService.ts";
import type { IUpdateUserService } from "../services/IUpdateUserService.ts";
import { injectable, inject } from "tsyringe";

@injectable()
export class UserController {
  constructor(
    @inject("IAddUserService") private addUserService: IAddUserService,
    @inject("IGetUsersService") private getUsersService: IGetUsersService,
    @inject("IUpdateUserService") private updateUserService: IUpdateUserService,
  ) {}

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
      console.log(`UserController: ERROR AT EXCEPTION :: ${error}`);
      return res.status(400).json({ error: error.description });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params["userId"];
      const updateData = req.body;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, error: "User ID is required" });
      }

      userId && typeof userId === "string" ? userId : undefined;
      const updatedUserDTO = await this.updateUserService.updateUser(
        userId,
        updateData,
      );
      return res.status(201).json(updatedUserDTO);
    } catch (error: any) {
      return res.status(400).json({ error: error.description });
    }
  }
}
