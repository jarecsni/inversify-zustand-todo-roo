import React from "react";
import { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onRemove: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onRemove,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggle}
        style={{
          marginRight: "12px",
          width: "18px",
          height: "18px",
          cursor: "pointer",
        }}
      />

      <span
        style={{
          flex: 1,
          textDecoration: todo.completed ? "line-through" : "none",
          color: todo.completed ? "#888" : "#333",
          fontSize: "16px",
        }}
      >
        {todo.text}
      </span>

      <small
        style={{
          marginRight: "12px",
          color: "#999",
          fontSize: "12px",
        }}
      >
        {todo.createdAt.toLocaleDateString()}
      </small>

      <button
        onClick={onRemove}
        style={{
          padding: "6px 12px",
          fontSize: "14px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#c82333";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#dc3545";
        }}
      >
        Remove
      </button>
    </div>
  );
};
