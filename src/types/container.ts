import { Todo } from "./Todo";

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
}
