import { injectable } from "inversify";
import { StoreView, CollectionView, Identifiable } from "@/store/MasterStore";

// Mock implementation of StoreView for testing
class MockStoreView<T> implements StoreView<T> {
  private value: T;
  private defaultValue: T;
  private subscribers: ((value: T) => void)[] = [];

  constructor(defaultValue: T) {
    this.value = defaultValue;
    this.defaultValue = defaultValue;
  }

  get(): T {
    return this.value ?? this.defaultValue;
  }

  set(value: T): void {
    this.value = value;
    this.notifySubscribers();
  }

  update(updater: (current: T) => T): void {
    // Use get() to ensure we get the default value if current value is undefined
    const currentValue = this.get();
    this.value = updater(currentValue);
    this.notifySubscribers();
  }

  subscribe(callback: (value: T) => void): () => void {
    this.subscribers.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.value));
  }
}

// Mock implementation of CollectionView for testing
class MockCollectionView<T extends Identifiable> implements CollectionView<T> {
  private items: T[] = [];
  private subscribers: ((items: T[]) => void)[] = [];

  getItems(): T[];
  getItems(filter: (item: T) => boolean): T[];
  getItems(filter?: (item: T) => boolean): T[] {
    return filter ? this.items.filter(filter) : [...this.items];
  }

  addItem(item: Omit<T, "id">): T {
    const newItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
    } as T;

    this.items.push(newItem);
    this.notifySubscribers();
    return newItem;
  }

  updateItem(id: string, updater: (item: T) => T): void {
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

  findItem(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  subscribe(callback: (items: T[]) => void): () => void {
    this.subscribers.push(callback);

    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback([...this.items]));
  }
}

// Mock MasterStore for testing
@injectable()
export class MockMasterStore {
  private stores = new Map<string, any>(); // Store both StoreView and CollectionView

  getStore<T>(key: string, defaultValue: T): StoreView<T> {
    if (!this.stores.has(key)) {
      const store = new MockStoreView(defaultValue);
      this.stores.set(key, store);
      return store;
    }
    return this.stores.get(key) as StoreView<T>;
  }

  getCollection<T extends Identifiable>(key: string): CollectionView<T> {
    if (!this.stores.has(key)) {
      const collection = new MockCollectionView<T>();
      this.stores.set(key, collection);
      return collection;
    }
    return this.stores.get(key) as CollectionView<T>;
  }

  getAllData(): Record<string, any> {
    const result: Record<string, any> = {};
    this.stores.forEach((store, key) => {
      result[key] = store.get();
    });
    return result;
  }

  clear(): void {
    this.stores.clear();
  }

  // Test helper methods
  setStoreValue<T>(key: string, value: T): void {
    const store = this.stores.get(key) as MockStoreView<T>;
    if (store && "set" in store) {
      store.set(value);
    }
  }

  getStoreValue<T>(key: string): T | undefined {
    const store = this.stores.get(key) as MockStoreView<T>;
    return store && "get" in store ? store.get() : undefined;
  }

  // Collection helper methods
  setCollectionItems<T extends Identifiable>(key: string, items: T[]): void {
    const collection = this.stores.get(key) as MockCollectionView<T>;
    if (collection && "items" in collection) {
      (collection as any).items = [...items];
      (collection as any).notifySubscribers();
    }
  }

  getCollectionItems<T extends Identifiable>(key: string): T[] {
    const collection = this.stores.get(key) as MockCollectionView<T>;
    return collection && "getItems" in collection ? collection.getItems() : [];
  }
}
