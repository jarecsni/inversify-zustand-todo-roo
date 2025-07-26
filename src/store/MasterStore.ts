import { injectable } from "inversify";
import { createStore } from "zustand/vanilla";

// StoreView interface for typed access to store slices
export interface StoreView<T> {
  get(): T;
  set(value: T): void;
  update(updater: (current: T) => T): void;
  subscribe(callback: (value: T) => void): () => void;
}

// Internal state interface for the master store
interface MasterStoreState {
  data: Record<string, any>;
  setData: (key: string, value: any) => void;
  updateData: (key: string, updater: (current: any) => any) => void;
}

// Implementation of StoreView that provides typed access to a store slice
class StoreViewImpl<T> implements StoreView<T> {
  constructor(
    private store: any, // Temporarily use any to fix the build
    private key: string,
    private defaultValue: T
  ) {}

  get(): T {
    const state = this.store.getState();
    return state.data[this.key] ?? this.defaultValue;
  }

  set(value: T): void {
    this.store.getState().setData(this.key, value);
  }

  update(updater: (current: T) => T): void {
    // Get current value with default fallback, then update
    const currentValue = this.get();
    const newValue = updater(currentValue);
    this.set(newValue);
  }

  subscribe(callback: (value: T) => void): () => void {
    return this.store.subscribe((state: MasterStoreState) => {
      const value = state.data[this.key] ?? this.defaultValue;
      callback(value);
    });
  }
}

// Master store that manages all application state
@injectable()
export class MasterStore {
  private store: any; // Temporarily use any to fix the build
  private viewCache = new Map<string, StoreView<any>>();

  constructor() {
    this.store = createStore<MasterStoreState>((set) => ({
      data: {},

      setData: (key: string, value: any) =>
        set((state) => ({
          data: { ...state.data, [key]: value },
        })),

      updateData: (key: string, updater: (current: any) => any) =>
        set((state) => ({
          data: {
            ...state.data,
            [key]: updater(state.data[key]),
          },
        })),
    }));
  }

  // Get a typed view into a store slice
  getStore<T>(key: string, defaultValue: T): StoreView<T> {
    // Use cached view if available
    if (this.viewCache.has(key)) {
      return this.viewCache.get(key) as StoreView<T>;
    }

    // Create new view and cache it
    const view = new StoreViewImpl(this.store, key, defaultValue);
    this.viewCache.set(key, view);
    return view;
  }

  // Get all data (for debugging/testing)
  getAllData(): Record<string, any> {
    return this.store.getState().data;
  }

  // Clear all data (for testing)
  clear(): void {
    // Use the existing setData method to clear each key
    const currentData = this.store.getState().data;
    Object.keys(currentData).forEach((key) => {
      this.store.getState().setData(key, undefined);
    });
    this.viewCache.clear();
  }
}
