import { injectable, inject } from "inversify";
import type { Todo, ITodoService, ILoggingService, ITodoStore } from "@/types";
import { TYPES } from "@/container/types";

@injectable()
export class TodoService implements ITodoService {
  constructor(
    @inject(TYPES.LoggingService) private loggingService: ILoggingService,
    @inject(TYPES.TodoStore) private todoStore: ITodoStore
  ) {}

  getTodos(): Todo[] {
    return this.todoStore.getTodos();
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

    this.todoStore.addTodo(newTodo);
    this.loggingService.info("Todo added", {
      id: newTodo.id,
      text: newTodo.text,
    });
  }

  toggleTodo(id: string): void {
    const todos = this.getTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      this.loggingService.warn("Todo not found for toggle", { id });
      return;
    }

    this.todoStore.toggleTodo(id);
    this.loggingService.info("Todo toggled", {
      id,
      completed: !todo.completed,
    });
  }

  removeTodo(id: string): void {
    const todos = this.getTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      this.loggingService.warn("Todo not found for removal", { id });
      return;
    }

    this.todoStore.removeTodo(id);
    this.loggingService.info("Todo removed", { id, text: todo.text });
  }

  subscribe(callback: (todos: Todo[]) => void): () => void {
    return this.todoStore.subscribe(callback);
  }
}
