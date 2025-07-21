import { injectable, inject } from "inversify";
import type { ITodoService, Todo, ILoggingService } from "@/types";
import { TYPES } from "@/container/types";

@injectable()
export class MockTodoService implements ITodoService {
  private todos: Todo[] = [];
  private subscribers: Array<(todos: Todo[]) => void> = [];

  constructor(
    @inject(TYPES.LoggingService) private loggingService: ILoggingService
  ) {}

  getTodos(): Todo[] {
    return [...this.todos];
  }

  addTodo(text: string): void {
    if (!text.trim()) {
      this.loggingService.warn("Attempted to add empty todo", { text });
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
    this.todos.push(newTodo);
    this.loggingService.info("Todo added", {
      id: newTodo.id,
      text: newTodo.text,
    });
    this.notifySubscribers();
  }

  toggleTodo(id: string): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.notifySubscribers();
    }
  }

  removeTodo(id: string): void {
    const todo = this.todos.find((t) => t.id === id);

    if (!todo) {
      this.loggingService.warn("Todo not found for removal", { id });
      return;
    }

    this.todos = this.todos.filter((t) => t.id !== id);
    this.loggingService.info("Todo removed", { id, text: todo.text });
    this.notifySubscribers();
  }

  subscribe(callback: (todos: Todo[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  // Test utility methods
  clear(): void {
    this.todos = [];
    this.notifySubscribers();
  }

  setTodos(todos: Todo[]): void {
    this.todos = [...todos];
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback([...this.todos]));
  }
}
