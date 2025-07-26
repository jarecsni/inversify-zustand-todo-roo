import "reflect-metadata";
import { Container } from "inversify";
import { ILoggingService, ITodoService } from "@/types";
import { TYPES } from "@/container/types";
import { MockLoggingService } from "./MockLoggingService";
import { TodoService } from "@/services/TodoService";
import { MockMasterStore } from "./MockMasterStore";

export const createTestContainer = (): Container => {
  const container = new Container();

  // Bind mock services
  container
    .bind<ILoggingService>(TYPES.LoggingService)
    .to(MockLoggingService)
    .inSingletonScope();

  container
    .bind<MockMasterStore>(TYPES.MasterStore)
    .to(MockMasterStore)
    .inSingletonScope();

  container
    .bind<ITodoService>(TYPES.TodoService)
    .to(TodoService)
    .inSingletonScope();

  return container;
};

export const getMockLoggingService = (
  container: Container
): MockLoggingService => {
  return container.get<MockLoggingService>(TYPES.LoggingService);
};

export const getMockTodoService = (container: Container): ITodoService => {
  return container.get<ITodoService>(TYPES.TodoService);
};

export const getMockMasterStore = (container: Container): MockMasterStore => {
  return container.get<MockMasterStore>(TYPES.MasterStore);
};
