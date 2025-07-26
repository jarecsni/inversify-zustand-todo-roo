import "reflect-metadata";
import { Container } from "inversify";
import { ILoggingService, ITodoService } from "@/types";
import { LoggingService } from "@/services/LoggingService";
import { TodoService } from "@/services/TodoService";
import { MasterStore } from "@/store/MasterStore";
import { TYPES } from "./types";

const container = new Container();

// Bind services
container
  .bind<ILoggingService>(TYPES.LoggingService)
  .to(LoggingService)
  .inSingletonScope();

container
  .bind<MasterStore>(TYPES.MasterStore)
  .to(MasterStore)
  .inSingletonScope();

container
  .bind<ITodoService>(TYPES.TodoService)
  .to(TodoService)
  .inSingletonScope();

export { container };
