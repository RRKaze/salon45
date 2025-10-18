import { Router, type Request, type Response } from "express";
import { MongoClient } from "mongodb";
const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    const mongoClient = await GetMongoClient(process.env);
    await mongoClient.connect();
    const salonDB = mongoClient.db('salon');
    const userCollection = salonDB.collection('user');
    const users = userCollection.find({ });
    const result = [];
    while (await users.hasNext()) {
      result.push(await users.next());
    };
    res.json(result);
});

router.post("/", (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({ message: `User ${name} created!` });
});

async function GetMongoClient(env: NodeJS.ProcessEnv) {
  const uri = env['MongoConnectionString'];
  if (uri == undefined) {
    throw "Mongo connection string is undefined";
  }
  return new MongoClient(uri);
}


export default router;

