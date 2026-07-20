import { useEffect, useState } from "react";

export default function Todo() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = input.trim();

    if (!value) return;

    if (editingId) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId
            ? { ...todo, title: value }
            : todo
        )
      );

      setEditingId(null);
    } else {
      const newTodo = {
        id: crypto.randomUUID(),
        title: value,
        completed: false,
      };

      setTodos((prev) => [...prev, newTodo]);
    }

    setInput("");
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleToggle = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo
      )
    );
  };

  const handleEdit = (todo) => {
    setInput(todo.title);
    setEditingId(todo.id);
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every((todo) => todo.completed);

    setTodos((prev) =>
      prev.map((todo) => ({
        ...todo,
        completed: !allCompleted,
      }))
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const remaining = todos.filter((todo) => !todo.completed).length;

  return (
    <div
      style={{
        width: "500px",
        margin: "40px auto",
        fontFamily: "Arial",
      }}
    >
      <h2>Todo App</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            padding: "8px",
            width: "70%",
          }}
        />

        <button
          type="submit"
          style={{
            marginLeft: "10px",
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <br />

      <button onClick={handleToggleAll}>
        Toggle All
      </button>

      <button
        onClick={() => setFilter("all")}
        style={{ marginLeft: 10 }}
      >
        All
      </button>

      <button
        onClick={() => setFilter("active")}
      >
        Active
      </button>

      <button
        onClick={() => setFilter("completed")}
      >
        Completed
      </button>

      <button
        onClick={clearCompleted}
        style={{ marginLeft: 10 }}
      >
        Clear Completed
      </button>

      <p>
        <strong>{remaining}</strong> item(s) left
      </p>

      <ul style={{ padding: 0 }}>
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              listStyle: "none",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />

            <span
              style={{
                flex: 1,
                textDecoration: todo.completed
                  ? "line-through"
                  : "none",
                color: todo.completed
                  ? "gray"
                  : "black",
              }}
            >
              {todo.title}
            </span>

            <button
              onClick={() => handleEdit(todo)}
            >
              Edit
            </button>

            <button
              onClick={() =>
                handleDelete(todo.id)
              }
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p>No Todos Found</p>
      )}
    </div>
  );
}