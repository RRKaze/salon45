import { type Request, type Response } from "express";
import type { IAddUserService } from "../services/IAddUserService.ts";
import type { IGetUsersService } from "../services/IGetUsersService.ts";
import type { IUpdateUserService } from "../services/IUpdateUserService.ts";
import type { User } from "../models/User.ts";
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

      console.log("Updating user with ID:", userId);
      console.log("Update data:", updateData);

      const updatedUserDTO = await this.updateUserService.updateUser(
        userId,
        updateData,
      );
      return res.status(200).json(updatedUserDTO);
    } catch (error: any) {
      console.error("Error updating user:", error);
      const errorMessage =
        error?.description || error?.message || "Failed to update user";
      return res.status(400).json({ error: errorMessage });
    }
  }

  public async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Fetch fresh user data from database to ensure we have the latest information
      const sessionUser = req.user as User;
      const freshUser = await this.getUsersService.findByUserId(
        sessionUser._id,
      );

      if (!freshUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the session with fresh user data (excluding password)
      if (req.user) {
        Object.assign(req.user, {
          firstName: freshUser.firstName,
          lastName: freshUser.lastName,
          phone: freshUser.phone,
          email: freshUser.email,
        });
      }

      return res.json(freshUser);
    } catch (error) {
      console.error("Error fetching current user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
