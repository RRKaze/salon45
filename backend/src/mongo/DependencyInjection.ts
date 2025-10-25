import { type DependencyContainer } from "tsyringe";
import { MongoManager } from "./MongoManager.ts";

export class MongoDependencyInjection {
  public register(container: DependencyContainer): void {
    const mongoManager = new MongoManager(
      process.env["MongoConnectionString"]!,
      "salon",
    );

    container.register("IMongoManager", { useValue: mongoManager });
  }
}

const mongoDependencyInjection = new MongoDependencyInjection();
export default mongoDependencyInjection;
