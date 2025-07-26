// Generic store interface that can handle any type of item
export interface IStore<T> {
  // Basic CRUD operations
  getItems(): T[];
  addItem(item: T): void;
  updateItem(id: string, updater: (item: T) => T): void;
  removeItem(id: string): void;
  setItems(items: T[]): void;

  // Utility operations
  findItem(predicate: (item: T) => boolean): T | undefined;
  subscribe(callback: (items: T[]) => void): () => void;
}

// Type constraint for items that must have an id field
export interface Identifiable {
  id: string;
}
