"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";

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

  useEffect(() => {
    FetchTodo();
  }, []);

  return (
    <main className="max-w-xl mx-auto p-8">
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
            <span className="flex-1">{todo.title}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
