import React, { useState } from "react";

interface AddTodoProps {
  onAddTodo: (text: string) => void;
}

export const AddTodo: React.FC<AddTodoProps> = ({ onAddTodo }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim());
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "6px",
            outline: "none",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#007acc";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#ddd";
          }}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          style={{
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: text.trim() ? "#007acc" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: text.trim() ? "pointer" : "not-allowed",
            transition: "background-color 0.2s",
          }}
        >
          Add Todo
        </button>
      </div>
    </form>
  );
};
