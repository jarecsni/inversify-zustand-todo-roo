import { Todo } from "./Todo";
import { IStore } from "./Store";

export interface ILoggingService {
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error): void;
}

export interface ITodoService {
  getTodos(): Todo[];
  addTodo(text: string): void;
  toggleTodo(id: string): void;
  removeTodo(id: string): void;
  subscribe(callback: (todos: Todo[]) => void): () => void;

  // Clean filter methods demonstrating collection capabilities
  getCompletedTodos(): Todo[];
  getActiveTodos(): Todo[];
}

// Type alias for Todo store - this enforces type safety at the container level
export type ITodoStore = IStore<Todo>;

// Theme interfaces
export interface Theme {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface IThemeService {
  getTheme(): Theme;
  setTheme(theme: Theme): void;
  subscribe(callback: (theme: Theme) => void): () => void;
}
