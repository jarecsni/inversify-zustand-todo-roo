import { injectable } from "inversify";
import { create } from "zustand";
import { IStore, Identifiable } from "@/types";

// Generic state interface for any identifiable item
export interface GenericState<T extends Identifiable> {
  items: T[];
  addItem: (item: T) => void;
  updateItem: (id: string, updater: (item: T) => T) => void;
  removeItem: (id: string) => void;
  setItems: (items: T[]) => void;
}

// Generic Zustand store creator
export function createGenericStore<T extends Identifiable>() {
  return create<GenericState<T>>((set) => ({
    items: [],

    addItem: (item: T) =>
      set((state) => ({
        items: [...state.items, item],
      })),

    updateItem: (id: string, updater: (item: T) => T) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? updater(item) : item
        ),
      })),

    removeItem: (id: string) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

    setItems: (items: T[]) => set({ items }),
  }));
}

// Generic store implementation that wraps Zustand
@injectable()
export class Store<T extends Identifiable> implements IStore<T> {
  private store: ReturnType<typeof createGenericStore<T>>;

  constructor() {
    this.store = createGenericStore<T>();
  }

  getItems(): T[] {
    return this.store.getState().items;
  }

  addItem(item: T): void {
    this.store.getState().addItem(item);
  }

  updateItem(id: string, updater: (item: T) => T): void {
    this.store.getState().updateItem(id, updater);
  }

  removeItem(id: string): void {
    this.store.getState().removeItem(id);
  }

  setItems(items: T[]): void {
    this.store.getState().setItems(items);
  }

  findItem(predicate: (item: T) => boolean): T | undefined {
    return this.getItems().find(predicate);
  }

  subscribe(callback: (items: T[]) => void): () => void {
    return this.store.subscribe((state) => {
      callback(state.items);
    });
  }
}
