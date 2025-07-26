import "reflect-metadata";
import { Container } from "inversify";
import { ILoggingService, ITodoService, ITodoStore, Todo } from "@/types";
import { LoggingService } from "@/services/LoggingService";
import { TodoService } from "@/services/TodoService";
import { Store } from "@/store/Store";
import { TYPES } from "./types";

const container = new Container();

// Bind services
container
  .bind<ILoggingService>(TYPES.LoggingService)
  .to(LoggingService)
  .inSingletonScope();

container
  .bind<ITodoStore>(TYPES.TodoStore)
  .to(Store<Todo>)
  .inSingletonScope();

container
  .bind<ITodoService>(TYPES.TodoService)
  .to(TodoService)
  .inSingletonScope();

export { container };
