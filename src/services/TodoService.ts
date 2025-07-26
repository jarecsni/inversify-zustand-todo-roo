import { injectable, inject } from "inversify";
import type { Todo, ITodoService, ILoggingService } from "@/types";
import { TYPES } from "@/container/types";
import { MasterStore, CollectionView } from "@/store/MasterStore";

@injectable()
export class TodoService implements ITodoService {
  private todoCollection: CollectionView<Todo>;

  constructor(
    @inject(TYPES.LoggingService) private loggingService: ILoggingService,
    @inject(TYPES.MasterStore) masterStore: MasterStore
  ) {
    this.todoCollection = masterStore.getCollection<Todo>("todos");
  }

  getTodos(): Todo[] {
    return this.todoCollection.getItems();
  }

  addTodo(text: string): void {
    if (!text.trim()) {
      this.loggingService.warn("Attempted to add empty todo", { text });
      return;
    }

    const newTodo = this.todoCollection.addItem({
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    });

    this.loggingService.info("Todo added", {
      id: newTodo.id,
      text: newTodo.text,
    });
  }

  toggleTodo(id: string): void {
    const todo = this.todoCollection.findItem((t) => t.id === id);

    if (!todo) {
      this.loggingService.warn("Todo not found for toggle", { id });
      return;
    }

    // Business logic: toggle the completed status
    this.todoCollection.updateItem(id, (item) => ({
      ...item,
      completed: !item.completed,
    }));

    this.loggingService.info("Todo toggled", {
      id,
      completed: !todo.completed,
    });
  }

  removeTodo(id: string): void {
    const todo = this.todoCollection.findItem((t) => t.id === id);

    if (!todo) {
      this.loggingService.warn("Todo not found for removal", { id });
      return;
    }

    this.todoCollection.removeItem(id);
    this.loggingService.info("Todo removed", { id, text: todo.text });
  }

  subscribe(callback: (todos: Todo[]) => void): () => void {
    return this.todoCollection.subscribe(callback);
  }

  // Demonstrate the clean filter functionality
  getCompletedTodos(): Todo[] {
    return this.todoCollection.getItems((todo) => todo.completed);
  }

  getActiveTodos(): Todo[] {
    return this.todoCollection.getItems((todo) => !todo.completed);
  }
}
