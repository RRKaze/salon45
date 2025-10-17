import express, { type Application, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { MongoClient } from "mongodb";

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

(async () => {
  const mongoClient = await GetMongoClient(process.env);
  await mongoClient.connect();
  const testDb = mongoClient.db('testDb');
  const moviesCollection = testDb.collection('movies');
  const movies = moviesCollection.find({ });
  while (await movies.hasNext()) {
    console.log(await movies.next());
  }
})();

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

async function GetMongoClient(env: NodeJS.ProcessEnv) {
    const uri = env['MongoConnectionString'];
    if (uri == undefined) {
      throw "Mongo connection string is undefined";
    }
    return new MongoClient(uri);
}
