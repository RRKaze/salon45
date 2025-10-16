import express, { type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
// import userRoutes from "./routes/userRoutes";
import userRoutes from "./routes/userRoutes.js";



dotenv.config();

const app: Application = express();
const PORT = process.env['PORT'] || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from TypeScript backend!");
});

app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
