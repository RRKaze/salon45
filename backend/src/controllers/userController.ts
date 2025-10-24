import { type Request, type Response } from "express";
import { Collection } from "mongodb";
import { MongoManager } from "../config/MongoManager.ts";
import { UserService } from "../services/userService.ts";
import { type User } from "../models/user.ts";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { userName, phoneNumber } = req.query;

    const userCollection = MongoManager.getCollection(
      "user",
    ) as Collection<User>;
    const filter: Record<string, any> = {};

    if (userName)
      filter["userName"] = { $regex: new RegExp(`^${userName}$`, "i") };
    if (phoneNumber)
      filter["phoneNumber"] = { $regex: new RegExp(`^${phoneNumber}$`, "i") };

    const users = await userCollection.find(filter).toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.addUser(req.body);

    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
