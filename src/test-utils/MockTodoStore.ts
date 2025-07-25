import { injectable } from "inversify";
import { Todo, ITodoStore } from "@/types";

@injectable()
export class MockTodoStore implements ITodoStore {
  private todos: Todo[] = [];
  private subscribers: Array<(todos: Todo[]) => void> = [];

  getTodos(): Todo[] {
    return [...this.todos];
  }

  addTodo(todo: Todo): void {
    this.todos.push(todo);
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
    this.todos = this.todos.filter((t) => t.id !== id);
    this.notifySubscribers();
  }

  setTodos(todos: Todo[]): void {
    this.todos = [...todos];
    this.notifySubscribers();
  }

  subscribe(callback: (todos: Todo[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  // Test helper methods
  clear(): void {
    this.todos = [];
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback([...this.todos]));
  }
}
