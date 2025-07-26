import "reflect-metadata";
import { TodoService } from "./TodoService";
import {
  createTestContainer,
  getMockTodoService,
  getMockMasterStore,
} from "@/test-utils/test-container";

describe("TodoService", () => {
  let testContainer: ReturnType<typeof createTestContainer>;
  let todoService: TodoService;

  beforeEach(() => {
    testContainer = createTestContainer();
    todoService = getMockTodoService(testContainer);
  });

  afterEach(() => {
    const mockMasterStore = getMockMasterStore(testContainer);
    mockMasterStore.clear();
  });

  it("should start with empty todos", () => {
    const todos = todoService.getTodos();
    expect(todos).toEqual([]);
  });

  it("should add a todo", () => {
    todoService.addTodo("Test todo");
    const todos = todoService.getTodos();

    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe("Test todo");
    expect(todos[0].completed).toBe(false);
    expect(todos[0].id).toBeDefined();
    expect(todos[0].createdAt).toBeInstanceOf(Date);
  });

  it("should handle adding todo when store data is undefined", () => {
    // This test reproduces the "Spread syntax requires ...iterable not be null or undefined" error
    // Simulate the scenario where the store data for 'todos' key is undefined
    const mockMasterStore = getMockMasterStore(testContainer);

    // Directly set the todos store value to undefined to simulate the error condition
    mockMasterStore.setStoreValue("todos", undefined);

    // This should not throw an error about spread syntax because StoreView.update()
    // should handle undefined values by using the default value
    expect(() => {
      todoService.addTodo("Test todo with undefined store");
    }).not.toThrow();

    const todos = todoService.getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe("Test todo with undefined store");
  });

  it("should toggle a todo", () => {
    todoService.addTodo("Test todo");
    const todos = todoService.getTodos();
    const todoId = todos[0].id;

    todoService.toggleTodo(todoId);
    const updatedTodos = todoService.getTodos();

    expect(updatedTodos[0].completed).toBe(true);
  });

  it("should remove a todo", () => {
    todoService.addTodo("Test todo");
    const todos = todoService.getTodos();
    const todoId = todos[0].id;

    todoService.removeTodo(todoId);
    const updatedTodos = todoService.getTodos();

    expect(updatedTodos).toHaveLength(0);
  });

  it("should subscribe to todo changes", () => {
    const callback = jest.fn();
    const unsubscribe = todoService.subscribe(callback);

    todoService.addTodo("Test todo");

    expect(callback).toHaveBeenCalled();
    unsubscribe();
  });
});
