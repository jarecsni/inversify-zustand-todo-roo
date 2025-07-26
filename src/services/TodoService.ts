import { injectable, inject } from "inversify";
import type { Todo, ITodoService, ILoggingService } from "@/types";
import { TYPES } from "@/container/types";
import { MasterStore, StoreView } from "@/store/MasterStore";

@injectable()
export class TodoService implements ITodoService {
  private todoStore: StoreView<Todo[]>;

  constructor(
    @inject(TYPES.LoggingService) private loggingService: ILoggingService,
    @inject(TYPES.MasterStore) masterStore: MasterStore
  ) {
    this.todoStore = masterStore.getStore<Todo[]>("todos", []);
  }

  getTodos(): Todo[] {
    return this.todoStore.get();
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

    this.todoStore.update((todos) => [...todos, newTodo]);
    this.loggingService.info("Todo added", {
      id: newTodo.id,
      text: newTodo.text,
    });
  }

  toggleTodo(id: string): void {
    const todos = this.todoStore.get();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      this.loggingService.warn("Todo not found for toggle", { id });
      return;
    }

    // Business logic: toggle the completed status
    this.todoStore.update((todos) =>
      todos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );

    this.loggingService.info("Todo toggled", {
      id,
      completed: !todo.completed,
    });
  }

  removeTodo(id: string): void {
    const todos = this.todoStore.get();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      this.loggingService.warn("Todo not found for removal", { id });
      return;
    }

    this.todoStore.update((todos) => todos.filter((t) => t.id !== id));
    this.loggingService.info("Todo removed", { id, text: todo.text });
  }

  subscribe(callback: (todos: Todo[]) => void): () => void {
    return this.todoStore.subscribe(callback);
  }
}
