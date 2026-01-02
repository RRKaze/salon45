import { type DependencyContainer } from "tsyringe";
import { MongoManager } from "./MongoManager.ts";

export class MongoDependencyInjection {
  public register(container: DependencyContainer): void {
    const mongoManager = new MongoManager(
      process.env["MongoConnectionString"]!,
    );
    container.register("IMongoManager", { useValue: mongoManager });
  }
}

export default new MongoDependencyInjection();
