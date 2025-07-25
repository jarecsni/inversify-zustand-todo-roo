import { injectable } from "inversify";
import { Todo, ITodoStore } from "@/types";
import { useTodoStore } from "./todoStore";

@injectable()
export class ZustandTodoStore implements ITodoStore {
  getTodos(): Todo[] {
    return useTodoStore.getState().todos;
  }

  addTodo(todo: Todo): void {
    useTodoStore.getState().addTodo(todo);
  }

  toggleTodo(id: string): void {
    useTodoStore.getState().toggleTodo(id);
  }

  removeTodo(id: string): void {
    useTodoStore.getState().removeTodo(id);
  }

  setTodos(todos: Todo[]): void {
    useTodoStore.getState().setTodos(todos);
  }

  subscribe(callback: (todos: Todo[]) => void): () => void {
    return useTodoStore.subscribe((state) => {
      callback(state.todos);
    });
  }
}
