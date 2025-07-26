import { injectable } from "inversify";
import { Todo, ITodoStore } from "@/types";

@injectable()
export class MockTodoStore implements ITodoStore {
  private items: Todo[] = [];
  private subscribers: Array<(items: Todo[]) => void> = [];

  getItems(): Todo[] {
    return [...this.items];
  }

  addItem(item: Todo): void {
    this.items.push(item);
    this.notifySubscribers();
  }

  updateItem(id: string, updater: (item: Todo) => Todo): void {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = updater(this.items[index]);
      this.notifySubscribers();
    }
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.notifySubscribers();
  }

  setItems(items: Todo[]): void {
    this.items = [...items];
    this.notifySubscribers();
  }

  findItem(predicate: (item: Todo) => boolean): Todo | undefined {
    return this.items.find(predicate);
  }

  subscribe(callback: (items: Todo[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  // Test helper methods
  clear(): void {
    this.items = [];
    this.notifySubscribers();
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback([...this.items]));
  }
}
