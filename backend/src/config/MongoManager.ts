import { MongoClient, Db, Collection } from "mongodb";

export class MongoManager {
  private static client: MongoClient;
  private static db: Db;

  static async connect(connectionString: string, dbName: string): Promise<void> {
    if (!this.client) {
      this.client = new MongoClient(connectionString);
      await this.client.connect();
      this.db = this.client.db(dbName);
      console.log(`✅ Connected to MongoDB: ${dbName}`);
    }
  }

  static getCollection(collectionName: string): Collection<any> {
    if (!this.db) {
      throw new Error("MongoManager not initialized. Call connect() first.");
    }
    return this.db.collection(collectionName);
  }
  

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      console.log("🛑 MongoDB connection closed");
    }
  }
}
