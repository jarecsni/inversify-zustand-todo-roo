import React from "react";
import { ITodoService, Todo } from "@/types";
import { TYPES } from "@/container";
import { useService } from "@/hooks/useContainer";
import { useStoreData } from "@/hooks/useStoreData";
import { TodoList } from "./TodoList";
import { AddTodo } from "./AddTodo";

export const TodoApp: React.FC = () => {
  const todoService = useService<ITodoService>(TYPES.TodoService);
  const todos = useStoreData(todoService, () => todoService.getTodos());

  const handleAddTodo = (text: string) => {
    todoService.addTodo(text);
  };

  const handleToggleTodo = (id: string) => {
    todoService.toggleTodo(id);
  };

  const handleRemoveTodo = (id: string) => {
    todoService.removeTodo(id);
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1>Todo App</h1>
        <p>Built with React, TypeScript, Inversify DI & Zustand</p>
        <div style={{ marginTop: "10px", color: "#666" }}>
          {completedCount} of {totalCount} completed
        </div>
      </header>

      <AddTodo onAddTodo={handleAddTodo} />

      <TodoList
        todos={todos}
        onToggleTodo={handleToggleTodo}
        onRemoveTodo={handleRemoveTodo}
      />

      {todos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            marginTop: "40px",
            fontStyle: "italic",
          }}
        >
          No todos yet. Add one above to get started!
        </div>
      )}
    </div>
  );
};
