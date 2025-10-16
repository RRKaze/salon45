import { Router, type Request, type Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "List of users" });
});

router.post("/", (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({ message: `User ${name} created!` });
});

export default router;
