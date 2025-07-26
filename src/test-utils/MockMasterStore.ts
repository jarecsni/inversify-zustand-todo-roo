import { injectable } from "inversify";
import { StoreView } from "@/store/MasterStore";

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

// Mock MasterStore for testing
@injectable()
export class MockMasterStore {
  private stores = new Map<string, MockStoreView<any>>();

  getStore<T>(key: string, defaultValue: T): StoreView<T> {
    if (!this.stores.has(key)) {
      const store = new MockStoreView(defaultValue);
      this.stores.set(key, store);
      return store;
    }
    return this.stores.get(key) as StoreView<T>;
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
    if (store) {
      store.set(value);
    }
  }

  getStoreValue<T>(key: string): T | undefined {
    const store = this.stores.get(key) as MockStoreView<T>;
    return store ? store.get() : undefined;
  }
}
