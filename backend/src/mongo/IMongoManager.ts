import type { Collection, Document } from "mongodb";

export interface IMongoManager {
  getCollection<T extends Document>(
    collectionName: string,
  ): Promise<Collection<T>>;
  disconnect(): Promise<void>;
}
