import { Todo } from "./Todo";

export interface ITodoStore {
  getTodos(): Todo[];
  addTodo(todo: Todo): void;
  toggleTodo(id: string): void;
  removeTodo(id: string): void;
  setTodos(todos: Todo[]): void;
  subscribe(callback: (todos: Todo[]) => void): () => void;
}
