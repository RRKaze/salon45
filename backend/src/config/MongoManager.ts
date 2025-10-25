import { MongoClient, Db, Collection, type Document } from "mongodb";

export class MongoManager {
  private readonly connectionString: string;
  private readonly dbName: string;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  constructor(connectionString: string, dbName: string) {
    this.connectionString = connectionString;
    this.dbName = dbName;
  }

  async getCollection<T extends Document>(
    collectionName: string,
  ): Promise<Collection<T>> {
    const db = await this.connect();
    return db.collection(collectionName);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log("🛑 MongoDB connection closed");
    }
  }

  private async connect(): Promise<Db> {
    if (!this.client || !this.db) {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`✅ Connected to MongoDB: ${this.dbName}`);
    }

    return this.db;
  }
}
