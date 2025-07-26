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

  it("should handle adding todo when collection is empty", () => {
    // This test ensures the collection properly handles empty state
    const mockMasterStore = getMockMasterStore(testContainer);

    // Clear any existing todos to ensure we start with empty collection
    mockMasterStore.clear();

    // This should work seamlessly with empty collection
    expect(() => {
      todoService.addTodo("Test todo with empty collection");
    }).not.toThrow();

    const todos = todoService.getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0].text).toBe("Test todo with empty collection");
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

  it("should filter completed and active todos", () => {
    // Add some todos
    todoService.addTodo("Active todo 1");
    todoService.addTodo("Active todo 2");
    todoService.addTodo("Todo to complete");

    // Toggle one to completed
    const todos = todoService.getTodos();
    const todoToComplete = todos.find((t) => t.text === "Todo to complete");
    if (todoToComplete) {
      todoService.toggleTodo(todoToComplete.id);
    }

    // Test filter methods
    const activeTodos = todoService.getActiveTodos();
    const completedTodos = todoService.getCompletedTodos();

    expect(activeTodos).toHaveLength(2);
    expect(completedTodos).toHaveLength(1);
    expect(activeTodos.every((t) => !t.completed)).toBe(true);
    expect(completedTodos.every((t) => t.completed)).toBe(true);
  });
});
