import "reflect-metadata";
import { Container } from "inversify";
import { ILoggingService, ITodoService } from "@/types";
import { TYPES } from "@/container/types";
import { MockLoggingService } from "./MockLoggingService";
import { MockTodoService } from "./MockTodoService";

export const createTestContainer = (): Container => {
  const container = new Container();

  // Bind mock services
  container
    .bind<ILoggingService>(TYPES.LoggingService)
    .to(MockLoggingService)
    .inSingletonScope();
  container
    .bind<ITodoService>(TYPES.TodoService)
    .to(MockTodoService)
    .inSingletonScope();

  return container;
};

export const getMockLoggingService = (
  container: Container
): MockLoggingService => {
  return container.get<MockLoggingService>(TYPES.LoggingService);
};

export const getMockTodoService = (container: Container): MockTodoService => {
  return container.get<MockTodoService>(TYPES.TodoService);
};
