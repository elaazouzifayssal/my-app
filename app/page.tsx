"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { useUser } from "@clerk/nextjs";

type TODO = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};
export default function Home() {
  const [title, setTitle] = useState("");
  const [todos, setTodods] = useState<TODO[]>([]);
  const [completed, setCompleted] = useState(false);
  const { user } = useUser();

  async function handleAddTodo() {
    await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    FetchTodo();
  }

  async function FetchTodo() {
    const response = await fetch("/api/todos");
    const data = await response.json();

    setTodods(data);
  }

  async function PatchTodo(id: number, completed: boolean) {
    // Update UI instantly
    setTodods((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
    );

    // Sync with backend in background

    await fetch("/api/todos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, completed }),
    });
    FetchTodo();
  }

  async function DeleteTodo(id: number) {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    FetchTodo();
  }

  useEffect(() => {
    FetchTodo();
  }, []);

  return (
    <main className="max-w-xl mx-auto p-8">
      <div>Hello {user?.firstName} hhhh</div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">My Todos</h1>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button onClick={handleAddTodo} label="Add Task" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Tasks</h2>
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center border border-gray-200 rounded p-3 mb-2"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => PatchTodo(todo.id, e.target.checked)}
            />
            <span className="flex-1">{todo.title}</span>
            <button
              onClick={() => DeleteTodo(todo.id)}
              className="bg-blue-500 text-white px-1 py-1 rounded hover:bg-blue-600"
            >
              DELETE
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
